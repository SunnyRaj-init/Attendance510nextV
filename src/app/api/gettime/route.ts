import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
  try {
    const result = await sql`SELECT * FROM lims WHERE id='1';`;
    const now=new Date().toTimeString().split(" ")[0];
    if(now>=result.rows[0].start_at && now<=result.rows[0].end_at){
    return NextResponse.json({ accept:true }, { status: 200 })}
    else{
      return NextResponse.json({ accept:false }, { status: 200 }) 
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
