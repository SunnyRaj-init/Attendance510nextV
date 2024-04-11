import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export async function POST(request:Request) {
  try {
    const data=await request.json();
    console.log(data)
    const result = await sql`SELECT * FROM lims WHERE id='1';`;
    const now=new Date().toTimeString().split(" ")[0];
    const comp1=now.localeCompare(result.rows[0].start_at)
    const comp2=now.localeCompare(result.rows[0].end_at)
    if(comp1>=0 && comp2<=0){
    return NextResponse.json({ accept:true,data:result }, { status: 200 })}
    else{
      return NextResponse.json({ accept:false,data:result }, { status: 200 }) 
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
