import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const name = params.get('name')
  const preis = parseInt(params.get('preis') || '')

  if (name && preis) {
    return await prisma.essen.create({
      data: {
        name,
        preis,
      },
    })
  }
}

export async function GET() {
  const res = await prisma.essen.findMany()
  return NextResponse.json(res)
}
