import { NextResponse } from 'next/server'
import { getAuditTrailsByDateRange } from '@/lib/audit-trail'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }
    
    const trails = await getAuditTrailsByDateRange(
      new Date(startDate),
      new Date(endDate)
    )
    
    return NextResponse.json(trails)
  } catch (error) {
    console.error('Failed to get audit trails:', error)
    return NextResponse.json(
      { error: 'Failed to get audit trails' },
      { status: 500 }
    )
  }
}
