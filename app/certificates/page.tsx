'use client'

import Link from 'next/link'

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">성적서 관리</h1>
              <p className="text-sm text-gray-500">시험 성적서 발행 및 관리</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
                대시보드
              </Link>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                새 성적서
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">성적서 목록</h2>
          <p className="text-gray-600 mb-6">
            KOLAS 로고 및 인정 마크가 포함된 표준 성적서를 발행합니다.
          </p>
          
          <div className="border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-900">성적서 템플릿</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                성적서 템플릿이 여기에 표시됩니다.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">성적서 보안 기능</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>전자 서명 (디지털 서명)</li>
            <li>위변조 방지 워터마크</li>
            <li>2D 바코드 (검증용)</li>
            <li>권한별 접근 제어</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
