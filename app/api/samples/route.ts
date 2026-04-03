import { NextResponse } from 'next/server'
import { createSample, getAllSamples } from '@/lib/sample-service'

export async function GET() {
  try {
    const samples = await getAllSamples()
    return NextResponse.json(samples)
  } catch (error) {
    console.error('Failed to get samples:', error)
    return NextResponse.json(
      { error: 'Failed to get samples' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, clientName, clientInfo, storageCondition, dueDate } = body
    
    const sample = await createSample({
      name,
      description,
      clientName,
      clientInfo,
      storageCondition,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      receivedBy: 'admin', // TODO: Get from session
    })
    
    return NextResponse.json(sample, { status: 201 })
  } catch (error) {
    console.error('Failed to create sample:', error)
    return NextResponse.json(
      { error: 'Failed to create sample' },
      { status: 500 }
    )
  }
}
