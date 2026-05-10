import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    landingPath?: string;
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      hospitalId: string;
      hospitalName: string;
      patientUhid?: string;
      mfaVerified?: boolean;
    };
  }

  interface User {
    role: string;
    hospitalId: string;
    hospitalName: string;
    patientUhid?: string;
    mfaVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    hospitalId?: string;
    hospitalName?: string;
    patientUhid?: string;
    mfaVerified?: boolean;
    landingPath?: string;
  }
}
