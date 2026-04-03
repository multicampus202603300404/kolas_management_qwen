import { NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/dashboard-service'

export async function GET() {
  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to get dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to get dashboard stats' },
      { status: 500 }
    )
  }
}
