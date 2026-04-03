'use server'

import { prisma } from './prisma'
import { SampleStatus } from '@prisma/client'
import { generateSampleId, generateBarcode } from './utils'
import { createAuditTrail } from './audit-trail'
import QRCode from 'qrcode'

interface CreateSampleInput {
  name: string
  description?: string
  receivedBy: string
  clientName: string
  clientInfo?: string
  storageCondition?: string
  dueDate?: Date
  metadata?: Record<string, unknown>
}

export async function createSample(input: CreateSampleInput) {
  const sampleId = generateSampleId()
  const barcode = generateBarcode()
  
  try {
    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(sampleId)
    
    const sample = await prisma.sample.create({
      data: {
        sampleId,
        barcode,
        qrCode: qrCodeDataUrl,
        name: input.name,
        description: input.description,
        receivedBy: input.receivedBy,
        clientName: input.clientName,
        clientInfo: input.clientInfo,
        storageCondition: input.storageCondition,
        dueDate: input.dueDate,
        metadata: input.metadata as any,
        status: SampleStatus.RECEIVED,
      },
    })
    
    // Create audit trail
    await createAuditTrail({
      userId: input.receivedBy,
      action: 'CREATE',
      entityType: 'Sample',
      entityId: sample.id,
      changes: { created: sample },
    })
    
    return sample
  } catch (error) {
    console.error('Failed to create sample:', error)
    throw error
  }
}

export async function getSample(sampleId: string) {
  try {
    const sample = await prisma.sample.findUnique({
      where: { sampleId },
      include: {
        testRecords: {
          include: {
            assignment: true,
            equipment: true,
          },
        },
        auditTrails: {
          include: {
            user: {
              select: { name: true, email: true, role: true },
            },
          },
          orderBy: { timestamp: 'desc' },
        },
      },
    })
    return sample
  } catch (error) {
    console.error('Failed to get sample:', error)
    throw error
  }
}

export async function getAllSamples(status?: SampleStatus) {
  try {
    const samples = await prisma.sample.findMany({
      where: status ? { status } : {},
      include: {
        testRecords: {
          select: {
            id: true,
            testName: true,
            status: true,
          },
        },
      },
      orderBy: { receivedAt: 'desc' },
    })
    return samples
  } catch (error) {
    console.error('Failed to get samples:', error)
    throw error
  }
}

export async function updateSampleStatus(
  sampleId: string, 
  status: SampleStatus, 
  userId: string,
  reason?: string
) {
  try {
    const sample = await prisma.sample.findUnique({
      where: { sampleId },
    })
    
    if (!sample) {
      throw new Error('Sample not found')
    }
    
    const updated = await prisma.sample.update({
      where: { sampleId },
      data: { status },
    })
    
    // Create audit trail
    await createAuditTrail({
      userId,
      action: 'UPDATE',
      entityType: 'Sample',
      entityId: sample.id,
      changes: {
        before: { status: sample.status },
        after: { status },
      },
      reason,
    })
    
    return updated
  } catch (error) {
    console.error('Failed to update sample status:', error)
    throw error
  }
}

export async function getSamplesDueSoon(days: number = 7) {
  try {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + days)
    
    const samples = await prisma.sample.findMany({
      where: {
        dueDate: {
          lte: dueDate,
        },
        status: {
          in: [SampleStatus.RECEIVED, SampleStatus.PENDING, SampleStatus.ASSIGNED, SampleStatus.IN_PROGRESS],
        },
      },
      orderBy: { dueDate: 'asc' },
    })
    return samples
  } catch (error) {
    console.error('Failed to get samples due soon:', error)
    throw error
  }
}
