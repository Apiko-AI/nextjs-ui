import { cookies } from "next/headers";
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const userId = cookies().get("user_id")?.value || "";
  return fetch(`${process.env.AI_API_URL}/documents/${params.id}`, {
    method: "GET",
    headers: {
      Cookie: `user_id=${userId};`,
    },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const userId = cookies().get("user_id")?.value || "";
  return fetch(`${process.env.AI_API_URL}/documents/${params.id}`, {
    method: "DELETE",
    headers: {
      Cookie: `user_id=${userId};`,
    },
  });
}
