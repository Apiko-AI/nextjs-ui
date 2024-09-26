import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const userId = cookies().get("user_id")?.value || "";
  return fetch(`${process.env.AI_API_URL}/documents`, {
    method: "GET",
    headers: {
      Cookie: `user_id=${userId};`,
    },
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const userId = cookies().get("user_id")?.value || "";

  if (!formData.get("files")) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  return fetch(`${process.env.AI_API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
    headers: {
      Cookie: `user_id=${userId};`,
    },
  });
}
