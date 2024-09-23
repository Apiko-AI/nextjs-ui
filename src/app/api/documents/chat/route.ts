export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();

  return fetch(`${process.env.AI_API_URL}/documents/chat`, {
    method: "POST",
    body: JSON.stringify({
      messages,
      chat_id: chatId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
