Deno.serve(async (req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const openaiKey = Deno.env.get("OPENAI_API_KEY")!;

  const { action, data } = await req.json();

  if (action === "embed") {
    const { text } = data;

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text.slice(0, 8000),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const embedding = result.data[0].embedding;

    return new Response(JSON.stringify({ embedding }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "index") {
    const { source_type, source_name, source_url, title, content, metadata } = data;

    const embedRes = await fetch(`${supabaseUrl}/functions/v1/rag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        action: "embed",
        data: { text: content },
      }),
    });

    const { embedding } = await embedRes.json();

    const insertRes = await fetch(
      `${supabaseUrl}/rest/v1/knowledge_base`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          source_type,
          source_name,
          source_url,
          title,
          content,
          content_vector: embedding,
          metadata: metadata || {},
        }),
      }
    );

    if (!insertRes.ok) {
      const error = await insertRes.text();
      return new Response(JSON.stringify({ error }), {
        status: insertRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "search") {
    const { query, limit = 5, source_type } = data;

    const embedRes = await fetch(`${supabaseUrl}/functions/v1/rag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        action: "embed",
        data: { text: query },
      }),
    });

    const { embedding } = await embedRes.json();

    let queryUrl = `${supabaseUrl}/rest/v1/rpc/match_knowledge_base`;

    const rpcRes = await fetch(queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: limit,
        source_type_filter: source_type || null,
      }),
    });

    if (!rpcRes.ok) {
      const error = await rpcRes.text();
      return new Response(JSON.stringify({ error, details: error }), {
        status: rpcRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = await rpcRes.json();

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Invalid action" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
});
