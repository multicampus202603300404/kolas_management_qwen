'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function SampleDetailPage() {
  const params = useParams()
  const sampleId = params.id as string
  const [sample, setSample] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch sample details from API
    // For now, show placeholder
    setLoading(false)
  }, [sampleId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시료 상세</h1>
              <p className="text-sm text-gray-500">{sampleId}</p>
            </div>
            <Link href="/samples" className="text-primary-600 hover:text-primary-700">
              목록으로
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sample Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">시료 정보</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">시료 번호</dt>
                  <dd className="mt-1 text-sm text-gray-900">{sampleId || 'S-202401-ABC123'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">시료명</dt>
                  <dd className="mt-1 text-sm text-gray-900">샘플 시료</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">의뢰자</dt>
                  <dd className="mt-1 text-sm text-gray-900">한국식품</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">접수일</dt>
                  <dd className="mt-1 text-sm text-gray-900">2024-01-15</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">상태</dt>
                  <dd className="mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      시험 중
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">보관 조건</dt>
                  <dd className="mt-1 text-sm text-gray-900">실온</dd>
                </div>
              </dl>
            </div>

            {/* Test Records */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">시험 기록</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">수분 함량</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      완료
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">시험 방법: KS H 2001</p>
                  <p className="text-sm text-gray-500">결과: 12.5%</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">pH</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      진행 중
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">시험 방법: KS M 1001</p>
                  <p className="text-sm text-gray-500">결과: -</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode & QR */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">바코드/QR 코드</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">바코드</p>
                  <div className="bg-gray-100 p-4 rounded text-center">
                    <div className="text-xs text-gray-500 mb-2">S-202401-ABC123</div>
                    <div className="h-16 bg-gray-300 rounded flex items-center justify-center text-gray-500">
                      [바코드 이미지]
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">QR 코드</p>
                  <div className="bg-gray-100 p-4 rounded text-center">
                    <div className="h-32 w-32 mx-auto bg-gray-300 rounded flex items-center justify-center text-gray-500">
                      [QR 코드 이미지]
                    </div>
                  </div>
                </div>
                <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                  출력하기
                </button>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">이력</h2>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">접수</span>
                    <span className="text-gray-500 text-xs">2024-01-15 09:30</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">관리자</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">배정</span>
                    <span className="text-gray-500 text-xs">2024-01-15 10:00</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">시험원 배정</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">시험 시작</span>
                    <span className="text-gray-500 text-xs">2024-01-15 11:00</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">시험원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
