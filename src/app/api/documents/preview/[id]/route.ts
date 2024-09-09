export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  return fetch(`${process.env.AI_API_URL}/documents/download/${params.id}`, {
    method: "GET",
  });
}
