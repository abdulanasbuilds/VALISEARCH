// LangSmith tracing client — dynamically imported so it's optional at runtime
// Avoids "Module not found" errors when langsmith is not installed

let langsmithClient: { createRun: Function; updateRun: Function } | null = null

async function getClient(): Promise<{ createRun: Function; updateRun: Function } | null> {
  if (typeof process.env.LANGCHAIN_API_KEY === "undefined") {
    return null
  }
  if (!langsmithClient) {
    try {
      const { Client } = await import("langsmith")
      langsmithClient = new Client({
        apiKey: process.env.LANGCHAIN_API_KEY,
      })
    } catch {
      return null
    }
  }
  return langsmithClient
}

export interface TraceMetadata {
  agentName: string
  userId: string
  analysisId: string
  model: string
  userPlan: string
}

export async function traceAgentCall<T>(
  metadata: TraceMetadata,
  fn: () => Promise<T>
): Promise<T> {
  const client = await getClient()
  if (!client) return fn()

  const runId = crypto.randomUUID()
  const startTime = Date.now()

  try {
    await client.createRun({
      id: runId,
      name: metadata.agentName,
      run_type: "chain",
      inputs: { agent: metadata.agentName },
      start_time: startTime,
      tags: [
        metadata.userPlan,
        metadata.agentName,
        "valisearch-v2",
      ],
      extra: {
        metadata: {
          userId: metadata.userId,
          analysisId: metadata.analysisId,
          model: metadata.model,
        },
      },
    })

    const result = await fn()
    const endTime = Date.now()

    await client.updateRun(runId, {
      outputs: { success: true },
      end_time: endTime,
      status: "success",
    })

    return result
  } catch (error) {
    try {
      await client.updateRun(runId, {
        end_time: Date.now(),
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } catch { /* ignore tracing errors */ }
    throw error
  }
}
