import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req: Request) => {
  const timestamp = new Date().toISOString()
  
  return new Response(JSON.stringify({
    status: "ok",
    timestamp,
    message: "ValiSearch is alive"
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})