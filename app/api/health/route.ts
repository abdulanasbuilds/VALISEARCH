export async function GET(): Promise<Response> {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    app: "ValiSearch 2.0",
    version: "2.0.0",
    agents: 12,
    tools: 10,
  })
}
