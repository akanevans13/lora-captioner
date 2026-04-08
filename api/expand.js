export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { geminiCaption, imageBase64, mimeType, locationContext, accessCode } = req.body;

    if (accessCode !== process.env.ZAZI_ACCESS_CODE) {
      return res.status(401).send("Unauthorized");
    }

    if (!imageBase64) {
      return res.status(200).json({ caption: "", error: "no image" });
    }

    const locHint = locationContext ? "This photo was taken in " + locationContext + ". " : "";
    const prompt = locHint + "You are an expert machine learning engineer creating training captions for a Stable Diffusion XL LoRA dataset about African urban life and culture. Look at this photograph carefully and generate an optimal LoRA training caption. Write in comma-separated phrases in this order: 1) subject with specific clothing details and accessories, 2) action or pose, 3) exact setting and environment with architectural details, 4) lighting quality and direction, 5) mood and atmosphere, 6) visual style and composition, 7) any culturally specific elements visible. Rules: be extremely specific not vague, never use racial descriptors, describe clothing textures and colours instead, write 40-60 words as comma-separated phrases only with no full sentences and no preamble. Output only the caption phrases nothing else.";

    // Detect actual image type from base64 header bytes
    let actualMime = "image/jpeg";
    if (imageBase64.startsWith("iVBORw0KGgo")) actualMime = "image/png";
    else if (imageBase64.startsWith("/9j/")) actualMime = "image/jpeg";
    else if (imageBase64.startsWith("R0lGOD")) actualMime = "image/gif";
    else if (imageBase64.startsWith("UklGR")) actualMime = "image/webp";
    console.log("Detected mime type:", actualMime, "original:", mimeType);

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: actualMime,
                data: imageBase64
              }
            },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    const claudeData = await claudeRes.json();

    if (!claudeRes.ok) {
      console.error("Claude error:", JSON.stringify(claudeData));
      return res.status(200).json({ caption: geminiCaption || "", error: "claude_error" });
    }

    const caption = claudeData?.content?.[0]?.text?.trim() || geminiCaption || "";
    return res.status(200).json({ caption });

  } catch (e) {
    console.error("Handler error:", e.message);
    return res.status(200).json({ caption: "", error: e.message });
  }
}
