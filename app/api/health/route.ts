export const runtime = "edge"

export function GET(): Response {
  return new Response(
    JSON.stringify({
      status: "ok",
      timestamp: new Date().toISOString(),
      app: "ValiSearch 2.0",
      version: "2.0.0",
      agents: 12,
      tools: 10,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}