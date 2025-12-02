// app/api/gemini/route.ts

export const runtime = 'edge';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API Key Missing" }), { status: 500 });
  }

  try {
    const { prompt, action } = await req.json();

    // 1. Auto-Detect Model (Tetap kita pakai karena ini terbukti berhasil)
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!modelsResponse.ok) throw new Error("Gagal cek model Google");

    const modelsData = await modelsResponse.json();
    const availableModels = modelsData.models || [];

    // Prioritas pilih model
    const selectedModel = availableModels.find((m: any) => m.name.includes('gemini-1.5-flash'))?.name
      || availableModels.find((m: any) => m.name.includes('gemini-pro'))?.name
      || availableModels.find((m: any) => m.name.includes('gemini'))?.name;

    if (!selectedModel) throw new Error("Tidak ada model Gemini yang tersedia.");

    console.log("Using Model:", selectedModel);

    // 2. Siapkan Prompt
    let finalPrompt = "";
    if (action === 'extract') {
      finalPrompt = `
        You are a JSON extractor. Extract data from this job description.
        Rules: Return ONLY raw JSON. No Markdown. No \`\`\`json blocks.
        JSON Structure:
        {
          "company_name": "string",
          "position": "string",
          "location": "string",
          "job_type": "Remote" | "Hybrid" | "On-site",
          "salary": "string",
          "tags": ["string"]
        }
        Input: "${prompt}"
      `;
    } else {
      finalPrompt = `Write a ${prompt.type} message for ${prompt.company} as ${prompt.position}. Tech: ${prompt.tags}. Return message body only.`;
    }

    // 3. Request ke Google (NON-STREAMING)
    // Perhatikan: URLnya 'generateContent', BUKAN 'streamGenerateContent'
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`;

    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Error: ${response.status} - ${errText}`);
    }

    // 4. Ambil Hasil Bersih
    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Kembalikan JSON biasa ke frontend
    return new Response(JSON.stringify({ output: textResult }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('SERVER ERROR:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}