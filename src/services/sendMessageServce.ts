import { MessageFile } from "@/types/Message";

export async function sendMessage({
  message,
  files,
}: {
  message: string;
  files: MessageFile[];
}): Promise<Response> {
  const formData = new FormData();
  formData.append("text", message);

  files
    .filter((file): file is File => file instanceof File)
    .forEach((file) => {
      formData.append("file", file);
    });

  const response = await fetch("/api/chat", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }

  return response;
}
