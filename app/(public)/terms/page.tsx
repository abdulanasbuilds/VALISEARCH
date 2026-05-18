import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-3xl -z-10" />
      
      <div className="mx-auto max-w-3xl px-6 py-24 relative z-10">
        <div className="mb-12 flex items-center gap-3">
           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
           </div>
           <div>
              <h1 className="text-3xl font-bold tracking-tight">Terms of Operation</h1>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest mt-1">Version 1.0.0 • May 11, 2026</p>
           </div>
        </div>

        <div className="space-y-12 prose prose-invert max-w-none">
          <section className="p-8 rounded-2xl border border-border/40 bg-muted/5 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
               <span className="text-primary font-mono text-sm">01.</span> Acceptance of Protocol
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and utilizing the ValiSearch analytical engine, you agree to be bound by the operational protocols and provisions detailed in this agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-foreground/90">
               <span className="text-primary font-mono text-sm">02.</span> Intelligence License
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              We grant you a non-exclusive, non-transferable license to utilize the AI-generated reports for your internal business validation purposes.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You are prohibited from reverse-engineering the agentic architecture, scraping our data streams, or utilizing the output to train competing generative models.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-foreground/90">
               <span className="text-primary font-mono text-sm">03.</span> Compute Allocation & Billing
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Subscription tiers determine your monthly compute capacity (tokens). Tokens are non-refundable and do not roll over across billing cycles.
            </p>
            <p className="text-muted-foreground leading-relaxed font-medium italic">
              "We provide a sophisticated engine, but final business decisions remain your responsibility."
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-foreground/90">
               <span className="text-primary font-mono text-sm">04.</span> Disclaimer of Determinism
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              While our 12-agent pipeline utilizes high-fidelity data sources, the scores and verdicts are probabilistic in nature. ValiSearch provides intelligence, not guarantees. Always conduct independent due diligence.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-foreground/90">
               <span className="text-primary font-mono text-sm">05.</span> Contact & Support
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For operational inquiries or protocol clarifications, please contact <span className="text-primary font-bold">hello@valisearch.ai</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
