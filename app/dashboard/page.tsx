'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard stats:', err)
        setLoading(false)
      })
  }, [])

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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
              <p className="text-sm text-gray-500">실시간 시험실 현황</p>
            </div>
            <Link href="/">
              <span className="text-primary-600">홈으로</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-md p-3 mr-4">
                <div className="text-white text-2xl font-bold">{stats?.samples?.total || 0}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">총 시료</p>
                <p className="text-xs text-gray-400">마감 임박: {stats?.samples?.dueSoon || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-md p-3 mr-4">
                <div className="text-white text-2xl font-bold">{stats?.tests?.byStatus?.IN_PROGRESS || 0}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">시험 중</p>
                <p className="text-xs text-gray-400">대기: {stats?.tests?.byStatus?.PENDING || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-md p-3 mr-4">
                <div className="text-white text-2xl font-bold">{stats?.equipment?.total || 0}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">장비</p>
                <p className="text-xs text-gray-400">교정 임박: {stats?.equipment?.dueForCalibration || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-md p-3 mr-4">
                <div className="text-white text-2xl font-bold">{stats?.certificates?.total || 0}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">성적서</p>
                <p className="text-xs text-gray-400">승인 대기: {stats?.certificates?.byStatus?.PENDING || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">최근 시료</h2>
            <Link href="/samples">
              <span className="text-primary-600 text-sm">전체 보기</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시료 번호</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시료명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">의뢰자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">접수일</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.samples?.recent?.map((sample) => (
                  <tr key={sample.sampleId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sample.sampleId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sample.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sample.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {sample.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sample.receivedAt).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
