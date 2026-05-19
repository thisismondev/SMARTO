import { Toaster } from "@/components/ui/sonner"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.1),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.14),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:72px_72px] opacity-70" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-xl">{children}</div>
      </section>
    </main>
  )
}
