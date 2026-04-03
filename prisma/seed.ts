import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/utils'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@k-lims.com' },
    update: {},
    create: {
      email: 'admin@k-lims.com',
      password: adminPassword,
      name: '관리자',
      role: 'ADMIN',
      department: '관리팀',
      position: '시스템 관리자',
      status: 'ACTIVE',
      qualifications: '',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create approver user
  const approverPassword = hashPassword('approver123')
  const approver = await prisma.user.upsert({
    where: { email: 'approver@k-lims.com' },
    update: {},
    create: {
      email: 'approver@k-lims.com',
      password: approverPassword,
      name: '승인권자',
      role: 'APPROVER',
      department: '기술팀',
      position: '기술팀장',
      status: 'ACTIVE',
      qualifications: '',
    },
  })
  console.log('Created approver user:', approver.email)

  // Create reviewer user
  const reviewerPassword = hashPassword('reviewer123')
  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@k-lims.com' },
    update: {},
    create: {
      email: 'reviewer@k-lims.com',
      password: reviewerPassword,
      name: '검토자',
      role: 'REVIEWER',
      department: '기술팀',
      position: '수석연구원',
      status: 'ACTIVE',
      qualifications: '',
    },
  })
  console.log('Created reviewer user:', reviewer.email)

  // Create tester user
  const testerPassword = hashPassword('tester123')
  const tester = await prisma.user.upsert({
    where: { email: 'tester@k-lims.com' },
    update: {},
    create: {
      email: 'tester@k-lims.com',
      password: testerPassword,
      name: '시험원',
      role: 'TESTER',
      department: '기술팀',
      position: '연구원',
      status: 'ACTIVE',
      qualifications: '화학분석,물성시험',
    },
  })
  console.log('Created tester user:', tester.email)

  // Create quality manager user
  const qmPassword = hashPassword('qm123')
  const qm = await prisma.user.upsert({
    where: { email: 'qm@k-lims.com' },
    update: {},
    create: {
      email: 'qm@k-lims.com',
      password: qmPassword,
      name: '품질책임자',
      role: 'QUALITY_MANAGER',
      department: '품질팀',
      position: '품질책임자',
      status: 'ACTIVE',
      qualifications: '',
    },
  })
  console.log('Created quality manager user:', qm.email)

  // Create sample equipment
  const equipment = await prisma.equipment.upsert({
    where: { equipmentId: 'EQ-001' },
    update: {},
    create: {
      equipmentId: 'EQ-001',
      name: 'HPLC',
      model: 'Agilent 1260',
      manufacturer: 'Agilent Technologies',
      serialNumber: 'SN123456',
      location: '분석실 1',
      status: 'IDLE',
      calibrationCycle: 365,
      calibrationDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })
  console.log('Created equipment:', equipment.equipmentId)

  console.log('Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
