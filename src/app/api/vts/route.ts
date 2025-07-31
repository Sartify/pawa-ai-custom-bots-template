// app/api/vts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      console.error("[VTS] Missing or invalid file:", file);
      return NextResponse.json({ error: "Missing or invalid file" }, { status: 400 });
    }

    const upstreamUrl = `${process.env.API_BASE_URL}${process.env.API_VTT_ENDPOINT}`;
    console.log("[VTS] Incoming file:", {
      name: (file as File).name,
      type: file.type,
      size: file.size,
    });

    const upstreamForm = new FormData();
    upstreamForm.set("file", file);

    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      body: upstreamForm,
    });

    const responseBody = await upstreamResponse.text();
    console.log("[VTS] Upstream response body:", responseBody);

    if (!upstreamResponse.ok) {
      console.error("[VTS] Upstream error:", responseBody);
      return NextResponse.json(
        { error: "Upstream STT service failed", detail: responseBody },
        { status: upstreamResponse.status }
      );
    }

    let result;
    try {
      result = JSON.parse(responseBody);
    } catch (err) {
      console.error("[VTS] Error parsing upstream JSON:", err);
      return NextResponse.json(
        { error: "Invalid JSON from upstream", detail: responseBody },
        { status: 502 }
      );
    }

    if (result.success && result.data?.text) {
      return NextResponse.json({ 
        text: result.data.text 
      });
    } else {
      console.error("[VTS] Unexpected response structure:", result);
      return NextResponse.json(
        { error: "Invalid response structure from upstream" },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error("[VTS] Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
