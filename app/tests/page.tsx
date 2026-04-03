'use client'

import Link from 'next/link'

export default function TestsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시험 관리</h1>
              <p className="text-sm text-gray-500">시험 작업 및 데이터 관리</p>
            </div>
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
              대시보드
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">시험 관리</h2>
          <p className="text-gray-600 mb-6">
            시험 항목 등록, 작업 배정, Raw Data 입력, 불확도 계산 등의 기능을 사용할 수 있습니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">시험 항목 등록</h3>
              <p className="text-sm text-gray-600 mb-4">
                새로운 시험 항목과 방법을 등록합니다.
              </p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                등록하기 →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">작업 배정</h3>
              <p className="text-sm text-gray-600 mb-4">
                시험원에게 작업을 배정합니다.
              </p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                배정하기 →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Raw Data 입력</h3>
              <p className="text-sm text-gray-600 mb-4">
                시험 Raw Data 를 입력하고 계산합니다.
              </p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                입력하기 →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">불확도 계산</h3>
              <p className="text-sm text-gray-600 mb-4">
                측정불확도를 자동 계산합니다.
              </p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                계산하기 →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
