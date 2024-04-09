import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    const data = await request.json();
    const {start,end}=data
  try {
    const result = await sql`UPDATE lims set start_at=${start}, end_at=${end} WHERE id='1';`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
