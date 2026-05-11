import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const POSTS = [
  {
    slug: "12-ai-agents-validate-startup-idea",
    title: "How 12 AI Agents Validate Your Startup Idea in Minutes",
    excerpt: "Traditional market research takes weeks. We built an agentic system that does it in seconds using 12 specialized AI agents working in parallel.",
    date: "2026-05-10",
    category: "Product",
    readTime: "5 min read",
  },
  {
    slug: "why-founders-stuck-idea-validation",
    title: "Why Most Founders Get Stuck in Idea Validation",
    excerpt: "The biggest blocker to starting isn't funding or talent - it's the fear that your idea isn't good enough. Here's how to break through.",
    date: "2026-05-05",
    category: "Insights",
    readTime: "4 min read",
  },
  {
    slug: "bootstrap-saas-ghana-2026",
    title: "Bootstrapping a SaaS from Ghana: Lessons Learned",
    excerpt: "Building a global AI product from Accra, Ghana with zero external funding. The challenges, the wins, and what's next.",
    date: "2026-04-28",
    category: "Founder Story",
    readTime: "6 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Insights on startup validation, AI, and building from Africa
          </p>
        </div>

        <div className="grid gap-6">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}