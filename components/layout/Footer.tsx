import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">ValiSearch</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered startup intelligence for founders in Africa, Southeast Asia, and Latin America.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/changelog" className="hover:text-foreground">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/abdulanasbuilds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter
              </a>
              <a
                href="https://github.com/abdulanasbuilds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            Built with care for founders everywhere
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Made in Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  )
}