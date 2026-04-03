'use server'

import { prisma } from './prisma'
import { TestStatus, SampleStatus } from '@prisma/client'
import { createAuditTrail } from './audit-trail'

interface CreateTestRecordInput {
  sampleId: string
  testId: string
  testName: string
  method: string
  assignedTo: string
  assignedBy: string
  dueDate?: Date
  equipmentId?: string
  crmId?: string
}

export async function createTestRecord(input: CreateTestRecordInput) {
  try {
    // Create test record
    const testRecord = await prisma.testRecord.create({
      data: {
        sampleId: input.sampleId,
        testId: input.testId,
        testName: input.testName,
        method: input.method,
        status: TestStatus.PENDING,
        equipmentId: input.equipmentId,
        crmId: input.crmId,
      },
    })
    
    // Create assignment
    const assignment = await prisma.testAssignment.create({
      data: {
        testRecordId: testRecord.id,
        assignedTo: input.assignedTo,
        assignedBy: input.assignedBy,
        dueDate: input.dueDate,
        status: TestStatus.PENDING,
      },
    })
    
    // Update sample status
    await prisma.sample.update({
      where: { sampleId: input.sampleId },
      data: { status: SampleStatus.ASSIGNED },
    })
    
    // Create audit trail
    await createAuditTrail({
      userId: input.assignedBy,
      action: 'CREATE',
      entityType: 'TestRecord',
      entityId: testRecord.id,
      changes: { created: testRecord, assignment },
    })
    
    return { testRecord, assignment }
  } catch (error) {
    console.error('Failed to create test record:', error)
    throw error
  }
}

export async function getTestRecord(id: string) {
  try {
    const testRecord = await prisma.testRecord.findUnique({
      where: { id },
      include: {
        sample: true,
        equipment: true,
        assignment: {
          include: {
            assignee: {
              select: { name: true, email: true, role: true },
            },
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
    return testRecord
  } catch (error) {
    console.error('Failed to get test record:', error)
    throw error
  }
}

export async function getTestRecordsByStatus(status: TestStatus) {
  try {
    const records = await prisma.testRecord.findMany({
      where: { status },
      include: {
        sample: {
          select: {
            sampleId: true,
            name: true,
            clientName: true,
          },
        },
        assignment: {
          include: {
            assignee: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return records
  } catch (error) {
    console.error('Failed to get test records:', error)
    throw error
  }
}

export async function updateTestRecordData(
  id: string,
  data: {
    rawData?: Record<string, unknown>
    calculatedData?: Record<string, unknown>
    environmentalConditions?: Record<string, unknown>
    uncertainty?: number
    uncertaintyFormula?: string
  },
  userId: string,
  reason?: string
) {
  try {
    const testRecord = await prisma.testRecord.findUnique({
      where: { id },
    })
    
    if (!testRecord) {
      throw new Error('Test record not found')
    }
    
    const updated = await prisma.testRecord.update({
      where: { id },
      data: {
        rawData: data.rawData as any,
        calculatedData: data.calculatedData as any,
        environmentalConditions: data.environmentalConditions as any,
        uncertainty: data.uncertainty,
        uncertaintyFormula: data.uncertaintyFormula,
      },
    })
    
    await createAuditTrail({
      userId,
      action: 'UPDATE',
      entityType: 'TestRecord',
      entityId: testRecord.id,
      changes: {
        before: {
          rawData: testRecord.rawData,
          calculatedData: testRecord.calculatedData,
          uncertainty: testRecord.uncertainty,
        },
        after: data,
      },
      reason,
    })
    
    return updated
  } catch (error) {
    console.error('Failed to update test record:', error)
    throw error
  }
}

export async function updateTestStatus(
  id: string,
  status: TestStatus,
  userId: string,
  reason?: string
) {
  try {
    const testRecord = await prisma.testRecord.findUnique({
      where: { id },
    })
    
    if (!testRecord) {
      throw new Error('Test record not found')
    }
    
    const updateData: any = {
      status,
    }
    
    if (status === TestStatus.COMPLETED) {
      updateData.completedAt = new Date()
    } else if (status === TestStatus.REVIEW) {
      updateData.reviewedAt = new Date()
      updateData.reviewedBy = userId
    }
    
    const updated = await prisma.testRecord.update({
      where: { id },
      data: updateData,
    })
    
    // Update assignment status
    await prisma.testAssignment.update({
      where: { testRecordId: id },
      data: { status },
    })
    
    await createAuditTrail({
      userId,
      action: 'UPDATE',
      entityType: 'TestRecord',
      entityId: testRecord.id,
      changes: {
        before: { status: testRecord.status },
        after: { status },
      },
      reason,
    })
    
    return updated
  } catch (error) {
    console.error('Failed to update test status:', error)
    throw error
  }
}

export async function getTestsByUser(userId: string) {
  try {
    const assignments = await prisma.testAssignment.findMany({
      where: { assignedTo: userId },
      include: {
        testRecord: {
          include: {
            sample: {
              select: {
                sampleId: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    })
    return assignments
  } catch (error) {
    console.error('Failed to get tests by user:', error)
    throw error
  }
}
