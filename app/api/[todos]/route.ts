import { NextResponse } from 'next/server'
import { prismaClient } from '@/trpc/trpcServer'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const handler = async (request: Request): Promise<NextResponse> => {
  const authHeader = request.headers.get('Authorization')
  const expectedCredentials = 'Basic ' + Buffer.from('gdsc:haw').toString('base64')

  if (authHeader !== expectedCredentials) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)

  try {
    switch (request.method) {
      case 'GET':
        return await handleGet()
      case 'POST':
        return await handlePost(request)
      case 'PUT':
        return await handlePut(request)
      case 'DELETE':
        const id = searchParams.get('id')
        if (id === null) {
          return NextResponse.json({ error: 'Unprocessable Content' }, { status: 422 })
        }
        return await handleDelete(parseInt(id))
      default:
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
    }
  } catch (error) {
    //stupid error check due to mysterious exception after deleting todo successfully
    if (Object.keys(<object>error).length === 0) {
      return NextResponse.json('OK', { status: 200 })
    }
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({ error: 'Unprocessable Content', prismaError: error }, { status: 422 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

const handleGet = async (): Promise<NextResponse> => NextResponse.json(await prismaClient.todo.findMany())
const handlePost = async (request: Request): Promise<NextResponse> => {
  const newTodo = await request.json()
  return NextResponse.json(
    await prismaClient.todo.create({
      data: newTodo,
    }),
    { status: 201 }
  )
}

const handlePut = async (request: Request): Promise<NextResponse> => {
  const todo = await request.json()
  const updatedTodo = await prismaClient.todo.update({
    where: {
      id: todo.id,
    },
    data: {
      ...todo,
    },
  })
  return NextResponse.json(updatedTodo, { status: 200 })
}

const handleDelete = async (id: number): Promise<NextResponse> => {
  await prismaClient.todo.delete({ where: { id: id } })
  return NextResponse.json('No Content', { status: 204 })
}
export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
