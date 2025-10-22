import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const sanitized = {
      fullName: typeof data.fullName === "string" ? data.fullName.trim() : "",
      email: typeof data.email === "string" ? data.email.trim() : "",
      company: typeof data.company === "string" ? data.company.trim() : "",
      message: typeof data.message === "string" ? data.message.trim() : "",
    };

    if (!sanitized.fullName || !sanitized.email || !sanitized.message) {
      return NextResponse.json({ ok: false, message: "Missing required fields" }, { status: 400 });
    }

    // TODO: integrate with CRM / ticketing backend. For now, echo success to the UI.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/contact] unexpected error", error);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
