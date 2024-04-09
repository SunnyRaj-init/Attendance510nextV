import { NextResponse,NextRequest } from "next/server";
export async function GET(request:NextRequest) {
    const FALLBACK_IP_ADDRESS = "0.0.0.0";
    const ip = (request.headers.get('x-forwarded-for') ?? FALLBACK_IP_ADDRESS).split(',')[0]
    // return NextResponse.json({ error:true }, { status: 500 })
    // console.log(ip)
    return NextResponse.json({ip},{status:200})
  }