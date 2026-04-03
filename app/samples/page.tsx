'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SamplesPage() {
  const [samples, setSamples] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    clientInfo: '',
    description: '',
    receivedBy: 'admin',
    storageCondition: '',
    dueDate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('시료가 등록되었습니다')
        setShowForm(false)
        setFormData({
          name: '',
          clientName: '',
          clientInfo: '',
          description: '',
          receivedBy: 'admin',
          storageCondition: '',
          dueDate: '',
        })
      } else {
        alert('시료 등록에 실패했습니다')
      }
    } catch (error) {
      console.error('Failed to create sample:', error)
      alert('시료 등록에 실패했습니다')
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
              <h1 className="text-2xl font-bold text-gray-900">시료 관리</h1>
              <p className="text-sm text-gray-500">시료 입고부터 관리</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
                대시보드
              </Link>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                {showForm ? '목록 보기' : '새 시료 접수'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">새 시료 접수</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시료명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  의뢰자 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  의뢰자 정보
                </label>
                <input
                  type="text"
                  value={formData.clientInfo}
                  onChange={(e) => setFormData({ ...formData, clientInfo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  보관 조건
                </label>
                <input
                  type="text"
                  value={formData.storageCondition}
                  onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="예: 실온, 냉장, 냉동"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시험 기한
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
              <h2 className="text-lg font-semibold text-gray-900">시료 목록</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                시료 목록이 여기에 표시됩니다.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
