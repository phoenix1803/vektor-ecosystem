import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@prisma/client";
import { z } from "zod";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { findDemoUser } from "@/lib/demo-users";
import { getAuthSecret } from "@/lib/auth-secret";
import { getDefaultLandingPath } from "@/lib/rbac";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  otp: z.string().min(4).max(10).optional(),
});

function passwordMatches(input: string, stored: string | null | undefined) {
  if (!stored) {
    return false;
  }

  

  if (stored.startsWith("plain:")) {
    return stored.slice(6) === input;
  }

  return stored === input;
}

function isMfaRequired(role: Role) {
  if (process.env.MFA_ENFORCED !== "true") {
    return false;
  }

  return role === "SUPER_ADMIN" || role === "HOSPITAL_ADMIN";
}

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        if (isDatabaseConfigured) {
          const dbUser = await prisma.user.findUnique({
            where: { email: parsed.data.email.toLowerCase() },
            include: { hospital: true },
          });

          if (dbUser?.isActive && passwordMatches(parsed.data.password, dbUser.passwordHash)) {
            const mfaRequired = isMfaRequired(dbUser.role);
            const configuredOtp = process.env.MFA_TEST_OTP || "000000";
            const otpValid = !mfaRequired || parsed.data.otp === configuredOtp;

            if (!otpValid) {
              return null;
            }

            return {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.fullName,
              role: dbUser.role,
              hospitalId: dbUser.hospitalId,
              hospitalName: dbUser.hospital.name,
              mfaVerified: !mfaRequired || Boolean(parsed.data.otp),
            };
          }
        }

        const user = findDemoUser(parsed.data.email, parsed.data.password);
        if (!user) {
          return null;
        }

        const demoMfaRequired = isMfaRequired(user.role);
        const demoOtp = process.env.MFA_TEST_OTP || "000000";
        if (demoMfaRequired && parsed.data.otp !== demoOtp) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hospitalId: user.hospitalId,
          hospitalName: user.hospitalName,
          patientUhid: user.patientUhid,
          mfaVerified: !demoMfaRequired || Boolean(parsed.data.otp),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.hospitalId = (user as { hospitalId?: string }).hospitalId;
        token.hospitalName = (user as { hospitalName?: string }).hospitalName;
        token.patientUhid = (user as { patientUhid?: string }).patientUhid;
        token.mfaVerified = Boolean((user as { mfaVerified?: boolean }).mfaVerified);
        const userRole = ((user as { role?: string }).role ?? "HOSPITAL_ADMIN") as Role;
        token.landingPath = getDefaultLandingPath(userRole);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "HOSPITAL_ADMIN";
        session.user.hospitalId = (token.hospitalId as string) ?? "hsp_apollo_north";
        session.user.hospitalName = (token.hospitalName as string) ?? "Apollo North Campus";
        session.user.patientUhid = (token.patientUhid as string) ?? undefined;
        session.user.mfaVerified = Boolean(token.mfaVerified);
      }

      session.landingPath = (token.landingPath as string) ?? "/dashboard";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
