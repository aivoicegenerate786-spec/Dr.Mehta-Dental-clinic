import { db } from "@/db";
import { appointments } from "@/db/schema";
import { isAdminKey } from "@/lib/admin";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const key = request.headers.get("x-admin-key") ?? "";
  if (!isAdminKey(key)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { status?: string };
  if (!body.status || !STATUSES.includes(body.status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return Response.json({ error: "Invalid id" }, { status: 400 });

  const [row] = await db
    .update(appointments)
    .set({ status: body.status })
    .where(eq(appointments.id, numericId))
    .returning();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true, status: row.status });
}
