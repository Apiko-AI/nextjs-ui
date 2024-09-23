import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();

  if (!formData.get("files")) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  return fetch(`${process.env.AI_API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });
}
