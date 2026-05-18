/**
 * Creates a retry graph for unreliable operations.
 * Handles: "if search fails, try again" patterns.
 * Uses exponential backoff between retries.
 */
export async function withRetryGraph<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    fallback?: T
    operationName?: string
  } = {}
): Promise<T> {
  const { maxAttempts = 3, fallback, operationName = "operation" } = options

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn()
      if (result !== null && result !== undefined) {
        return result
      }
      throw new Error("Empty result returned")
    } catch (error) {
      lastError = error instanceof Error
        ? error
        : new Error(String(error))

      console.warn(
        `[RetryGraph] ${operationName} attempt ${attempt}/${maxAttempts} failed:`,
        lastError.message
      )

      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  console.error(
    `[RetryGraph] ${operationName} failed after ${maxAttempts} attempts. Using fallback.`
  )

  if (fallback !== undefined) return fallback
  throw lastError ?? new Error(`${operationName} failed`)
}

/**
 * Parallel retry — runs multiple search queries,
 * retries any that fail, returns all successful results.
 */
export async function parallelWithRetry<T>(
  tasks: Array<() => Promise<T>>,
  options: {
    maxAttempts?: number
    fallback?: T
  } = {}
): Promise<T[]> {
  const results = await Promise.allSettled(
    tasks.map(task =>
      withRetryGraph(task, {
        maxAttempts: options.maxAttempts ?? 2,
        fallback: options.fallback,
        operationName: "parallel-task",
      })
    )
  )

  return results.map(r =>
    r.status === "fulfilled"
      ? r.value
      : (options.fallback as T)
  ).filter(r => r !== undefined)
}
