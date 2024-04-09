import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
export async function POST(request) {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");
  let ip = FALLBACK_IP_ADDRESS;
  if (forwardedFor) {
    ip = forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  } else {
    ip = headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
  }
  const data = await request.json();
  console.log(data);
  const { name, id } = data;
  try {
    const result =
      await sql`INSERT INTO studs (Name,ID,IP) VALUES(${name},${id},${ip});`;
    return NextResponse.json({ added: true }, { status: 200 });
  } catch (error) {
    console.log;
    return NextResponse.json({ error }, { status: 500 });
  }
}
