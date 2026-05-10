'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bed,
  BellRing,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  Landmark,
  MessageSquareWarning,
  Microscope,
  Pill,
  QrCode,
  Radar,
  Settings,
  Shield,
  ShieldAlert,
  Stethoscope,
  UserRound,
  Users,
  Wallet,
  Warehouse,
  Waypoints,
  Wrench,
} from 'lucide-react';

const moduleCards = [
  {
    name: 'Executive Dashboard',
    description: 'Live command center for occupancy, throughput, risk, and financial signals.',
    icon: Activity,
    href: '/dashboard',
  },
  {
    name: 'Emergency Alerts',
    description: 'Incident queue with rapid acceptance, routing, and briefing handoff.',
    icon: AlertTriangle,
    href: '/emergency',
  },
  {
    name: 'Patients',
    description: 'Patient registry, identity context, and longitudinal care visibility.',
    icon: UserRound,
    href: '/patients',
  },
  {
    name: 'Appointments',
    description: 'Sloting, queues, and clinician schedule orchestration across departments.',
    icon: CalendarDays,
    href: '/appointments',
  },
  {
    name: 'Clinical / EMR',
    description: 'SOAP workflows, encounter management, diagnostics, and treatment records.',
    icon: Stethoscope,
    href: '/emr',
  },
  {
    name: 'Lab & Diagnostics',
    description: 'Order lifecycle, sample handling, and diagnostics reporting workflows.',
    icon: FlaskConical,
    href: '/lab',
  },
  {
    name: 'Pharmacy',
    description: 'Prescription validation, dispensing controls, and formulary governance.',
    icon: Pill,
    href: '/pharmacy',
  },
  {
    name: 'Inpatient / Ward',
    description: 'Bed board operations, ward workflows, and inpatient continuity of care.',
    icon: Bed,
    href: '/ward',
  },
  {
    name: 'Billing & Finance',
    description: 'Claims, invoicing, reconciliation, and revenue integrity management.',
    icon: Wallet,
    href: '/billing',
  },
  {
    name: 'Inventory',
    description: 'Stock visibility, reorder decisions, and supply chain accountability.',
    icon: Warehouse,
    href: '/inventory',
  },
  {
    name: 'Maintenance',
    description: 'Asset uptime planning, biomedical maintenance, and task tracking.',
    icon: Wrench,
    href: '/maintenance',
  },
  {
    name: 'Administration & HR',
    description: 'Workforce records, staffing controls, and role-level operations alignment.',
    icon: Users,
    href: '/hr',
  },
  {
    name: 'Analytics',
    description: 'Executive and operational insight models for continuous performance review.',
    icon: Activity,
    href: '/analytics',
  },
  {
    name: 'Settings',
    description: 'Platform governance, policy controls, and integration management.',
    icon: Settings,
    href: '/settings',
  },
];

const flowSteps = [
  {
    title: 'LoRa hardware detects trigger',
    icon: Radar,
  },
  {
    title: 'AI verifies via camera',
    icon: Microscope,
  },
  {
    title: 'Agents find best hospital + doctor',
    icon: Waypoints,
  },
  {
    title: 'Doctor briefed before patient arrives',
    icon: ClipboardList,
  },
  {
    title: 'Responder gets flash screen',
    icon: BellRing,
  },
];

const agentCards = [
  {
    name: 'Verifier',
    detail: 'Confirms events from camera input and suppresses false positives.',
    icon: Shield,
  },
  {
    name: 'Dispatcher',
    detail: 'Coordinates authorities, ambulance dispatch, and escalation actions.',
    icon: MessageSquareWarning,
  },
  {
    name: 'Evac Router',
    detail: 'Computes safest evacuation path from floor plan context in real time.',
    icon: Waypoints,
  },
  {
    name: 'Comms',
    detail: 'Delivers role-specific guidance to staff, responders, and relatives.',
    icon: HeartPulse,
  },
  {
    name: 'Patient ID',
    detail: 'Builds instant patient profile via QR, face cues, and medical summary.',
    icon: QrCode,
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && Boolean(session?.user);
  const isSessionLoading = status === 'loading';
  const role = session?.user?.role;
  const isPatient = role === 'PATIENT';

  const visibleModules = isPatient ? moduleCards.filter((card) => card.href !== '/dashboard') : moduleCards;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Vektor Core</p>
            <p className="text-xs text-foreground/70">One pulse. Every patient.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/register"
              className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-surface-strong"
            >
              Request Demo
            </Link>
            {isSessionLoading ? (
              <span className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground/60">
                Checking session
              </span>
            ) : isLoggedIn ? (
              <>
                {isPatient ? (
                  <Link
                    href="/portal"
                    className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong"
                  >
                    Open Patient Portal
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong"
                  >
                    Enter Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-surface-strong"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong"
              >
                Staff Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-8 md:px-10 md:py-10">
        <section className="panel soft-grid p-8 md:p-10">
          <span className="chip border-brand/30 bg-brand-soft text-brand">Hospital Operating Platform</span>
          <h1 className="mt-4 max-w-5xl text-4xl leading-tight md:text-6xl">
            The command surface for every patient moment and every crisis.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-foreground/80 md:text-lg">
            Vektor Core combines enterprise-grade hospital operations with an AI-powered rapid crisis response layer,
            so administrators can run daily workflows and high-stakes incidents from one unified control plane.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {isLoggedIn && isPatient ? (
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong"
              >
                Open Patient Portal
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong"
              >
                Enter Dashboard
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-5 py-3 text-sm font-semibold text-danger transition hover:bg-danger/15"
            >
              See Emergency Demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['14+ Modules', 'Real-time Emergency', 'AI Agents', 'FHIR Ready'].map((item) => (
              <div key={item} className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-foreground/85">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="panel border-brand/20 bg-brand-soft/60 p-6">
            <span className="chip border-brand/30 bg-white text-brand">Hospital Management</span>
            <div className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl">Complete clinical, billing, and operations platform</h2>
            <ul className="mt-4 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
              <li>EMR</li>
              <li>Lab</li>
              <li>Pharmacy</li>
              <li>Billing</li>
              <li>Ward</li>
              <li>Analytics</li>
              <li>HR</li>
            </ul>
            {isPatient ? (
              <Link href="/portal" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                View my portal
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                Explore HMS
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </article>

          <article className="panel border-danger/20 bg-danger/5 p-6">
            <span className="chip border-danger/30 bg-danger/10 text-danger">Rapid Crisis Response</span>
            <div className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-danger">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl">AI-powered emergency coordination from trigger to treatment</h2>
            <ul className="mt-4 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
              <li>Voice trigger</li>
              <li>Vision AI verification</li>
              <li>Multi-agent pipeline</li>
              <li>Doctor briefing</li>
              <li>Responder flash screen</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/emergency"
                className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger transition hover:bg-danger/15"
              >
                See Crisis Demo
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/dashboard/rcr-command-center"
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-surface-strong"
              >
                Open RCR Command Center
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </section>

        <section className="panel bg-brand p-8 text-white">
          <h2 className="text-center text-2xl font-semibold">Built for India's Emergency Healthcare Reality</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold">2.5s</p>
              <p className="mt-1 text-sm text-white/80">Pipeline completion</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">14+</p>
              <p className="mt-1 text-sm text-white/80">HMS modules</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">6</p>
              <p className="mt-1 text-sm text-white/80">AI agents</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">0</p>
              <p className="mt-1 text-sm text-white/80">Manual coordination steps</p>
            </div>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-xl font-semibold">Try a Role</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              { role: "Admin", email: "admin@vektorcore.health", className: "bg-brand text-white" },
              { role: "Doctor", email: "doctor@vektorcore.health", className: "bg-success text-white" },
              { role: "Patient", email: "patient@vektorcore.health", className: "bg-brand-soft text-brand" },
              { role: "Nurse", email: "nurse@vektorcore.health", className: "bg-warning text-white" },
            ].map((item) => (
              <Link
                key={item.role}
                href={`/login?prefill=${item.email}`}
                className={`rounded-xl p-4 text-center text-sm font-semibold ${item.className}`}
              >
                Login as {item.role}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-foreground/50">Demo password: VektorCore@2026</p>
        </section>

        <section className="panel p-6">
          <h2 className="text-3xl">From accident to informed treatment. Under 10 minutes.</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-5">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="chip border-line bg-surface text-foreground/75">Step {index + 1}</span>
                    <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-snug text-foreground/85">{step.title}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-3xl">Every hospital workflow. One platform.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleModules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  href={module.href}
                  key={module.name}
                  className="rounded-xl border border-line bg-white p-4 transition hover:border-brand/40"
                >
                  <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                  <h3 className="mt-2 text-base font-semibold">{module.name}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{module.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-3xl">Five agents. One orchestrator. Zero manual coordination.</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {agentCards.map((agent) => {
              const Icon = agent.icon;
              return (
                <article key={agent.name} className="rounded-xl border border-line bg-white p-4">
                  <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                  <h3 className="mt-2 text-base font-semibold">{agent.name}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{agent.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-3xl">Designed for Indian healthcare</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl border border-line bg-white p-4">
              <Shield className="h-4 w-4 text-brand" aria-hidden="true" />
              <h3 className="mt-2 text-base font-semibold">ABDM and ABHA integration</h3>
              <p className="mt-1 text-sm text-foreground/70">Interoperability-ready patient identity and health data exchange workflows.</p>
            </article>
            <article className="rounded-xl border border-line bg-white p-4">
              <Landmark className="h-4 w-4 text-brand" aria-hidden="true" />
              <h3 className="mt-2 text-base font-semibold">DPDP Act compliance</h3>
              <p className="mt-1 text-sm text-foreground/70">Privacy-first access controls and traceable operational governance.</p>
            </article>
            <article className="rounded-xl border border-line bg-white p-4">
              <Wallet className="h-4 w-4 text-brand" aria-hidden="true" />
              <h3 className="mt-2 text-base font-semibold">GST-compliant billing</h3>
              <p className="mt-1 text-sm text-foreground/70">Financial workflows aligned for Indian invoicing and taxation standards.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 md:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Vektor Core</p>
            <p className="text-xs text-foreground/70">Built for Google Solution Challenge · SDG 3 · SDG 11</p>
          </div>
          <Link href="/login" className="text-sm font-semibold text-brand hover:underline">
            Staff Login
          </Link>
        </div>
      </footer>
    </div>
  );
}
