export type ChatResponse = {
  answer?: string;
  response?: string;
  message?: string;
};

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`Chat request failed with status ${res.status}`);
    }

    return (await res.json()) as ChatResponse;
  } catch (error) {
    console.error("[chatApi] sendChatMessage error", error);
    throw error;
  }
}
