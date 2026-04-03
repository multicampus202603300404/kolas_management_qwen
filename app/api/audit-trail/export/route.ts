import { NextResponse } from 'next/server'
import { getAuditTrailsByDateRange } from '@/lib/audit-trail'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { startDate, endDate } = body
    
    const trails = await getAuditTrailsByDateRange(
      new Date(startDate),
      new Date(endDate)
    )
    
    // Generate simple CSV for export (in production, use a PDF library)
    const csvRows = [
      ['Timestamp', 'User', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Reason'],
      ...trails.map((trail: any) => [
        new Date(trail.timestamp).toLocaleString('ko-KR'),
        trail.user.name,
        trail.user.role,
        trail.action,
        trail.entityType,
        trail.entityId,
        trail.reason || '',
      ]),
    ]
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-trail-${startDate}-${endDate}.csv"`,
      },
    })
  } catch (error) {
    console.error('Failed to export audit trails:', error)
    return NextResponse.json(
      { error: 'Failed to export audit trails' },
      { status: 500 }
    )
  }
}
