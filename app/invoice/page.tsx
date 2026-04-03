'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function InvoicePage() {
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null)

  const invoices = [
    {
      invoiceNo: 'INV-2024-001',
      requestId: 'REQ-2024-001',
      customer: '한국식품연구소',
      issueDate: '2024-01-20',
      dueDate: '2024-02-19',
      amount: 150000,
      paidAmount: 0,
      status: 'UNPAID',
    },
    {
      invoiceNo: 'INV-2024-002',
      requestId: 'REQ-2024-002',
      customer: '(주) 바이오',
      issueDate: '2024-01-18',
      dueDate: '2024-02-17',
      amount: 200000,
      paidAmount: 200000,
      status: 'PAID',
    },
    {
      invoiceNo: 'INV-2024-003',
      requestId: 'REQ-2024-003',
      customer: '서울대학교',
      issueDate: '2024-01-15',
      dueDate: '2024-02-14',
      amount: 300000,
      paidAmount: 150000,
      status: 'PARTIAL',
    },
  ]

  const statusColors: Record<string, string> = {
    UNPAID: 'bg-red-100 text-red-800',
    PARTIAL: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-orange-100 text-orange-800',
  }

  const statusLabels: Record<string, string> = {
    UNPAID: '미입금',
    PARTIAL: '부분입금',
    PAID: '입금완료',
    OVERDUE: '연체',
  }

  const handlePayment = (index: number) => {
    setSelectedInvoice(index)
    setShowPaymentForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">송장/수수료 관리</h1>
              <p className="text-sm text-gray-500">청구 및 입금 관리</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <span className="text-primary-600">홈으로</span>
              </Link>
              <Link href="/workflow">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                  워크플로우
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">총 송장</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{invoices.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">미입금</div>
            <div className="mt-2 text-3xl font-bold text-red-600">
              {invoices.filter(i => i.status === 'UNPAID').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">미수금</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">
              {invoices.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0).toLocaleString()}원
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">입금완료</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {invoices.filter(i => i.status === 'PAID').length}
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">송장 목록</h2>
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>전체</option>
                <option>미입금</option>
                <option>부분입금</option>
                <option>입금완료</option>
              </select>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">송장번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">의뢰번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">고객</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">발행일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">마감일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice, index) => (
                <tr key={invoice.invoiceNo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {invoice.invoiceNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.requestId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.amount.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[invoice.status]}`}>
                      {statusLabels[invoice.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {invoice.status !== 'PAID' && (
                      <button
                        onClick={() => handlePayment(index)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        입금처리
                      </button>
                    )}
                    <Link href={`/invoice/${invoice.invoiceNo}`}>
                      <span className="text-gray-600 hover:text-gray-900">상세</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentForm && selectedInvoice !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">입금 처리</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  송장번호
                </label>
                <input
                  type="text"
                  value={invoices[selectedInvoice].invoiceNo}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  총 금액
                </label>
                <input
                  type="text"
                  value={`${invoices[selectedInvoice].amount.toLocaleString()}원`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  입금금액
                </label>
                <input
                  type="number"
                  defaultValue={invoices[selectedInvoice].amount - invoices[selectedInvoice].paidAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  입금일
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비고
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert('입금이 처리되었습니다')
                  setShowPaymentForm(false)
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
