"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { POSTS, BlogPost } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark, 
  ArrowRight, 
  Sparkles,
  Info,
  CheckCircle2
} from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params)
  const post = POSTS[slug]

  const [activeHeading, setActiveHeading] = useState<string>("")
  const [copied, setCopied] = useState(false)

  if (!post) {
    notFound()
  }

  // Retrieve top 3 other posts for recommendation
  const nextUpPosts = Object.values(POSTS)
    .filter((p) => p.slug !== slug)
    .slice(0, 3)

  // Dynamically extract H2 headings for Table of Contents
  const headings = post.content
    .filter((c) => c.type === "heading2")
    .map((c) => c.text)

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => {
        const id = h.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        return document.getElementById(id)
      })

      const scrollPosition = window.scrollY + 200

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i]
        if (el && scrollPosition >= el.offsetTop) {
          setActiveHeading(headings[i] || "")
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background relative text-foreground">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Back Button */}
        <div className="mb-12">
          <Link href="/blog">
            <Button variant="ghost" className="h-10 px-4 border border-subtle hover:bg-muted rounded-lg group text-xs font-mono uppercase tracking-wider">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Library
            </Button>
          </Link>
        </div>

        {/* Dynamic Multi-Column Hub Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Article Workspace: Left 8 Columns */}
          <article className="lg:col-span-8">
            <header className="mb-12 border-b border-subtle pb-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary rounded py-1 px-3 uppercase text-[10px] font-mono tracking-widest">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-tight text-foreground">
                {post.title}
              </h1>

              {/* Author and Social Shares */}
              <div className="flex items-center justify-between py-4 border-t border-subtle">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm shadow-sm">
                    {post.author.avatarText}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{post.author.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest leading-none">{post.author.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={copyToClipboard}
                    className="h-9 w-9 rounded-lg border border-subtle"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-subtle">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Core Reading content container locked between 650px - 750px width */}
            <div className="prose prose-invert max-w-[700px] mx-auto text-[16px] md:text-[18px] leading-relaxed text-muted-foreground space-y-8">
              {post.content.map((block, idx) => {
                const elementId = block.type === "heading2" 
                  ? block.text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
                  : undefined

                switch(block.type) {
                  case "paragraph":
                    return (
                      <p 
                        key={idx} 
                        className="text-muted-foreground text-lg leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{ __html: block.text }}
                      />
                    )

                  case "heading2":
                    return (
                      <h2 
                        id={elementId}
                        key={idx} 
                        className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-12 mb-4 pt-4 border-b border-subtle pb-2"
                      >
                        {block.text}
                      </h2>
                    )

                  case "heading3":
                    return (
                      <h3 
                        key={idx} 
                        className="text-xl font-bold text-foreground/90 mt-8 mb-3"
                      >
                        {block.text}
                      </h3>
                    )

                  case "bullet":
                    return (
                      <ul key={idx} className="my-6 space-y-4 pl-0">
                        {block.items?.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground text-base md:text-lg leading-relaxed">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-3" />
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    )

                  case "numbered":
                    return (
                      <ol key={idx} className="my-6 space-y-4 pl-0">
                        {block.items?.map((item, i) => (
                          <li key={i} className="flex items-start gap-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                            <span className="font-mono text-primary font-bold text-sm mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ol>
                    )

                  case "callout":
                    const calloutStyles = block.calloutType === "warning"
                      ? "border-amber-500/20 bg-amber-500/5 text-amber-200"
                      : block.calloutType === "note"
                      ? "border-blue-500/20 bg-blue-500/5 text-blue-200"
                      : "border-green-500/20 bg-green-500/5 text-green-200" // tip default

                    return (
                      <div 
                        key={idx} 
                        className={`p-5 rounded-xl border flex gap-3 text-sm md:text-base leading-relaxed ${calloutStyles}`}
                      >
                        <Info className="h-5 w-5 shrink-0 mt-0.5 opacity-80" />
                        <div>
                          <span className="font-bold block uppercase tracking-wider text-[10px] font-mono opacity-80 mb-1">{block.calloutType || "Tip"}</span>
                          <span dangerouslySetInnerHTML={{ __html: block.text }} />
                        </div>
                      </div>
                    )

                  default:
                    return null
                }
              })}
            </div>
          </article>

          {/* Sticky Sidebar Component: Right 4 Columns */}
          <aside className="lg:col-span-4 sticky top-28 space-y-8 hidden lg:block">
            
            {/* Table of Contents Widget */}
            <div className="border border-subtle rounded-2xl p-6 bg-muted/10 shadow-sm">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-4 border-b border-subtle pb-2">
                Table of Contents
              </span>
              <ul className="space-y-3">
                {headings.map((heading) => {
                  const headingId = heading.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
                  const isCurrent = activeHeading === heading
                  
                  return (
                    <li key={heading}>
                      <a 
                        href={`#${headingId}`}
                        className={`text-xs font-semibold block transition-colors leading-normal ${
                          isCurrent 
                            ? "text-primary pl-2 border-l-2 border-primary" 
                            : "text-muted-foreground hover:text-foreground pl-2 border-l border-subtle"
                        }`}
                      >
                        {heading}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* High-Converting native Lead Widget */}
            <div className="border border-primary/20 rounded-2xl p-6 bg-primary/5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 rounded-full" />
              <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" />
                Validation Platform
              </div>
              <h4 className="text-lg font-bold tracking-tight text-foreground mb-2">
                Audit your startup idea in under 90s.
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Deploy 12 parallel AI agents to audit market trends, competitors, and unit economics with a single click.
              </p>
              <Link href="/register">
                <Button className="w-full h-11 rounded-lg font-semibold flex items-center justify-center gap-2">
                  Launch Free Validation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

          </aside>

        </div>

        {/* Bottom Next Up Recommendation Section */}
        <section className="mt-32 pt-16 border-t border-subtle">
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Next Up.
            </h3>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              More strategic deep-dives
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {nextUpPosts.map((post) => (
              <div 
                key={post.slug}
                className="surface-card p-6 rounded-2xl border border-subtle hover:border-primary/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase text-primary font-bold tracking-widest">{post.category}</span>
                    <span className="text-xs text-muted-foreground font-mono">{post.readTime}</span>
                  </div>
                  <h4 className="text-lg font-bold tracking-tight text-foreground mb-2 leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed truncate-2-lines">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-subtle flex justify-end">
                  <Link href={`/blog/${post.slug}`} className="text-xs font-bold flex items-center gap-1 hover:text-primary transition-colors">
                    Read Article
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}