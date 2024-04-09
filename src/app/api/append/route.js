import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import requestIp from "request-ip";
export async function POST(request) {
  const data = await request.json();
  console.log(data);
  const { name, id } = data;
  const ip = requestIp.getClientIp(request);
  console.log(name, id, ip);
  try {
    const result =
      await sql`INSERT INTO studs (Name,ID,IP) VALUES(${name},${id},${ip});`;
    return NextResponse.json({ added: true }, { status: 200 });
  } catch (error) {
    console.log;
    return NextResponse.json({ error }, { status: 500 });
  }
}
