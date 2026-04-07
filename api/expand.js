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
    const prompt = `You are an expert machine learning engineer creating training captions for a Stable Diffusion XL LoRA dataset about African urban life and culture.

TASK: Look at this photograph carefully and generate an optimal training caption.

CAPTION STRUCTURE — write in this exact order, comma separated:
1. SUBJECT: Who or what is the main focus — describe clothing details, accessories, hairstyle, expression, pose, age range
2. ACTION: What is happening — be specific about movement, gesture, activity
3. SETTING: The exact environment — interior/exterior, architectural style, urban/rural, specific location type
4. LIGHTING: Quality and direction of light — golden hour, harsh midday, diffused overcast, artificial warm, backlit
5. ATMOSPHERE: The mood and energy — intimate, chaotic, joyful, solemn, bustling, quiet
6. VISUAL STYLE: Camera perspective, depth of field, colour palette, texture — close-up portrait, wide establishing shot, shallow depth of field, warm tones, high contrast
7. CULTURAL SPECIFICS: Any culturally specific elements visible — traditional patterns, local signage, specific materials, regional architecture

RULES:
- Be extremely specific — not "a man" but "a middle-aged man in a collarless white cotton shirt"
- Not "buildings" but "low-rise painted concrete shopfronts with corrugated iron awnings"
- Never use racial descriptors — describe clothing, texture, light on skin instead
- For portraits: focus on expression, clothing, accessories, lighting on face, background environment
- Write as comma-separated phrases, not full sentences
- Aim for 40-60 words total
- Every word must be visually reproducible by an AI image generator

OUTPUT FORMAT: Write only the caption — no preamble, no explanation, just the descriptive phrases.``;

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
