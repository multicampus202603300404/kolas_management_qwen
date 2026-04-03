'use server'

import { prisma } from './prisma'
import { hashPassword, verifyPassword } from './utils'
import { UserRole, UserStatus } from '@prisma/client'
import { createAuditTrail } from './audit-trail'

interface CreateUserInput {
  email: string
  password: string
  name: string
  role: UserRole
  department?: string
  position?: string
  qualifications?: string[]
}

export async function createUser(input: CreateUserInput, userId: string) {
  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    })
    
    if (existing) {
      throw new Error('User already exists')
    }
    
    const hashedPassword = hashPassword(input.password)
    
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        role: input.role,
        department: input.department,
        position: input.position,
        qualifications: input.qualifications || [],
        status: UserStatus.ACTIVE,
      },
    })
    
    await createAuditTrail({
      userId,
      action: 'CREATE',
      entityType: 'User',
      entityId: user.id,
      changes: { created: { ...user, password: '[REDACTED]' } },
    })
    
    return { ...user, password: undefined }
  } catch (error) {
    console.error('Failed to create user:', error)
    throw error
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }
    
    if (user.status !== UserStatus.ACTIVE) {
      return { success: false, error: 'User account is not active' }
    }
    
    const isValid = verifyPassword(password, user.password)
    
    if (!isValid) {
      return { success: false, error: 'Invalid password' }
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })
    
    // Create audit trail
    await createAuditTrail({
      userId: user.id,
      action: 'LOGIN',
      entityType: 'User',
      entityId: user.id,
    })
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position,
      },
    }
  } catch (error) {
    console.error('Authentication failed:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        qualifications: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })
    return user
  } catch (error) {
    console.error('Failed to get user:', error)
    throw error
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        status: true,
      },
      orderBy: { name: 'asc' },
    })
    return users
  } catch (error) {
    console.error('Failed to get users:', error)
    throw error
  }
}

export async function updateUserStatus(
  userId: string, 
  status: UserStatus, 
  adminId: string
) {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status },
    })
    
    await createAuditTrail({
      userId: adminId,
      action: 'UPDATE',
      entityType: 'User',
      entityId: userId,
      changes: { status },
    })
    
    return updated
  } catch (error) {
    console.error('Failed to update user status:', error)
    throw error
  }
}

export async function getUsersByRole(role: UserRole) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
      },
      orderBy: { name: 'asc' },
    })
    return users
  } catch (error) {
    console.error('Failed to get users by role:', error)
    throw error
  }
}
