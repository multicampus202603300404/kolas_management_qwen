'use server'

import { prisma } from './prisma'
import { EquipmentStatus } from '@prisma/client'
import { createAuditTrail } from './audit-trail'

interface CreateEquipmentInput {
  equipmentId: string
  name: string
  model?: string
  manufacturer?: string
  serialNumber?: string
  location?: string
  purchaseDate?: Date
  calibrationCycle?: number // days
}

export async function createEquipment(input: CreateEquipmentInput, userId: string) {
  try {
    const equipment = await prisma.equipment.create({
      data: {
        equipmentId: input.equipmentId,
        name: input.name,
        model: input.model,
        manufacturer: input.manufacturer,
        serialNumber: input.serialNumber,
        location: input.location,
        purchaseDate: input.purchaseDate,
        calibrationCycle: input.calibrationCycle,
        status: EquipmentStatus.IDLE,
      },
    })
    
    // Create audit trail
    await createAuditTrail({
      userId,
      action: 'CREATE',
      entityType: 'Equipment',
      entityId: equipment.id,
      changes: { created: equipment },
    })
    
    return equipment
  } catch (error) {
    console.error('Failed to create equipment:', error)
    throw error
  }
}

export async function getEquipment(equipmentId: string) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { equipmentId },
      include: {
        maintenanceLogs: {
          orderBy: { performedAt: 'desc' },
        },
        testRecords: {
          select: {
            id: true,
            testName: true,
            status: true,
          },
        },
        auditTrails: {
          include: {
            user: { select: { name: true, email: true, role: true } },
          },
          orderBy: { timestamp: 'desc' },
        },
      },
    })
    return equipment
  } catch (error) {
    console.error('Failed to get equipment:', error)
    throw error
  }
}

export async function getAllEquipment(status?: EquipmentStatus) {
  try {
    const equipment = await prisma.equipment.findMany({
      where: status ? { status } : {},
      include: {
        maintenanceLogs: {
          select: {
            id: true,
            type: true,
            performedAt: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })
    return equipment
  } catch (error) {
    console.error('Failed to get equipment:', error)
    throw error
  }
}

export async function updateEquipmentStatus(
  equipmentId: string,
  status: EquipmentStatus,
  userId: string,
  reason?: string
) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { equipmentId },
    })
    
    if (!equipment) {
      throw new Error('Equipment not found')
    }
    
    const updated = await prisma.equipment.update({
      where: { equipmentId },
      data: { status },
    })
    
    await createAuditTrail({
      userId,
      action: 'UPDATE',
      entityType: 'Equipment',
      entityId: equipment.id,
      changes: {
        before: { status: equipment.status },
        after: { status },
      },
      reason,
    })
    
    return updated
  } catch (error) {
    console.error('Failed to update equipment status:', error)
    throw error
  }
}

export async function getEquipmentDueForCalibration(days: number = 30) {
  try {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + days)
    
    const equipment = await prisma.equipment.findMany({
      where: {
        calibrationDue: {
          lte: dueDate,
        },
        status: {
          not: EquipmentStatus.RETIRED,
        },
      },
      orderBy: { calibrationDue: 'asc' },
    })
    return equipment
  } catch (error) {
    console.error('Failed to get equipment due for calibration:', error)
    throw error
  }
}

export async function createMaintenanceLog(
  equipmentId: string,
  input: {
    type: string
    description: string
    performedBy: string
    nextDue?: Date
    attachments?: string[]
    cost?: number
  },
  userId: string
) {
  try {
    const log = await prisma.maintenanceLog.create({
      data: {
        equipmentId,
        type: input.type,
        description: input.description,
        performedBy: input.performedBy,
        nextDue: input.nextDue,
        attachments: input.attachments || [],
        cost: input.cost,
      },
    })
    
    // Update equipment calibration date if this was a calibration
    if (input.type === '교정' && input.nextDue) {
      await prisma.equipment.update({
        where: { equipmentId },
        data: {
          lastCalibration: new Date(),
          calibrationDue: input.nextDue,
        },
      })
    }
    
    await createAuditTrail({
      userId,
      action: 'CREATE',
      entityType: 'MaintenanceLog',
      entityId: log.id,
      changes: { created: log },
    })
    
    return log
  } catch (error) {
    console.error('Failed to create maintenance log:', error)
    throw error
  }
}
