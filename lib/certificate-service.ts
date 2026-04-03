'use server'

import { prisma } from './prisma'
import { CertificateStatus } from '@prisma/client'
import { generateCertificateNo } from './utils'
import { createAuditTrail } from './audit-trail'
import QRCode from 'qrcode'

interface CreateCertificateTemplateInput {
  name: string
  content: string
  hasKolasLogo?: boolean
  hasAccreditationMark?: boolean
}

export async function createCertificateTemplate(
  input: CreateCertificateTemplateInput,
  userId: string
) {
  try {
    // Deactivate existing templates
    await prisma.certificateTemplate.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    })
    
    const template = await prisma.certificateTemplate.create({
      data: {
        name: input.name,
        content: input.content,
        hasKolasLogo: input.hasKolasLogo ?? true,
        hasAccreditationMark: input.hasAccreditationMark ?? true,
        isActive: true,
        version: '1.0',
      },
    })
    
    await createAuditTrail({
      userId,
      action: 'CREATE',
      entityType: 'CertificateTemplate',
      entityId: template.id,
      changes: { created: template },
    })
    
    return template
  } catch (error) {
    console.error('Failed to create template:', error)
    throw error
  }
}

export async function getActiveTemplate() {
  try {
    const template = await prisma.certificateTemplate.findFirst({
      where: { isActive: true },
    })
    return template
  } catch (error) {
    console.error('Failed to get template:', error)
    throw error
  }
}

interface CreateCertificateInput {
  testRecordIds: string[]
  templateId: string
  approvedBy?: string
}

export async function createCertificate(input: CreateCertificateInput, userId: string) {
  try {
    const certificateNo = generateCertificateNo()
    
    const certificate = await prisma.certificate.create({
      data: {
        certificateNo,
        testRecordIds: input.testRecordIds,
        templateId: input.templateId,
        status: input.approvedBy ? CertificateStatus.APPROVED : CertificateStatus.DRAFT,
        content: '', // Will be generated from template
        watermark: true,
      },
    })
    
    await createAuditTrail({
      userId,
      action: 'CREATE',
      entityType: 'Certificate',
      entityId: certificate.id,
      changes: { created: certificate },
    })
    
    return certificate
  } catch (error) {
    console.error('Failed to create certificate:', error)
    throw error
  }
}

export async function approveCertificate(
  certificateId: string,
  approvedBy: string
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
    })
    
    if (!certificate) {
      throw new Error('Certificate not found')
    }
    
    // Generate QR code for certificate verification
    const qrCodeData = JSON.stringify({
      certificateNo: certificate.certificateNo,
      issuedAt: new Date().toISOString(),
      verified: true,
    })
    const qrCode = await QRCode.toDataURL(qrCodeData)
    
    const updated = await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        status: CertificateStatus.APPROVED,
        approvedBy,
        approvedAt: new Date(),
        qrCode,
        digitalSignature: `DIGITAL_SIG_${Date.now()}_${approvedBy}`,
      },
    })
    
    await createAuditTrail({
      userId: approvedBy,
      action: 'APPROVE',
      entityType: 'Certificate',
      entityId: certificateId,
      changes: { status: CertificateStatus.APPROVED },
    })
    
    return updated
  } catch (error) {
    console.error('Failed to approve certificate:', error)
    throw error
  }
}

export async function issueCertificate(
  certificateId: string,
  userId: string
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
    })
    
    if (!certificate) {
      throw new Error('Certificate not found')
    }
    
    const updated = await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        status: CertificateStatus.ISSUED,
        issuedAt: new Date(),
      },
    })
    
    await createAuditTrail({
      userId,
      action: 'UPDATE',
      entityType: 'Certificate',
      entityId: certificateId,
      changes: { status: CertificateStatus.ISSUED },
    })
    
    return updated
  } catch (error) {
    console.error('Failed to issue certificate:', error)
    throw error
  }
}

export async function getCertificate(certificateNo: string) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateNo },
      include: {
        template: true,
        approver: {
          select: {
            name: true,
            position: true,
          },
        },
      },
    })
    return certificate
  } catch (error) {
    console.error('Failed to get certificate:', error)
    throw error
  }
}

export async function getCertificatesByStatus(status: CertificateStatus) {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { status },
      include: {
        template: {
          select: {
            name: true,
          },
        },
        approver: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return certificates
  } catch (error) {
    console.error('Failed to get certificates:', error)
    throw error
  }
}
