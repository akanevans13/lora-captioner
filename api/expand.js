export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { geminiCaption, imageBase64, mimeType, locationContext, accessCode } = await req.json();

    if (accessCode !== process.env.ZAZI_ACCESS_CODE) {
      return new Response("Unauthorized", { status: 401 });
    }

    const locHint = locationContext ? `This photo was taken in ${locationContext}. ` : "";
    const prompt = `${locHint}You are helping build an AI training dataset about African urban life and culture.

An AI has already described this photograph as: "${geminiCaption}"

Look at the image carefully and write a richer, more complete and culturally specific description. Expand what was described — add texture, atmosphere, cultural context, and specific visual details that help an AI model learn to generate images like this. Focus on: what people are wearing and doing, body language, the specific environment, lighting quality, colours, cultural elements, and the emotional energy. Do not use racial descriptors. Write a complete 60 to 80 word paragraph. Do not cut off mid-sentence.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType || "image/jpeg", data: imageBase64 } },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    if (!res.ok) {
      console.error("Claude error:", res.status, await res.text());
      return new Response(JSON.stringify({ caption: geminiCaption }), {
        status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const data = await res.json();
    const caption = data?.content?.[0]?.text?.trim() || geminiCaption;

    return new Response(JSON.stringify({ caption }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (e) {
    console.error("Handler error:", e);
    return new Response(JSON.stringify({ caption: "" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
