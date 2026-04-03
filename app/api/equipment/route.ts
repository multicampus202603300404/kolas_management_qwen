import { NextResponse } from 'next/server'
import { getAllEquipment } from '@/lib/equipment-service'

export async function GET() {
  try {
    const equipment = await getAllEquipment()
    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Failed to get equipment:', error)
    return NextResponse.json(
      { error: 'Failed to get equipment' },
      { status: 500 }
    )
  }
}
