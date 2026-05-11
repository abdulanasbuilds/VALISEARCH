import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    app: 'ValiSearch 2.0',
    uptime: process.uptime?.() ?? 'unknown'
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}