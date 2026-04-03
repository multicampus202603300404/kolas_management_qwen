'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AuditTrail {
  id: string
  timestamp: string
  action: string
  entityType: string
  entityId: string
  user: {
    name: string
    role: string
  }
  changes?: any
  reason?: string
}

export default function AuditTrailPage() {
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchAuditTrails()
  }, [])

  const fetchAuditTrails = async () => {
    try {
      const response = await fetch(
        `/api/audit-trail?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      )
      const data = await response.json()
      setAuditTrails(data)
    } catch (error) {
      console.error('Failed to fetch audit trails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/audit-trail/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateRange),
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-trail-${dateRange.startDate}-${dateRange.endDate}.pdf`
        a.click()
        alert('감사 추적이 내보내졌습니다')
      }
    } catch (error) {
      console.error('Failed to export:', error)
      alert('내보내기에 실패했습니다')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
              <p className="text-sm text-gray-500">ALCOA+ 준수 감사 추적</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
                대시보드
              </Link>
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                PDF 내보내기
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-end space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={fetchAuditTrails}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              조회
            </button>
          </div>
        </div>

        {/* Audit Trail List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              감사 추적 목록 ({auditTrails.length}건)
            </h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : auditTrails.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              감사 추적 기록이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">일시</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">사용자</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">동작</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">엔티티</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">변경 사유</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditTrails.map((trail) => (
                    <tr key={trail.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(trail.timestamp).toLocaleString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{trail.user.name}</div>
                        <div className="text-sm text-gray-500">{trail.user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ActionBadge action={trail.action} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trail.entityType} ({trail.entityId})
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trail.reason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ActionBadge({ action }: { action: string }) {
  const actionColors: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    APPROVE: 'bg-purple-100 text-purple-800',
    REJECT: 'bg-orange-100 text-orange-800',
    LOGIN: 'bg-gray-100 text-gray-800',
    LOGOUT: 'bg-gray-100 text-gray-800',
    EXPORT: 'bg-indigo-100 text-indigo-800',
  }

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${actionColors[action] || 'bg-gray-100 text-gray-800'}`}>
      {action}
    </span>
  )
}
