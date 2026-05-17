export const runtime = "edge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, Target, Zap, Globe, ShieldCheck, Cpu } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50 -z-10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] -z-20" />

      <div className="mx-auto max-w-5xl px-6 py-24 relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary tracking-wider uppercase">
            <ShieldCheck className="h-3 w-3" />
            Our Protocol
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground md:text-7xl leading-[1.1]">
            Democratizing <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">Startup Intel.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            ValiSearch is an agentic intelligence layer designed to eliminate the friction between a great idea and a validated startup venture.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-24 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
           <div className="relative rounded-3xl border border-border/40 bg-background/80 backdrop-blur-2xl p-10 md:p-16 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <BrainCircuit className="h-32 w-32" />
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight">The Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                We believe every founder deserves access to the same quality of market intelligence that Fortune 500 companies possess. 
                Whether you're building from San Francisco, Lagos, or Accra, ValiSearch deploys 12 specialized AI agents working in parallel to ensure your concept is built on a foundation of data, not guesswork.
              </p>
           </div>
        </div>

        <div className="mb-24 grid gap-8 md:grid-cols-2">
          <Card className="border-border/40 bg-muted/5 backdrop-blur-xl hover:border-primary/40 transition-all duration-300 rounded-2xl group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">12 Parallel Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Our architecture deploys agents across 12 distinct dimensions simultaneously - from competitor indexing to viral loop analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-muted/5 backdrop-blur-xl hover:border-primary/40 transition-all duration-300 rounded-2xl group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle className="text-xl font-bold">Deterministic Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Complexity shouldn't mean delay. We complete full-spectrum market validation in under 90 seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-muted/5 backdrop-blur-xl hover:border-primary/40 transition-all duration-300 rounded-2xl group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold">Live Data Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Every report is anchored in live data from web search, social sentiment, and developer communities like Hacker News.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-muted/5 backdrop-blur-xl hover:border-primary/40 transition-all duration-300 rounded-2xl group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-pink-500" />
              </div>
              <CardTitle className="text-xl font-bold">Universal Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Global support for founders across Africa and the world via Stripe, Flutterwave, and Paystack. No barriers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Founder Spotlight */}
        <div className="relative group">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
           <div className="relative rounded-3xl border border-border/40 bg-background/50 backdrop-blur-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-10">
                 <div className="relative shrink-0">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl overflow-hidden group-hover:rotate-3 transition-transform duration-500">
                       <span className="text-5xl md:text-6xl font-black text-white">AA</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-lg">
                       <Cpu className="h-5 w-5 text-primary" />
                    </div>
                 </div>
                 <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Abdul Anas</h3>
                    <p className="text-primary font-mono text-xs uppercase tracking-widest mb-4">Founder & Systems Architect</p>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">
                      ValiSearch is built by Abdul Anas, a solo founder from Accra, Ghana. His vision is to equip every builder with the tools needed to navigate the startup landscape with mathematical precision.
                    </p>
                    <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
                       <div className="h-1 w-12 bg-primary rounded-full" />
                       <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">EST. 2026 ACCRA, GHANA</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}