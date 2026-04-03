'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API 호출 구현
    alert('고객이 등록되었습니다')
    setShowForm(false)
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
              <p className="text-sm text-gray-500">고객 정보 및 이력 관리</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <span className="text-primary-600">홈으로</span>
              </Link>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                {showForm ? '목록 보기' : '새 고객 등록'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">새 고객 등록</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    성함 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주소
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  담당자
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">고객 목록</h2>
            </div>
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회사명</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">성함</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">전화번호</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">담당자</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      한국식품연구소
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      홍길동
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      gd.hong@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      02-1234-5678
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      김연구
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
