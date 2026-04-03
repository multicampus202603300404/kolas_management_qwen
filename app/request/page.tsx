'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestRequestPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Customer Info
    customerId: '',
    customerName: '',
    company: '',
    email: '',
    phone: '',
    
    // Test Info
    testType: '',
    testItems: '',
    purpose: '',
    deadline: '',
    
    // Sample Info
    sampleName: '',
    sampleQty: 1,
    sampleCondition: '',
    
    // Pricing
    totalPrice: 0,
    vat: 0,
    discount: 0,
    
    // Notes
    notes: '',
  })

  const testTypes = [
    '화학분석',
    '물성시험',
    '미생물시험',
    '관능평가',
    '유통기한',
    '영양성분',
    '잔류농약',
    '중금속',
    '기타',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('시험의뢰가 신청되었습니다. 협의 후 접수됩니다.')
    setStep(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시험의뢰 신청</h1>
              <p className="text-sm text-gray-500">고객 시험 요청 접수</p>
            </div>
            <Link href="/">
              <span className="text-primary-600">홈으로</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">고객정보</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">시험정보</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 3 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">시료정보</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 4 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 4 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 4 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
              }`}>
                4
              </div>
              <span className="ml-2 text-sm font-medium">확인</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">고객 정보</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  고객명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="홍길동"
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
                  placeholder="(주) 한국식품"
                />
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

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">시험 정보</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시험 유형 *
                </label>
                <select
                  required
                  value={formData.testType}
                  onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">선택하세요</option>
                  {testTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시험 항목 *
                </label>
                <textarea
                  required
                  value={formData.testItems}
                  onChange={(e) => setFormData({ ...formData, testItems: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="예: 수분, 조단백질, 조지방, pH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시험 목적
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="예: 제품 개발, 품질 관리, 수출용"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  희망 완료일
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-md"
                >
                  이전
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">시료 정보</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시료명 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sampleName}
                  onChange={(e) => setFormData({ ...formData, sampleName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시료 수량 *
                </label>
                <input
                  type="number"
                  required
                  value={formData.sampleQty}
                  onChange={(e) => setFormData({ ...formData, sampleQty: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시료 상태
                </label>
                <textarea
                  value={formData.sampleCondition}
                  onChange={(e) => setFormData({ ...formData, sampleCondition: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="예: 냉장 보관, 상온, 특이사항 없음"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-md"
                >
                  이전
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">신청 내용 확인</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">고객명:</span>
                  <span className="font-medium">{formData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">회사명:</span>
                  <span className="font-medium">{formData.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">연락처:</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">시험 유형:</span>
                  <span className="font-medium">{formData.testType || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">시료명:</span>
                  <span className="font-medium">{formData.sampleName || '-'}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 border border-gray-300 rounded-md"
                >
                  이전
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  신청하기
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
