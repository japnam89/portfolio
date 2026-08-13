import { NextResponse } from "next/server";
import { addOffer, listOffers } from "@/lib/domains";

export const dynamic = "force-static";

// POST /api/domain-offers  — a visitor submits a buy offer for a domain.
export async function POST(request: Request) {
  let data: {
    domain?: string;
    name?: string;
    email?: string;
    offer?: string;
    message?: string;
  };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { domain, name, email, offer, message } = data;

  if (!domain || !name || !email) {
    return NextResponse.json(
      { error: "domain, name and email are required" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  try {
    const created = addOffer({ domain, name, email, offer, message });
    return NextResponse.json(
      { ok: true, message: "Offer sent — thanks!", id: created.id },
      { status: 200 }
    );
  } catch (err) {
    console.error("[domain-offers] insert failed:", err);
    return NextResponse.json(
      { error: "Could not save your offer. Please try again." },
      { status: 502 }
    );
  }
}

// GET /api/domain-offers — list offers (used by an admin view later).
export async function GET() {
  return NextResponse.json({ offers: listOffers() });
}
