import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed)
}

export function generateId(): string {
  return uuidv4()
}

export function generateSampleId(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `S-${year}${month}-${random}`
}

export function generateCertificateNo(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `CERT-${year}-${random}`
}

export function generateBarcode(): string {
  return Math.random().toString(36).substring(2, 14).toUpperCase()
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatDateTime(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 19)
}
