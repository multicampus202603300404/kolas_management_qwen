import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary-700">K-LIMS</h1>
              <span className="text-sm text-gray-500">KOLAS 17025 Compliant LIMS</span>
            </div>
            <nav className="flex space-x-6">
              <Link href="/workflow" className="text-primary-600 hover:text-primary-700 font-medium">
                워크플로우
              </Link>
              <Link href="/customers" className="text-gray-600 hover:text-gray-900">
                고객관리
              </Link>
              <Link href="/request" className="text-gray-600 hover:text-gray-900">
                시험의뢰
              </Link>
              <Link href="/samples" className="text-gray-600 hover:text-gray-900">
                시료관리
              </Link>
              <Link href="/invoice" className="text-gray-600 hover:text-gray-900">
                송장관리
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            KOLAS 17025 기준 Laboratory Information Management System
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            시험 전 과정 디지털화, 데이터 위변조 방지, 심사 대응 효율화
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/workflow"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              워크플로우 관리
            </Link>
            <Link
              href="/request"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition"
            >
              시험의뢰 신청
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">전체 워크플로우</h3>
        <p className="text-gray-600 text-center mb-12">
          고객 의뢰부터 성적서 발행, 수수료 관리까지 원스톱으로 처리됩니다
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <WorkflowStep
            step="1"
            icon="💬"
            title="사전 협의"
            description="고객과 시험 항목, 기간, 비용 협의"
          />
          <WorkflowStep
            step="2"
            icon="📝"
            title="의뢰 및 접수"
            description="시험의뢰서 작성 및 시료 접수"
          />
          <WorkflowStep
            step="3"
            icon="🔬"
            title="시험 수행"
            description="자격있는 시험원이 시험 실시 및 기록"
          />
          <WorkflowStep
            step="4"
            icon="📄"
            title="성적서 발행"
            description="시험결과 검토 및 승인 후 성적서 발행"
          />
          <WorkflowStep
            step="5"
            icon="💰"
            title="송장 발행"
            description="시험 수수료 송장 발행 및 청구"
          />
          <WorkflowStep
            step="6"
            icon="✅"
            title="입금 처리"
            description="고객 입금 확인 및 마감 처리"
          />
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center mb-12">핵심 가치</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              value="추적성"
              description="모든 시험 과정의 완전한 추적 가능성"
            />
            <ValueCard
              value="신뢰성"
              description="데이터 위변조 방지 및 무결성 보장"
            />
            <ValueCard
              value="효율성"
              description="심사 준비 시간 70% 단축"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 K-LIMS. KOLAS 17025 Compliant Laboratory Information Management System</p>
        </div>
      </footer>
    </main>
  )
}

function WorkflowStep({ step, icon, title, description }: { step: string; icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition relative">
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function ValueCard({ value, description }: { value: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold mb-2">{value}</div>
      <p className="text-primary-100">{description}</p>
    </div>
  )
}
