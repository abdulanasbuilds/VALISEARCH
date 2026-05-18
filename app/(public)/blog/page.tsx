"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { POSTS } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, Sparkles, Send, CheckCircle2 } from "lucide-react"

// Custom premium SVG mockups to represent real product graphics
function AgentArchitectureVisual() {
  return (
    <div className="w-full h-full min-h-[260px] bg-slate-950 rounded-xl border border-border p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="flex items-center justify-between border-b border-border pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Pipeline Orchestrator</span>
      </div>

      <div className="my-6 flex justify-around items-center relative z-10">
        {/* Parallel Agent Nodes */}
        <div className="flex flex-col gap-2">
          <div className="px-3 py-1.5 rounded bg-muted border border-border text-[10px] font-mono text-foreground shadow-sm flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Validator
          </div>
          <div className="px-3 py-1.5 rounded bg-muted border border-border text-[10px] font-mono text-foreground shadow-sm flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Competitors
          </div>
          <div className="px-3 py-1.5 rounded bg-muted border border-border text-[10px] font-mono text-foreground shadow-sm flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Social Search
          </div>
        </div>

        {/* Synthesis Hub Arrow */}
        <div className="flex flex-col items-center justify-center">
          <ArrowRight className="h-5 w-5 text-muted-foreground animate-pulse" />
        </div>

        {/* Unified Output Node */}
        <div className="surface-card p-4 border border-primary/30 rounded-lg shadow-xl text-center flex flex-col items-center">
          <span className="text-[9px] font-mono text-primary uppercase tracking-widest mb-1.5">Viability Hub</span>
          <div className="text-3xl font-bold tracking-tighter text-foreground">82%</div>
          <div className="mt-2 text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-semibold">Strong signal</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground border-t border-border pt-3 relative z-10">
        <span>Active Runs: 12 Parallel Agents</span>
        <span>Runtime: 88.4s</span>
      </div>
    </div>
  )
}

function ValidationTrapVisual() {
  return (
    <div className="w-full h-full min-h-[200px] bg-slate-950 rounded-xl border border-border p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="flex items-center justify-between border-b border-border pb-3 relative z-10">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Riskiest Assumption Audit</span>
      </div>

      <div className="my-4 flex flex-col gap-3 relative z-10">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-medium text-foreground">
            <span>Code Writing (No validation)</span>
            <span className="text-red-500 font-mono">High Risk</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-[90%]" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-medium text-foreground">
            <span>48h Intent Signaling</span>
            <span className="text-green-500 font-mono">Validated</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[30%]" />
          </div>
        </div>
      </div>

      <span className="text-[10px] font-mono text-center text-muted-foreground block border-t border-border pt-3 relative z-10">
        Build less. Test core assumptions first.
      </span>
    </div>
  )
}

function SoloFounderVisual() {
  return (
    <div className="w-full h-full min-h-[200px] bg-slate-950 rounded-xl border border-border p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="flex items-center justify-between border-b border-border pb-3 relative z-10">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Global Payout Stack</span>
      </div>

      <div className="my-4 flex items-center justify-center gap-4 relative z-10">
        <div className="px-3 py-2 border border-border bg-muted rounded text-[10px] font-mono font-bold text-foreground">
          Paystack
        </div>
        <span className="text-muted-foreground text-xs">+</span>
        <div className="px-3 py-2 border border-border bg-muted rounded text-[10px] font-mono font-bold text-foreground">
          Flutterwave
        </div>
      </div>

      <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground border-t border-border pt-3 relative z-10">
        <span>Accra Edge Node</span>
        <span className="text-green-500 font-semibold">MoMo & Cards Active</span>
      </div>
    </div>
  )
}

function GrowthLoopsVisual() {
  return (
    <div className="w-full h-full min-h-[200px] bg-slate-950 rounded-xl border border-border p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="flex items-center justify-between border-b border-border pb-3 relative z-10">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Programmatic SEO Growth</span>
      </div>

      <div className="my-4 flex flex-col justify-center items-center relative z-10">
        <div className="text-xs font-mono text-muted-foreground mb-2">Compounding Organic Traffic</div>
        <div className="w-full h-12 flex items-end gap-1 px-4">
          {[10, 15, 25, 45, 60, 95].map((h, i) => (
            <div key={i} className="flex-1 bg-primary rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <div className="text-[10px] font-mono text-center text-muted-foreground border-t border-border pt-3 relative z-10">
        0% Paid Ads • 100% SEO Conversion Loops
      </div>
    </div>
  )
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState("")

  const categories = ["All", "Engineering", "Product", "Strategy", "Growth"]

  const allPosts = Object.values(POSTS)
  const featuredPost = allPosts.find((p) => p.slug === "how-12-ai-agents-validate-startup-idea")!
  const remainingPosts = allPosts.filter((p) => p.slug !== "how-12-ai-agents-validate-startup-idea")

  const filteredPosts = activeCategory === "All"
    ? remainingPosts
    : remainingPosts.filter((p) => p.category === activeCategory)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* Background Decor Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] -z-10 rounded-full" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        
        {/* Above-the-Fold Featured Post Hero Section */}
        <section className="mb-24 md:mb-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left: Headline & Call To Action */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Featured Editorial
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {featuredPost.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground font-mono">
                <Badge variant="outline" className="border-border bg-muted rounded py-1 px-3 uppercase text-[10px]">
                  {featuredPost.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {featuredPost.readTime}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Button className="h-12 px-6 rounded-lg font-semibold flex items-center gap-2">
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="ghost" className="h-12 px-6 font-semibold border border-border hover:bg-muted rounded-lg">
                    Deploy Free Validation
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Sleek custom SVG application mockup */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl -z-10" />
              <div className="border border-border p-3 rounded-2xl bg-muted/30">
                <AgentArchitectureVisual />
              </div>
            </div>
            
          </div>
        </section>

        {/* Sticky Category Sub-Navigation Bar */}
        <section className="mb-12 border-b border-border sticky top-16 bg-background/80 backdrop-blur-md z-40 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all shrink-0 ${
                  activeCategory === category
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/40 text-muted-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <span className="hidden md:inline-block text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            Library Engine
          </span>
        </section>

        {/* Asymmetric Content Grid */}
        <section className="mb-24 md:mb-32">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            >
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="surface-card flex flex-col justify-between p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors group relative shadow-sm"
                >
                  <div className="flex flex-col gap-6">
                    {/* Category Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-primary font-bold tracking-widest">{post.category}</span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </div>
                    </div>

                    {/* Highly Clean Functional SVG Mockups in cards */}
                    <div className="border border-border rounded-xl p-2 bg-muted/40 overflow-hidden">
                      {post.slug === "why-founders-stuck-idea-validation" && <ValidationTrapVisual />}
                      {post.slug === "bootstrap-saas-ghana-2026" && <SoloFounderVisual />}
                      {post.slug === "customer-acquisition-channels-b2b" && <GrowthLoopsVisual />}
                    </div>

                    {/* Details */}
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-border pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-foreground">
                        {post.author.avatarText}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{post.author.name}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-xs font-bold flex items-center gap-1 hover:text-primary transition-colors">
                      Read Deep-Dive
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Mid-Page Lead Magnet CTA Break Banner */}
        <section className="p-8 md:p-12 rounded-2xl border border-border bg-muted/20 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-left max-w-lg">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                 Lead Magnet Download
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
                The 2026 Startup Validation Benchmark Report
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Analyze anonymized validation trends across 5,000+ software products. Discover market demand shifts and baseline traction parameters.
              </p>
            </div>

            <div className="w-full md:w-auto shrink-0">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                {subscribed ? (
                  <div className="h-11 px-6 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Report Link Sent!
                  </div>
                ) : (
                  <>
                    <input
                      type="email"
                      required
                      placeholder="Enter your work email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 px-4 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors min-w-[220px]"
                    />
                    <Button type="submit" className="h-11 px-6 rounded-lg font-semibold flex items-center gap-2">
                      Get Free Access
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
