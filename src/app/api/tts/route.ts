// app/api/tts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const apiUrl = `${process.env.API_BASE_URL}${process.env.API_TTS_ENDPOINT}`;

    console.log("TTS Request payload:", { text });
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({ text }),
    });

    console.log("TTS Response status:", response.status);
    console.log("TTS Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      return NextResponse.json({ error: "TTS API request failed" }, { status: response.status });
    }

    return new NextResponse(response.body, { status: response.status });
  } catch (error) {
    console.error("Error in TTS API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
