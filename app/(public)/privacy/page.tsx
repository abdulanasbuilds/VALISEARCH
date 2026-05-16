import { ShieldCheck } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 blur-3xl -z-10" />
      
      <div className="mx-auto max-w-3xl px-6 py-24 relative z-10">
        <div className="mb-12 flex items-center gap-3">
           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldCheck className="h-5 w-5 text-primary" />
           </div>
           <div>
              <h1 className="text-3xl font-bold tracking-tight">Privacy Protocol</h1>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest mt-1">Version 1.0.0 • May 11, 2026</p>
           </div>
        </div>

        <div className="space-y-12 prose prose-invert max-w-none">
          <section className="p-8 rounded-2xl border border-border/40 bg-muted/5 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
               <span className="text-primary font-mono text-sm">01.</span> Data Acquisition
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              We collect information required to execute our analytical pipelines and maintain your account integrity:
            </p>
            <ul className="space-y-2 text-muted-foreground list-none pl-0">
              <li className="flex items-center gap-3 font-medium text-sm">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                 Authentication credentials (Email, Name)
              </li>
              <li className="flex items-center gap-3 font-medium text-sm">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                 Startup concepts & validation parameters
              </li>
              <li className="flex items-center gap-3 font-medium text-sm">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                 Encrypted payment metadata (via Stripe/Paystack)
              </li>
              <li className="flex items-center gap-3 font-medium text-sm">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                 System telemetry & usage logs
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-foreground/90">
               <span className="text-primary font-mono text-sm">02.</span> Intelligence Processing
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is utilized strictly for service delivery: executing agentic research, processing transactions, and optimizing the ValiSearch engine. We do not sell your startup ideas or personal telemetry to third-party brokers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-foreground/90">
               <span className="text-primary font-mono text-sm">03.</span> Infrastructure & Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All data is stored using Supabase's hardened infrastructure. We implement row-level security (RLS) and end-to-end encryption protocols to ensure your intellectual property remains private.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-foreground/90">
               <span className="text-primary font-mono text-sm">04.</span> Authorized Sub-Processors
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              To deliver high-fidelity analysis, we utilize the following technical endpoints:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
               <div className="p-4 rounded-xl border border-border/40 bg-muted/10">
                  <p className="font-bold text-sm mb-1">Financial Rails</p>
                  <p className="text-xs text-muted-foreground">Stripe, Paystack, Flutterwave</p>
               </div>
               <div className="p-4 rounded-xl border border-border/40 bg-muted/10">
                  <p className="font-bold text-sm mb-1">Inference & Search</p>
                  <p className="text-xs text-muted-foreground">OpenRouter (Claude/GPT), Jina AI</p>
               </div>
            </div>
          </section>

          <section className="pt-12 border-t border-border/40">
            <h2 className="mb-4 text-xl font-bold text-foreground/90">Questions?</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have concerns regarding our data protocol, please contact the security team at <span className="text-primary font-bold">hello@valisearch.ai</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}