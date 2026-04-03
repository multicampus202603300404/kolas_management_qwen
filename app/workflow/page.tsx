'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WorkflowPage() {
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  const workflows = [
    {
      requestId: 'REQ-2024-001',
      customer: '한국식품연구소',
      testType: '화학분석',
      sampleName: '김치',
      status: 'IN_PROGRESS',
      requestDate: '2024-01-15',
      deadline: '2024-01-22',
      price: 150000,
    },
    {
      requestId: 'REQ-2024-002',
      customer: '(주) 바이오',
      testType: '미생물시험',
      sampleName: '건강기능식품',
      status: 'CONSULTATION',
      requestDate: '2024-01-16',
      deadline: '2024-01-25',
      price: 200000,
    },
    {
      requestId: 'REQ-2024-003',
      customer: '서울대학교',
      testType: '물성시험',
      sampleName: '고분자재료',
      status: 'COMPLETED',
      requestDate: '2024-01-10',
      deadline: '2024-01-20',
      price: 300000,
    },
  ]

  const statusColors: Record<string, string> = {
    CONSULTATION: 'bg-gray-100 text-gray-800',
    REQUESTED: 'bg-blue-100 text-blue-800',
    RECEIVED: 'bg-purple-100 text-purple-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CERTIFIED: 'bg-indigo-100 text-indigo-800',
    INVOICED: 'bg-orange-100 text-orange-800',
    PAID: 'bg-emerald-100 text-emerald-800',
  }

  const statusLabels: Record<string, string> = {
    ALL: '전체',
    CONSULTATION: '협의중',
    REQUESTED: '의뢰됨',
    RECEIVED: '접수됨',
    IN_PROGRESS: '시험중',
    COMPLETED: '시험완료',
    CERTIFIED: '성적서발행',
    INVOICED: '청구됨',
    PAID: '입금완료',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">워크플로우 관리</h1>
              <p className="text-sm text-gray-500">의뢰부터 입금까지 전 과정 관리</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <span className="text-primary-600">홈으로</span>
              </Link>
              <Link href="/request">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                  새 의뢰 신청
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {Object.entries(statusLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedStatus === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">의뢰번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">고객</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시험유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시료</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">의뢰일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflows.map((workflow) => (
                <tr key={workflow.requestId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {workflow.requestId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workflow.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workflow.testType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workflow.sampleName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[workflow.status]}`}>
                      {statusLabels[workflow.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workflow.requestDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workflow.price.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/workflow/${workflow.requestId}`}>
                      <span className="text-primary-600 hover:text-primary-900">상세</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Workflow Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">협의중</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">1</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">시험중</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">1</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">청구대기</div>
            <div className="mt-2 text-3xl font-bold text-green-600">1</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">이번달 매출</div>
            <div className="mt-2 text-3xl font-bold text-primary-600">650,000</div>
          </div>
        </div>
      </main>
    </div>
  )
}
