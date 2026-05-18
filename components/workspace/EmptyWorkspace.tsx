import { Terminal } from "lucide-react"

export function EmptyWorkspace() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center p-8 border border-dashed border-border/40 rounded-xl bg-muted/5 mt-8">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <Terminal className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mb-2 text-lg font-mono font-semibold tracking-tight">SYSTEM STANDBY</h2>
      <p className="text-sm text-muted-foreground font-mono text-center max-w-sm">
        No analytical pipelines have been executed in this environment yet. Use the initialization interface above to begin.
      </p>
    </div>
  )
}
