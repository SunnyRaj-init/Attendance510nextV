import { sql } from "@vercel/postgres";
import { NextResponse,NextRequest } from "next/server";
export async function POST(request:NextRequest) {
  const data = await request.json();
  // return NextResponse.json({ error:true }, { status: 500 });
  // console.log(data);
  const { name, id,ip } = data;
  try {
    const result =
      await sql`INSERT INTO studs (Name,ID,IP) VALUES(${name},${id},${ip});`;
    return NextResponse.json({ added: true }, { status: 200 });
  } catch (error) {
    console.log;
    return NextResponse.json({ error }, { status: 500 });
  }
}
