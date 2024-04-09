import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
  try {
    const result = await sql`SELECT * FROM lims WHERE id='1';`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
