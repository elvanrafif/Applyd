import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { action, prompt } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        responseMimeType: action === "extract" ? "application/json" : "text/plain"
      }
    });

    let systemPrompt = "";

    if (action === "extract") {
      systemPrompt = `
        Extract job details from the input.
        Schema:
        {
          "company_name": "string",
          "position": "string",
          "location": "string",
          "job_type": "Remote" | "Hybrid" | "On-site",
          "salary": "string",
          "tags": ["string"]
        }
      `;
    } else {
      systemPrompt = `
        Write a ${prompt.type} message.
        Context: ${prompt.company}, ${prompt.position}.
        Skills: ${prompt.tags}.
      `;
    }

    const result = await model.generateContent([
      systemPrompt,
      JSON.stringify(prompt)
    ]);

    const output = result.response.text();

    return NextResponse.json({ output });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}