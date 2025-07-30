import { API_CONFIG } from "@/app/api/config";

export const fetchTTSAudio = async (text: string): Promise<Response> => {
  const payload = {
    text,
    voice: "ame",
    model: "pawa-tts-v1-20250704",
    max_tokens: 65536,
    temperature: 0.5,
    top_p: 0.95,
    repetition_penalty: 1.1,
  };

  console.log("Sending TTS payload:", payload);

  const response = await fetch("/api/tts", {
    method: "POST",
    headers: {
      ...API_CONFIG.HEADERS.COMMON,
      ...API_CONFIG.HEADERS.TTS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`TTS API request failed: ${response.status}`);
  }

  return response;
};

export const transcribeAudio = async (file: File): Promise<{ text: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/vts", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Speech-to-text API request failed: ${response.status}`);
  }

  return await response.json();
};

