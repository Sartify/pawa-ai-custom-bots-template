import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    console.log("......here is incoming POST")

    const contentType = req.headers.get("content-type") || "";
    console.log("......Headers:", { contentType });

    if (!contentType.includes("multipart/form-data")) {
    console.warn(".... incase of wrong Headers:", { contentType });
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const message = form.get("text") as string;
    const rawFiles = form.getAll("file") as File[];

    console.log("......Received form data:", {
      message: message,
      filesCount: rawFiles.length,
      fileNames: rawFiles.map(f => f.name)
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const forwardForm = new FormData();
    forwardForm.append("message", message); // Changed from "text" to "message"
    rawFiles.forEach((file) => {
      forwardForm.append("file", file);
    });

    console.log("......Forwarding to external API with:", {
      message: message,
      filesCount: rawFiles.length,
      fileNames: rawFiles.map(f => f.name)
    });

    const apiUrl = `${process.env.API_BASE_URL}${process.env.API_CHAT_ENDPOINT}`;

    console.log("......urllll:", apiUrl);

    console.log("......Sending request to external API...");
    const response = await fetch(apiUrl, {
      method: "POST",
      body: forwardForm,
    });
    console.log("......Request sent successfully");

    console.log("......External API response status:", response.status);
    console.log("......External API response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`External API error: ${errorText}`);
      console.error(`External API error details: Status ${response.status}, URL: ${apiUrl}`);
      return NextResponse.json(
        { error: "Chat API request failed", details: errorText },
        { status: response.status }
      );
    }

    const responseText = await response.text();
    console.log("......External API response body:", responseText);

    // Try to parse the response as JSON
    try {
      const responseData = JSON.parse(responseText);
      console.log("......Parsed response data:", responseData);
      return NextResponse.json(responseData);
    } catch (parseError) {
      console.log("......Response is not JSON, returning as text");
      // If it's not JSON, return it as a text response
      return NextResponse.json({
        role: "assistant",
        content: responseText
      });
    }
  } catch (err) {
    console.error("Error in chat API route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
