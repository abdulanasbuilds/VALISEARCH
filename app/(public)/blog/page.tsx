export const runtime = "edge"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, ChevronRight, BookOpen } from "lucide-react"

const POSTS = [
  {
    slug: "12-ai-agents-validate-startup-idea",
    title: "How 12 AI Agents Validate Your Startup Idea in Minutes",
    excerpt: "Traditional market research takes weeks. We built an agentic system that does it in seconds using 12 specialized AI agents working in parallel.",
    date: "May 10, 2026",
    category: "Product",
    readTime: "5 min read",
    highlight: true,
  },
  {
    slug: "why-founders-stuck-idea-validation",
    title: "Why Most Founders Get Stuck in Idea Validation",
    excerpt: "The biggest blocker to starting isn't funding or talent - it's the fear that your idea isn't good enough. Here's how to break through.",
    date: "May 05, 2026",
    category: "Insights",
    readTime: "4 min read",
    highlight: false,
  },
  {
    slug: "bootstrap-saas-ghana-2026",
    title: "Bootstrapping a SaaS from Ghana: Lessons Learned",
    excerpt: "Building a global AI product from Accra, Ghana with zero external funding. The challenges, the wins, and what's next.",
    date: "Apr 28, 2026",
    category: "Founder Story",
    readTime: "6 min read",
    highlight: false,
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-3xl -z-10" />
      
      <div className="mx-auto max-w-5xl px-6 py-24 relative z-10">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary tracking-wider uppercase">
            <BookOpen className="h-3 w-3" />
            Founder's Journal
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Insights on <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Intelligence.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Deep dives into agentic systems, startup validation frameworks, and the future of bootstrapping.
          </p>
        </div>

        <div className="grid gap-12">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className={`relative overflow-hidden transition-all duration-500 border-border/40 bg-background/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 rounded-2xl ${post.highlight ? 'p-1' : ''}`}>
                {post.highlight && (
                   <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 -z-10" />
                )}
                <div className="bg-background/90 rounded-[14px]">
                  <CardHeader className="pt-8 px-8">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-md font-mono text-[10px] tracking-widest uppercase py-1">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300 mb-4 leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                      Read Technical Deep Dive
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter / CTA Section */}
        <div className="mt-32 p-12 rounded-3xl border border-border/40 bg-muted/20 relative overflow-hidden text-center">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-3xl rounded-full -z-10"></div>
           <h2 className="text-3xl font-bold mb-4 tracking-tight">Stay ahead of the validation curve.</h2>
           <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join 2,500+ founders receiving our weekly breakdown of successful AI architectures and market gaps.</p>
           <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="w-full h-11 px-4 rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              <Button className="h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 w-full sm:w-auto">Subscribe</Button>
           </div>
        </div>
      </div>
    </div>
  )
}