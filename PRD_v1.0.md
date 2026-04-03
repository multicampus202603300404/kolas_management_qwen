# K-LIMS 제품 요구사항 정의서 (PRD)

**문서 버전:** v1.0  
**작성일:** 2024 년 1 월 30 일  
**프로젝트명:** K-LIMS (KOLAS-ready Laboratory Information Management System)

---

## 1. 제품 개요

### 1.1 제품명
**K-LIMS** (KOLAS-ready Laboratory Information Management System)

### 1.2 제품 비전
KOLAS 17025 기준을 준수하는 시험실 정보 관리 시스템으로, 시험 전 과정의 디지털화, 데이터 무결성 보장, 심사 대응 효율화를 실현합니다.

### 1.3 핵심 가치
- **추적성 (Traceability)**: 모든 시험 과정의 완전한 추적 가능성
- **신뢰성 (Reliability)**: 데이터 위변조 방지 및 무결성 보장
- **효율성 (Efficiency)**: 심사 준비 시간 70% 단축

### 1.4 목표 사용자
- 시험인증기관 연구원 및 관리자
- 품질보증 담당자
- KOLAS 심사 대응 담당자
- 시험 의뢰 고객

---

## 2. 전체 워크플로우

### 2.1 6 단계 워크플로우

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  1 단계  │───▶│  2 단계  │───▶│  3 단계  │───▶│  4 단계  │───▶│  5 단계  │───▶│  6 단계  │
│ 사전협의 │    │의뢰접수 │    │시험수행 │    │성적서발행│    │ 송장발행│    │ 입금처리 │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
   💬              📝              🔬              📄              💰              ✅
```

### 2.2 단계별 상세 설명

| 단계 | 상태명 | 설명 | 담당자 |
|------|--------|------|--------|
| 1 | CONSULTATION (협의중) | 고객과 시험 항목, 기간, 비용 협의 | 영업담당자 |
| 2 | REQUESTED (의뢰됨) | 시험의뢰서 작성 및 제출 | 고객 |
| 3 | RECEIVED (접수됨) | 시료 접수 및 바코드 발급 | 접수담당자 |
| 4 | IN_PROGRESS (시험중) | 시험 수행 및 Raw Data 기록 | 시험원 |
| 5 | COMPLETED (시험완료) | 시험 완료 및 데이터 검토 | 검토자 |
| 6 | CERTIFIED (성적서발행) | 성적서 발행 및 승인 | 승인권자 |
| 7 | INVOICED (청구됨) | 송장 발행 및 청구 | 관리담당자 |
| 8 | PAID (입금완료) | 입금 확인 및 건 마감 | 관리담당자 |

---

## 3. 기능 요구사항

### 3.1 고객 관리 (Customer Management)

#### 3.1.1 고객 정보 관리
- **CR-001**: 고객 기본 정보 등록 (성명, 회사명, 이메일, 전화번호, 주소)
- **CR-002**: 고객 담당자 정보 관리
- **CR-003**: 고객별 시험 이력 조회
- **CR-004**: 고객 정보 수정 및 삭제

#### 3.1.2 고객 데이터 항목
```
Customer {
  - id: String (고유 ID)
  - name: String (성명)
  - company: String (회사명)
  - email: String (이메일)
  - phone: String (전화번호)
  - address: String (주소)
  - contactPerson: String (담당자)
  - createdAt: DateTime (등록일)
  - updatedAt: DateTime (수정일)
}
```

### 3.2 시험의뢰 관리 (Test Request Management)

#### 3.2.1 시험의뢰 신청
- **TR-001**: 온라인 시험의뢰서 작성 (4 단계 위저드)
  - 단계 1: 고객 정보 입력
  - 단계 2: 시험 정보 입력 (유형, 항목, 목적, 기한)
  - 단계 3: 시료 정보 입력 (명칭, 수량, 상태)
  - 단계 4: 신청 내용 확인 및 제출
- **TR-002**: 의뢰번호 자동 부여 (형식: REQ-YYYY-NNN)
- **TR-003**: 의뢰 상태 실시간 추적

#### 3.2.2 시험의뢰 데이터 항목
```
TestRequest {
  - id: String (고유 ID)
  - requestId: String (의뢰번호)
  - customerId: String (고객 ID)
  - status: String (상태)
  - requestDate: DateTime (의뢰일)
  - testType: String (시험유형)
  - testItems: String (시험항목)
  - purpose: String (시험목적)
  - deadline: DateTime (희망완료일)
  - sampleName: String (시료명)
  - sampleQty: Int (시료수량)
  - sampleCondition: String (시료상태)
  - totalPrice: Float (총금액)
  - vat: Float (부가세)
  - discount: Float (할인)
  - finalPrice: Float (최종금액)
  - notes: String (비고)
}
```

### 3.3 시료 관리 (Sample Management)

#### 3.3.1 시료 등록 및 추적
- **SM-001**: 시료 접수 및 고유 식별번호 부여 (형식: S-YYYYMM-XXXXX)
- **SM-002**: 바코드/QR 코드 자동 생성 및 출력
- **SM-003**: 시료 상태 추적 (접수→배정→시험중→검토→승인→발행)
- **SM-004**: 시료 보관 조건 관리 (실온, 냉장, 냉동)
- **SM-005**: 시료 마감일 관리 및 알림

#### 3.3.2 시료 데이터 항목
```
Sample {
  - id: String (고유 ID)
  - sampleId: String (시료번호)
  - barcode: String (바코드)
  - qrCode: String (QR 코드)
  - name: String (시료명)
  - description: String (설명)
  - receivedAt: DateTime (접수일)
  - receivedBy: String (접수자)
  - clientName: String (의뢰자)
  - status: String (상태)
  - storageCondition: String (보관조건)
  - dueDate: DateTime (시험기한)
  - testRequestId: String (의뢰 ID)
}
```

### 3.4 시험 수행 관리 (Test Execution)

#### 3.4.1 시험 작업 배정
- **TE-001**: 시험원 자격 확인 및 작업 배정
- **TE-002**: 시험 일정 관리
- **TE-003**: 작업 진행 상황 실시간 업데이트

#### 3.4.2 시험 데이터 기록
- **TE-004**: Raw Data 입력 및 자동 저장
- **TE-005**: 환경 조건 기록 (온도, 습도)
- **TE-006**: 환경 기준 이탈 시 알림
- **TE-007**: 사진 및 첨부파일 등록

#### 3.4.3 시험 데이터 항목
```
TestRecord {
  - id: String (고유 ID)
  - sampleId: String (시료 ID)
  - testId: String (시험항목 ID)
  - testName: String (시험명)
  - method: String (시험방법)
  - status: String (상태)
  - rawData: String (원시데이터 - JSON)
  - calculatedData: String (계산데이터 - JSON)
  - environmentalConditions: String (환경조건 - JSON)
  - uncertainty: Float (측정불확도)
  - uncertaintyFormula: String (불확도계산식)
  - equipmentId: String (장비 ID)
  - startedAt: DateTime (시작일)
  - completedAt: DateTime (완료일)
  - reviewedAt: DateTime (검토일)
  - reviewedBy: String (검토자)
}
```

### 3.5 측정불확도 계산 (Uncertainty Calculation)

#### 3.5.1 불확도 계산 엔진
- **UC-001**: Type A 불확도 (통계적 평가) 자동 계산
- **UC-002**: Type B 불확도 (교정, 분해능) 자동 계산
- **UC-003**: 합성표준불확도 계산
- **UC-004**: 확장불확도 계산 (k=2, 95% 신뢰수준)
- **UC-005**: 사용자 정의 계산식 지원

#### 3.5.2 계산 공식
```
Type A: u_A = σ / √n
Type B (교정): u_B = U_cert / k_cert
Type B (분해능): u_B = resolution / (2√3)
합성불확도: u_c = √(u_A² + u_B²)
확장불확도: U = k × u_c (k=2)
```

### 3.6 성적서 관리 (Certificate Management)

#### 3.6.1 성적서 생성 및 발행
- **CM-001**: KOLAS 로고 및 인정마크 포함 템플릿 관리
- **CM-002**: 성적서 자동 생성 (시험결과 반영)
- **CM-003**: 전자서명 및 디지털 서명 적용
- **CM-004**: 위변조 방지 워터마크 적용
- **CM-005**: 2D 바코드 생성 (검증용)
- **CM-006**: 성적서 번호 자동 부여 (형식: CERT-YYYY-XXXXX)

#### 3.6.2 성적서 데이터 항목
```
Certificate {
  - id: String (고유 ID)
  - certificateNo: String (성적서번호)
  - testRequestId: String (의뢰 ID)
  - templateId: String (템플릿 ID)
  - status: String (상태)
  - content: String (성적서내용 - HTML)
  - digitalSignature: String (전자서명)
  - watermark: Boolean (워터마크)
  - qrCode: String (QR 코드)
  - issuedAt: DateTime (발행일)
  - approvedAt: DateTime (승인일)
  - approvedBy: String (승인권자)
}
```

### 3.7 송장 및 수수료 관리 (Invoice & Payment)

#### 3.7.1 송장 발행
- **IP-001**: 시험 완료 후 송장 자동 생성
- **IP-002**: 송장 번호 자동 부여 (형식: INV-YYYY-NNN)
- **IP-003**: 부가가치세 자동 계산
- **IP-004**: 할인 및 할인율 적용
- **IP-005**: 납부기한 설정 및 관리

#### 3.7.2 입금 처리
- **IP-006**: 부분입금 지원
- **IP-007**: 입금일 및 입금방법 기록
- **IP-008**: 연체 관리 및 알림
- **IP-009**: 입금 완료 시 건 마감

#### 3.7.3 송장 데이터 항목
```
Invoice {
  - id: String (고유 ID)
  - invoiceNo: String (송장번호)
  - testRequestId: String (의뢰 ID)
  - customerId: String (고객 ID)
  - issueDate: DateTime (발행일)
  - dueDate: DateTime (납부기한)
  - status: String (상태: UNPAID/PARTIAL/PAID/OVERDUE)
  - subtotal: Float (세전금액)
  - vat: Float (부가세)
  - discount: Float (할인)
  - total: Float (총금액)
  - paidAmount: Float (입금금액)
  - paymentDate: DateTime (입금일)
  - paymentMethod: String (입금방법)
}
```

### 3.8 장비 관리 (Equipment Management)

#### 3.8.1 장비 등록 및 상태 관리
- **EM-001**: 장비 기본 정보 등록 (번호, 명, 모델, 제조사)
- **EM-002**: 장비 상태 관리 (RUN/IDLE/DOWN/CALIBRATION/RETIRED)
- **EM-003**: 장비 위치 관리

#### 3.8.2 교정 및 유지보수
- **EM-004**: 교정 주기 설정 및 관리
- **EM-005**: 교정 기한 임박 알림 (30 일 전)
- **EM-006**: 유지보수 이력 기록
- **EM-007**: 교정 비용 관리

#### 3.8.3 장비 데이터 항목
```
Equipment {
  - id: String (고유 ID)
  - equipmentId: String (장비번호)
  - name: String (장비명)
  - model: String (모델)
  - manufacturer: String (제조사)
  - serialNumber: String (일련번호)
  - status: String (상태)
  - location: String (위치)
  - calibrationDue: DateTime (교정기한)
  - calibrationCycle: Int (교정주기 - 일)
  - lastCalibration: DateTime (마지막교정)
}
```

### 3.9 Audit Trail (감사 추적)

#### 3.9.1 ALCOA+ 원칙 준수
- **AT-001**: 모든 데이터 생성/수정/삭제 기록
- **AT-002**: 사용자, 타임스탬프, 변경내용, 사유 기록
- **AT-003**: 원본 데이터 보존 (수정 시 이력 관리)
- **AT-004**: 날짜 범위별 조회 및 내보내기
- **AT-005**: CSV/PDF 형식 지원

#### 3.9.2 Audit Trail 데이터 항목
```
AuditTrail {
  - id: String (고유 ID)
  - timestamp: DateTime (일시)
  - userId: String (사용자 ID)
  - action: String (동작: CREATE/READ/UPDATE/DELETE/APPROVE/REJECT)
  - entityType: String (엔티티타입)
  - entityId: String (엔티티 ID)
  - changes: String (변경내용 - JSON)
  - reason: String (변경사유)
  - ipAddress: String (IP 주소)
}
```

### 3.10 권한 관리 (Access Control)

#### 3.10.1 역할 기반 접근 제어 (RBAC)
- **AC-001**: 5 가지 역할 정의
  - ADMIN: 시스템 전체 관리
  - APPROVER: 성적서 승인
  - REVIEWER: 시험 데이터 검토
  - TESTER: 시험 수행
  - QUALITY_MANAGER: 품질 관리
- **AC-002**: 역할별 데이터 접근 권한 설정
- **AC-003**: 사용자 계정 관리 (활성/비활성/정지)

---

## 4. 기술 요구사항

### 4.1 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| **Frontend** | Next.js | 14.x |
| | React | 18.x |
| | TypeScript | 5.x |
| | Tailwind CSS | 3.x |
| **Backend** | Next.js API Routes | - |
| **Database** | SQLite (개발) / PostgreSQL (프로덕션) | - |
| **ORM** | Prisma | 5.x |
| **Security** | bcryptjs | 2.x |

### 4.2 데이터 무결성 (ALCOA+ 원칙)

- **Attributable (귀속성)**: 모든 작업은 사용자 계정에 기록됨
- **Legible (가독성)**: 명확한 인터페이스 및 표준화된 형식
- **Contemporaneous (동시성)**: 작업 시점에 즉시 저장
- **Original (원본성)**: 데이터 수정 시 원본 보존
- **Accurate (정확성)**: 자동 계산 및 검증 로직
- **Complete (완전성)**: 모든 데이터 포함
- **Consistent (일관성)**: 일관된 형식 및 프로세스
- **Enduring (영속성)**: 영구 보관
- **Available (가용성)**: 필요 시 즉시 접근 가능

### 4.3 보안 요구사항

- **SEC-001**: 비밀번호 해싱 저장 (bcrypt, salt rounds=10)
- **SEC-002**: 역할 기반 접근 제어
- **SEC-003**: Audit Trail 기록
- **SEC-004**: 세션 관리
- **SEC-005**: 데이터 백업 (매일 자동 증분 백업)

### 4.4 성능 요구사항

- **PERF-001**: 페이지 로딩 시간 3 초 이내
- **PERF-002**: 동시 사용자 50 명 지원
- **PERF-003**: 대시보드 실시간 업데이트
- **PERF-004**: 대량 데이터 조회分页 (pagination)

---

## 5. 사용자 인터페이스

### 5.1 주요 화면 구성

#### 5.1.1 메인 페이지 (`/`)
- K-LIMS 소개 및 워크플로우 개요
- 6 단계 워크플로우 시각적 표현
- 주요 메뉴 네비게이션

#### 5.1.2 워크플로우 관리 (`/workflow`)
- 전체 의뢰 건 상태별 조회
- 상태 필터 (협의중, 의뢰됨, 접수됨, 시험중, 완료, 청구됨, 입금완료)
- 의뢰별 상세 정보 및 진행 상황
- 실시간 통계 (협의중, 시험중, 청구대기, 매출)

#### 5.1.3 고객 관리 (`/customers`)
- 고객 목록 조회
- 고객 정보 등록/수정/삭제
- 고객별 시험 이력 조회

#### 5.1.4 시험의뢰 신청 (`/request`)
- 4 단계 위저드 형식
  - 단계 1: 고객 정보
  - 단계 2: 시험 정보
  - 단계 3: 시료 정보
  - 단계 4: 확인
- 임시 저장 및 초안 기능

#### 5.1.5 송장 관리 (`/invoice`)
- 송장 목록 조회
- 송장 상태별 필터 (미입금, 부분입금, 입금완료, 연체)
- 입금 처리 모달
- 미수금 현황

#### 5.1.6 대시보드 (`/dashboard`)
- 실시간 통계 (시료, 시험, 장비, 성적서)
- 품질 관리 알림 (CRM 만료, 재고 부족, 부적합)
- 최근 시료 목록

### 5.2 반응형 디자인
- 데스크톱 (1280px 이상)
- 태블릿 (768px ~ 1279px)
- 모바일 (767px 이하)

---

## 6. 데이터베이스 스키마

### 6.1 엔티티 관계도

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  Customer   │──────<│ TestRequest  │>──────│   Sample    │
└─────────────┘   1:N └──────────────┘  1:N  └─────────────┘
      │                                       │
      │ 1:N                                   │ 1:N
      │                                       │
      ▼                                       ▼
┌─────────────┐                         ┌──────────────┐
│   Invoice   │                         │  TestRecord  │
└─────────────┘                         └──────────────┘
                                               │
                                               │ N:1
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Equipment  │
                                        └─────────────┘
```

### 6.2 주요 테이블

| 테이블명 | 설명 | 주요 필드 |
|----------|------|-----------|
| Customer | 고객 정보 | id, name, company, email, phone |
| TestRequest | 시험 의뢰 | id, requestId, customerId, status, testType |
| Sample | 시료 | id, sampleId, barcode, status, testRequestId |
| TestRecord | 시험 기록 | id, sampleId, testName, rawData, status |
| Certificate | 성적서 | id, certificateNo, status, content |
| Invoice | 송장 | id, invoiceNo, testRequestId, total, status |
| Equipment | 장비 | id, equipmentId, name, calibrationDue |
| AuditTrail | 감사추적 | id, timestamp, userId, action, entityType |
| User | 사용자 | id, email, password, role, status |

---

## 7. 구현 현황

### 7.1 완료된 기능 (Phase 1)

| 기능 | 상태 | 완료일 |
|------|------|--------|
| 프로젝트 설정 | ✅ 완료 | 2024-01-30 |
| 데이터베이스 스키마 | ✅ 완료 | 2024-01-30 |
| 고객 관리 페이지 | ✅ 완료 | 2024-01-30 |
| 시험의뢰 신청 (4 단계) | ✅ 완료 | 2024-01-30 |
| 워크플로우 관리 | ✅ 완료 | 2024-01-30 |
| 송장 관리 | ✅ 완료 | 2024-01-30 |
| 메인 페이지 (워크플로우 소개) | ✅ 완료 | 2024-01-30 |

### 7.2 진행 중인 기능 (Phase 2)

| 기능 | 상태 | 예상완료일 |
|------|------|------------|
| 시료 관리 (바코드/QR) | 🔄 개발중 | 2024-02-07 |
| 시험 수행 및 데이터 기록 | 🔄 개발중 | 2024-02-14 |
| 측정불확도 계산 엔진 | 🔄 개발중 | 2024-02-14 |
| 성적서 생성 및 발행 | 🔄 개발중 | 2024-02-21 |
| Audit Trail 구현 | 🔄 개발중 | 2024-02-21 |

### 7.3 예정된 기능 (Phase 3)

| 기능 | 상태 | 예상완료일 |
|------|------|------------|
| 장비 관리 및 교정 알림 | 📅 계획 | 2024-02-28 |
| CRM (표준물질) 관리 | 📅 계획 | 2024-03-07 |
| 품질 관리 (부적합) | 📅 계획 | 2024-03-14 |
| KOLAS 심사 대응 모드 | 📅 계획 | 2024-03-21 |
| PDF 내보내기 | 📅 계획 | 2024-03-28 |

---

## 8. 프로젝트 구조

```
kolas_management/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   ├── customers/                # 고객 관리
│   ├── request/                  # 시험의뢰 신청
│   ├── workflow/                 # 워크플로우 관리
│   ├── invoice/                  # 송장 관리
│   ├── samples/                  # 시료 관리
│   ├── dashboard/                # 대시보드
│   └── page.tsx                  # 메인 페이지
├── lib/                          # 비즈니스 로직
│   ├── prisma.ts                 # Prisma 클라이언트
│   ├── auth-service.ts           # 인증 서비스
│   ├── sample-service.ts         # 시료 서비스
│   ├── test-service.ts           # 시험 서비스
│   ├── equipment-service.ts      # 장비 서비스
│   ├── certificate-service.ts    # 성적서 서비스
│   ├── crm-service.ts            # 표준물질 서비스
│   ├── audit-trail.ts            # 감사 추적
│   ├── dashboard-service.ts      # 대시보드
│   └── uncertainty-engine.ts     # 불확도 계산
├── prisma/
│   ├── schema.prisma             # 데이터베이스 스키마
│   ├── seed.ts                   # 시드 데이터
│   └── dev.db                    # SQLite 데이터베이스
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── README.md
├── SETUP.md
└── PRD_v1.0.md                   # 본 문서
```

---

## 9. 설치 및 실행

### 9.1 개발 환경 설정

```bash
# 1. 의존성 설치
npm install

# 2. Prisma 스키마 생성
npm run db:generate

# 3. 데이터베이스 초기화
npm run db:push

# 4. 시드 데이터 입력
npm run db:seed

# 5. 개발 서버 시작
npm run dev
```

### 9.2 접속 URL
- **로컬**: http://localhost:3000

### 9.3 기본 계정 (시드 데이터)

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin@k-lims.com | admin123 |
| 승인권자 | approver@k-lims.com | approver123 |
| 검토자 | reviewer@k-lims.com | reviewer123 |
| 시험원 | tester@k-lims.com | tester123 |
| 품질책임자 | qm@k-lims.com | qm123 |

---

## 10. 기대 효과

### 10.1 정량적 효과
- **심사 준비 시간 70% 단축**: 수기 기록 대조 및 서류 정리 시간 감소
- **데이터 오류 90% 감소**: 자동화 및 검증 로직 적용
- **성적서 발행 시간 50% 단축**: 템플릿 및 자동 생성
- **입금 처리 시간 60% 단축**: 자동 청구 및 입금 관리

### 10.2 정성적 효과
- **데이터 신뢰도 향상**: 인적 오류 제거 및 무결성 보장
- **고객 만족도 증대**: 빠른 성적서 발행 및 온라인 조회
- **심사 대응 용이**: Audit Trail 및 원클릭 증빙 자료 생성
- **업무 효율성 향상**: 자동화 및 실시간 현황 파악

---

## 11. 로드맵

### Phase 1: 기반 구축 (1-3 개월) ✅
- [x] 프로젝트 설정
- [x] 데이터베이스 스키마 설계
- [x] 고객/의뢰/워크플로우/송장 관리 구현
- [ ] 시료/시험/성적서 관리 구현

### Phase 2: 품질 고도화 (4-6 개월)
- [ ] 측정불확도 계산 엔진 완성
- [ ] 장비 인터페이스 연동 (RS232/TCP-IP)
- [ ] 환경 조건 자동 기록
- [ ] Audit Trail 완성

### Phase 3: 심사 자동화 (7 개월 이후)
- [ ] 내부 심사 관리
- [ ] 숙련도 시험 기록 관리
- [ ] KOLAS 갱신 심사 '원클릭 증빙 자료 생성'
- [ ] PDF 성적서 자동 생성

---

## 12. 부록

### 12.1 용어 정의

| 용어 | 정의 |
|------|------|
| KOLAS | 한국인정기구 (Korea Laboratory Accreditation Scheme) |
| LIMS | 시험실 정보 관리 시스템 (Laboratory Information Management System) |
| ALCOA+ | 데이터 무결성 원칙 (Attributable, Legible, Contemporaneous, Original, Accurate +) |
| Audit Trail | 감사 추적 (데이터 이력 기록) |
| CRM | 표준물질 (Certified Reference Material) |
| 불확도 | 측정결과에 수반되는 의심도의 정량적 표시 |

### 12.2 참조 문서
- ISO/IEC 17025:2017 (시험·교정기관 능력에 대한 일반적 요구사항)
- KOLAS 인정기준
- ALCOA+ 데이터 무결성 가이드라인

### 12.3 연락처
- **프로젝트 담당자**: [담당자명]
- **이메일**: [이메일]
- **문서 버전**: v1.0
- **최종 업데이트**: 2024-01-30

---

**문서 끝**
