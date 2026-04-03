'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Equipment {
  id: string
  equipmentId: string
  name: string
  model?: string
  manufacturer?: string
  status: string
  calibrationDue?: string
  location?: string
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    equipmentId: '',
    name: '',
    model: '',
    manufacturer: '',
    location: '',
    calibrationCycle: '365',
  })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment')
      const data = await response.json()
      setEquipment(data)
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('장비가 등록되었습니다')
        setShowForm(false)
        fetchEquipment()
        setFormData({
          equipmentId: '',
          name: '',
          model: '',
          manufacturer: '',
          location: '',
          calibrationCycle: '365',
        })
      } else {
        alert('장비 등록에 실패했습니다')
      }
    } catch (error) {
      console.error('Failed to create equipment:', error)
      alert('장비 등록에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">장비 관리</h1>
              <p className="text-sm text-gray-500">장비 상태 및 교정 관리</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
                대시보드
              </Link>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                {showForm ? '목록 보기' : '새 장비 등록'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">새 장비 등록</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  장비 번호 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.equipmentId}
                  onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  장비명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    모델
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제조사
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  위치
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  교정 주기 (일)
                </label>
                <input
                  type="number"
                  value={formData.calibrationCycle}
                  onChange={(e) => setFormData({ ...formData, calibrationCycle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">장비 목록</h2>
            </div>
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">로딩 중...</p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                등록된 장비가 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">장비 번호</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">장비명</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">모델</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제조사</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">위치</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">교정 기한</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {equipment.map((eq) => (
                      <tr key={eq.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {eq.equipmentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {eq.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {eq.model || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {eq.manufacturer || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={eq.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {eq.location || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {eq.calibrationDue ? new Date(eq.calibrationDue).toLocaleDateString('ko-KR') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    RUN: 'bg-green-100 text-green-800',
    IDLE: 'bg-blue-100 text-blue-800',
    DOWN: 'bg-red-100 text-red-800',
    CALIBRATION: 'bg-yellow-100 text-yellow-800',
    RETIRED: 'bg-gray-100 text-gray-800',
  }

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}
