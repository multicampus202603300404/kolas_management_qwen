'use server'

import { prisma } from './prisma'
import { AuditAction } from '@prisma/client'

interface AuditTrailInput {
  userId: string
  action: AuditAction
  entityType: string
  entityId: string
  changes?: Record<string, unknown>
  reason?: string
  ipAddress?: string
  userAgent?: string
}

export async function createAuditTrail(input: AuditTrailInput) {
  try {
    const auditTrail = await prisma.auditTrail.create({
      data: {
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        changes: input.changes ? input.changes as any : null,
        reason: input.reason,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    })
    return auditTrail
  } catch (error) {
    console.error('Failed to create audit trail:', error)
    throw error
  }
}

export async function getAuditTrailsByEntity(entityType: string, entityId: string) {
  try {
    const trails = await prisma.auditTrail.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    })
    return trails
  } catch (error) {
    console.error('Failed to get audit trails:', error)
    throw error
  }
}

export async function getAuditTrailsByDateRange(startDate: Date, endDate: Date) {
  try {
    const trails = await prisma.auditTrail.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    })
    return trails
  } catch (error) {
    console.error('Failed to get audit trails:', error)
    throw error
  }
}
