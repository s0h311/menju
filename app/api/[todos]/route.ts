import { NextResponse } from 'next/server'
import { prismaClient } from '@/trpc/trpcServer'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const handleGet = async (request: Request): Promise<NextResponse> => {
  if (!(await checkAuthentication(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json(await prismaClient.todo.findMany())
  } catch (error) {
    return handleError(error)
  }
}

const handlePost = async (request: Request): Promise<NextResponse> => {
  if (!(await checkAuthentication(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const newTodo = await request.json()
    return NextResponse.json(
      await prismaClient.todo.create({
        data: newTodo,
      }),
      { status: 201 }
    )
  } catch (error) {
    return handleError(error)
  }
}

const handlePatch = async (request: Request): Promise<NextResponse> => {
  if (!(await checkAuthentication(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const todo = await request.json()
  try {
    const updatedTodo = await prismaClient.todo.update({
      where: {
        id: todo.id,
      },
      data: {
        ...todo,
      },
    })
    return NextResponse.json(updatedTodo, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}

const handleDelete = async (request: Request): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!(await checkAuthentication(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (id === null) {
    return NextResponse.json({ error: 'Unprocessable Content' }, { status: 422 })
  }
  try {
    await prismaClient.todo.delete({ where: { id: parseInt(id) } })
    return NextResponse.json('No Content', { status: 204 })
  } catch (error) {
    return handleError(error)
  }
}
const checkAuthentication = async (request: Request): Promise<boolean> => {
  const authHeader = request.headers.get('Authorization')
  const expectedCredentials = 'Basic ' + Buffer.from('gdsc:haw').toString('base64')
  return authHeader === expectedCredentials
}

const handleError = (error: unknown): NextResponse => {
  if (Object.keys(<object>error).length === 0) {
    return NextResponse.json('OK', { status: 200 })
  }
  if (error instanceof PrismaClientKnownRequestError) {
    return NextResponse.json({ error: 'Unprocessable Content', prismaError: error }, { status: 422 })
  }
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}

export const GET = handleGet
export const POST = handlePost
export const PATCH = handlePatch
export const DELETE = handleDelete
