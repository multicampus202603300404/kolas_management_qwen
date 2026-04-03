'use server'

import { prisma } from './prisma'
import { SampleStatus, TestStatus, EquipmentStatus, CertificateStatus } from '@prisma/client'

export async function getDashboardStats() {
  try {
    // Sample statistics
    const sampleStats = await prisma.sample.groupBy({
      by: ['status'],
      _count: true,
    })
    
    // Test statistics
    const testStats = await prisma.testRecord.groupBy({
      by: ['status'],
      _count: true,
    })
    
    // Equipment statistics
    const equipmentStats = await prisma.equipment.groupBy({
      by: ['status'],
      _count: true,
    })
    
    // Certificate statistics
    const certificateStats = await prisma.certificate.groupBy({
      by: ['status'],
      _count: true,
    })
    
    // Recent samples
    const recentSamples = await prisma.sample.findMany({
      take: 5,
      orderBy: { receivedAt: 'desc' },
      select: {
        sampleId: true,
        name: true,
        status: true,
        receivedAt: true,
        clientName: true,
      },
    })
    
    // Equipment due for calibration
    const calibrationDueDate = new Date()
    calibrationDueDate.setDate(calibrationDueDate.getDate() + 30)
    
    const equipmentDueForCalibration = await prisma.equipment.count({
      where: {
        calibrationDue: {
          lte: calibrationDueDate,
        },
        status: {
          not: EquipmentStatus.RETIRED,
        },
      },
    })
    
    // Samples due soon
    const samplesDueSoonDate = new Date()
    samplesDueSoonDate.setDate(samplesDueSoonDate.getDate() + 7)
    
    const samplesDueSoon = await prisma.sample.count({
      where: {
        dueDate: {
          lte: samplesDueSoonDate,
        },
        status: {
          in: [SampleStatus.RECEIVED, SampleStatus.PENDING, SampleStatus.ASSIGNED, SampleStatus.IN_PROGRESS],
        },
      },
    })
    
    // CRM expiring soon
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    
    const crmExpiringSoon = await prisma.crm.count({
      where: {
        expiryDate: {
          lte: expiryDate,
        },
      },
    })
    
    // CRM low stock
    const crmLowStock = await prisma.crm.count({
      where: {
        quantity: {
          lte: prisma.crm.fields.minQuantity,
        },
      },
    })
    
    // Non-conformities open
    const openNonConformities = await prisma.nonConformity.count({
      where: {
        status: {
          in: ['OPEN', 'INVESTIGATING', 'CORRECTIVE_ACTION'],
        },
      },
    })
    
    // Format statistics
    const formatStats = (stats: any[], allStatuses: string[]) => {
      const result: Record<string, number> = {}
      allStatuses.forEach(status => {
        result[status] = 0
      })
      stats.forEach(stat => {
        result[stat.status] = stat._count
      })
      return result
    }
    
    return {
      samples: {
        total: await prisma.sample.count(),
        byStatus: formatStats(sampleStats, Object.values(SampleStatus)),
        recent: recentSamples,
        dueSoon: samplesDueSoon,
      },
      tests: {
        total: await prisma.testRecord.count(),
        byStatus: formatStats(testStats, Object.values(TestStatus)),
      },
      equipment: {
        total: await prisma.equipment.count(),
        byStatus: formatStats(equipmentStats, Object.values(EquipmentStatus)),
        dueForCalibration: equipmentDueForCalibration,
      },
      certificates: {
        total: await prisma.certificate.count(),
        byStatus: formatStats(certificateStats, Object.values(CertificateStatus)),
      },
      quality: {
        crmExpiringSoon,
        crmLowStock,
        openNonConformities,
      },
    }
  } catch (error) {
    console.error('Failed to get dashboard stats:', error)
    throw error
  }
}

export async function getAuditTrailSummary(days: number = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const auditTrails = await prisma.auditTrail.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 50,
    })
    
    const actionCounts = await prisma.auditTrail.groupBy({
      by: ['action'],
      _count: true,
      where: {
        timestamp: {
          gte: startDate,
        },
      },
    })
    
    return {
      recent: auditTrails,
      byAction: actionCounts,
    }
  } catch (error) {
    console.error('Failed to get audit trail summary:', error)
    throw error
  }
}
