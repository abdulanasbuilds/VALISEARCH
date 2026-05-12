import { Client } from "langsmith"

let langsmithClient: Client | null = null

function getClient(): Client | null {
  if (typeof process.env.LANGCHAIN_API_KEY === "undefined") {
    return null
  }
  if (!langsmithClient) {
    langsmithClient = new Client({
      apiKey: process.env.LANGCHAIN_API_KEY,
      projectName: process.env.LANGCHAIN_PROJECT ?? "valisearch",
    })
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
  const client = getClient()
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
    await client.updateRun(runId, {
      end_time: Date.now(),
      status: "error",
      error: error instanceof Error
        ? error.message
        : "Unknown error",
    })
    throw error
  }
}