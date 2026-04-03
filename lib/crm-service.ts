'use server'

import { prisma } from './prisma'
import { createAuditTrail } from './audit-trail'

interface CreateCRMInput {
  crmId: string
  name: string
  lotNumber: string
  manufacturer: string
  expiryDate: Date
  quantity: number
  unit: string
  minQuantity: number
  msdsUrl?: string
  storageCondition?: string
}

export async function createCRM(input: CreateCRMInput, userId: string) {
  try {
    const crm = await prisma.crm.create({
      data: {
        crmId: input.crmId,
        name: input.name,
        lotNumber: input.lotNumber,
        manufacturer: input.manufacturer,
        expiryDate: input.expiryDate,
        quantity: input.quantity,
        unit: input.unit,
        minQuantity: input.minQuantity,
        msdsUrl: input.msdsUrl,
        storageCondition: input.storageCondition,
      },
    })
    
    await createAuditTrail({
      userId,
      action: 'CREATE',
      entityType: 'CRM',
      entityId: crm.id,
      changes: { created: crm },
    })
    
    return crm
  } catch (error) {
    console.error('Failed to create CRM:', error)
    throw error
  }
}

export async function getCRM(crmId: string) {
  try {
    const crm = await prisma.crm.findUnique({
      where: { crmId },
      include: {
        testRecords: {
          select: {
            id: true,
            testName: true,
          },
        },
      },
    })
    return crm
  } catch (error) {
    console.error('Failed to get CRM:', error)
    throw error
  }
}

export async function getAllCRM() {
  try {
    const crms = await prisma.crm.findMany({
      orderBy: { expiryDate: 'asc' },
    })
    return crms
  } catch (error) {
    console.error('Failed to get CRMs:', error)
    throw error
  }
}

export async function getCRMExpiringSoon(days: number = 30) {
  try {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + days)
    
    const crms = await prisma.crm.findMany({
      where: {
        expiryDate: {
          lte: expiryDate,
        },
      },
      orderBy: { expiryDate: 'asc' },
    })
    return crms
  } catch (error) {
    console.error('Failed to get expiring CRMs:', error)
    throw error
  }
}

export async function getCRMLowStock() {
  try {
    const crms = await prisma.crm.findMany({
      where: {
        quantity: {
          lte: prisma.crm.fields.minQuantity,
        },
      },
      orderBy: { quantity: 'asc' },
    })
    return crms
  } catch (error) {
    console.error('Failed to get low stock CRMs:', error)
    throw error
  }
}

export async function updateCRMQuantity(
  crmId: string,
  quantity: number,
  userId: string,
  reason?: string
) {
  try {
    const crm = await prisma.crm.findUnique({
      where: { crmId },
    })
    
    if (!crm) {
      throw new Error('CRM not found')
    }
    
    const updated = await prisma.crm.update({
      where: { crmId },
      data: { quantity },
    })
    
    await createAuditTrail({
      userId,
      action: 'UPDATE',
      entityType: 'CRM',
      entityId: crm.id,
      changes: {
        before: { quantity: crm.quantity },
        after: { quantity },
      },
      reason,
    })
    
    return updated
  } catch (error) {
    console.error('Failed to update CRM quantity:', error)
    throw error
  }
}
