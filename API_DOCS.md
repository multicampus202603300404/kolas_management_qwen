# K-LIMS API 문서

## 개요

K-LIMS 의 API 엔드포인트 및 사용법입니다.

모든 API 는 Next.js API Routes 를 사용하여 구현되었습니다.

---

## 인증 API

### 사용자 인증

**POST** `/api/auth/login`

사용자 로그인

**Request**:
```json
{
  "email": "admin@k-lims.com",
  "password": "admin123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@k-lims.com",
    "name": "관리자",
    "role": "ADMIN"
  }
}
```

---

## 시료 관리 API

### 시료 목록 조회

**GET** `/api/samples`

**Query Parameters**:
- `status` (optional): 시료 상태 필터

**Response**:
```json
[
  {
    "id": "uuid",
    "sampleId": "S-202401-ABC123",
    "barcode": "ABC123XYZ",
    "name": "시료명",
    "status": "RECEIVED",
    "receivedAt": "2024-01-15T09:00:00Z",
    "clientName": "의뢰자"
  }
]
```

### 시료 생성

**POST** `/api/samples`

**Request**:
```json
{
  "name": "시료명",
  "description": "설명",
  "clientName": "의뢰자",
  "clientInfo": "의뢰자 정보",
  "storageCondition": "실온",
  "dueDate": "2024-02-15",
  "receivedBy": "user-uuid"
}
```

**Response**:
```json
{
  "id": "uuid",
  "sampleId": "S-202401-ABC123",
  "barcode": "ABC123XYZ",
  "qrCode": "data:image/png;base64,...",
  "name": "시료명",
  "status": "RECEIVED",
  "createdAt": "2024-01-15T09:00:00Z"
}
```

### 시료 상세 조회

**GET** `/api/samples/:id`

**Response**:
```json
{
  "id": "uuid",
  "sampleId": "S-202401-ABC123",
  "name": "시료명",
  "status": "IN_PROGRESS",
  "testRecords": [...],
  "auditTrails": [...]
}
```

### 시료 상태 변경

**PATCH** `/api/samples/:id/status`

**Request**:
```json
{
  "status": "ASSIGNED",
  "reason": "시험원 배정 완료"
}
```

---

## 시험 관리 API

### 시험 기록 생성

**POST** `/api/tests`

**Request**:
```json
{
  "sampleId": "sample-uuid",
  "testId": "TEST-001",
  "testName": "수분 함량",
  "method": "KS H 2001",
  "assignedTo": "user-uuid",
  "assignedBy": "user-uuid",
  "dueDate": "2024-02-15",
  "equipmentId": "equipment-uuid",
  "crmId": "crm-uuid"
}
```

### 시험 기록 조회

**GET** `/api/tests/:id`

**Response**:
```json
{
  "id": "uuid",
  "sampleId": "sample-uuid",
  "testName": "수분 함량",
  "status": "IN_PROGRESS",
  "rawData": { ... },
  "calculatedData": { ... },
  "environmentalConditions": {
    "temperature": 23.5,
    "humidity": 45
  },
  "uncertainty": 0.05,
  "uncertaintyFormula": "U = k × √(u_A² + u_B²)"
}
```

### 시험 데이터 업데이트

**PUT** `/api/tests/:id/data`

**Request**:
```json
{
  "rawData": { "value1": 12.3, "value2": 12.5 },
  "calculatedData": { "mean": 12.4 },
  "environmentalConditions": {
    "temperature": 23.5,
    "humidity": 45
  },
  "uncertainty": 0.05,
  "reason": "1 차 측정 완료"
}
```

### 시험 상태 변경

**PATCH** `/api/tests/:id/status`

**Request**:
```json
{
  "status": "REVIEW",
  "reason": "시험 완료, 검토 요청"
}
```

### 담당자별 시험 목록

**GET** `/api/tests/user/:userId`

**Response**:
```json
[
  {
    "id": "uuid",
    "testName": "수분 함량",
    "status": "IN_PROGRESS",
    "sample": {
      "sampleId": "S-202401-ABC123",
      "name": "시료명"
    },
    "dueDate": "2024-02-15"
  }
]
```

---

## 장비 관리 API

### 장비 목록 조회

**GET** `/api/equipment`

**Query Parameters**:
- `status` (optional): 장비 상태 필터

**Response**:
```json
[
  {
    "id": "uuid",
    "equipmentId": "EQ-001",
    "name": "HPLC",
    "model": "Agilent 1260",
    "status": "IDLE",
    "calibrationDue": "2024-12-31",
    "location": "분석실 1"
  }
]
```

### 장비 생성

**POST** `/api/equipment`

**Request**:
```json
{
  "equipmentId": "EQ-002",
  "name": "pH Meter",
  "model": "SevenCompact",
  "manufacturer": "Mettler Toledo",
  "location": "분석실 2",
  "calibrationCycle": 365
}
```

### 장비 상세 조회

**GET** `/api/equipment/:id`

**Response**:
```json
{
  "id": "uuid",
  "equipmentId": "EQ-001",
  "name": "HPLC",
  "status": "IDLE",
  "maintenanceLogs": [...],
  "testRecords": [...],
  "auditTrails": [...]
}
```

### 장비 상태 변경

**PATCH** `/api/equipment/:id/status`

**Request**:
```json
{
  "status": "CALIBRATION",
  "reason": "정기 교정"
}
```

### 유지보수 이력 생성

**POST** `/api/equipment/:id/maintenance`

**Request**:
```json
{
  "type": "교정",
  "description": "정기 교정 완료",
  "performedBy": "user-uuid",
  "nextDue": "2025-01-15",
  "cost": 500000
}
```

---

## 성적서 API

### 성적서 생성

**POST** `/api/certificates`

**Request**:
```json
{
  "testRecordIds": ["test-uuid-1", "test-uuid-2"],
  "templateId": "template-uuid"
}
```

### 성적서 조회

**GET** `/api/certificates/:certificateNo`

**Response**:
```json
{
  "id": "uuid",
  "certificateNo": "CERT-2024-ABC123",
  "status": "APPROVED",
  "content": "<html>...</html>",
  "issuedAt": "2024-01-20T10:00:00Z",
  "approver": {
    "name": "승인권자",
    "position": "기술팀장"
  }
}
```

### 성적서 승인

**POST** `/api/certificates/:id/approve`

**Request**:
```json
{
  "approvedBy": "user-uuid"
}
```

### 성적서 발행

**POST** `/api/certificates/:id/issue`

---

## 표준물질 (CRM) API

### CRM 목록 조회

**GET** `/api/crm`

**Response**:
```json
[
  {
    "id": "uuid",
    "crmId": "CRM-001",
    "name": "표준물질명",
    "lotNumber": "LOT123",
    "quantity": 100,
    "expiryDate": "2025-12-31"
  }
]
```

### CRM 생성

**POST** `/api/crm`

**Request**:
```json
{
  "crmId": "CRM-002",
  "name": "표준물질명",
  "lotNumber": "LOT456",
  "manufacturer": "제조사",
  "expiryDate": "2025-12-31",
  "quantity": 50,
  "unit": "g",
  "minQuantity": 10
}
```

### CRM 수량 변경

**PATCH** `/api/crm/:id/quantity`

**Request**:
```json
{
  "quantity": 45,
  "reason": "시험 사용"
}
```

---

## Audit Trail API

### 감사 추적 조회

**GET** `/api/audit-trail`

**Query Parameters**:
- `startDate`: 시작일 (YYYY-MM-DD)
- `endDate`: 종료일 (YYYY-MM-DD)
- `userId` (optional): 사용자 필터
- `action` (optional): 동작 필터
- `entityType` (optional): 엔티티 타입 필터

**Response**:
```json
[
  {
    "id": "uuid",
    "timestamp": "2024-01-15T09:00:00Z",
    "userId": "user-uuid",
    "action": "CREATE",
    "entityType": "Sample",
    "entityId": "sample-uuid",
    "changes": { ... },
    "reason": "시료 접수",
    "user": {
      "name": "관리자",
      "role": "ADMIN"
    }
  }
]
```

### 감사 추적 내보내기

**POST** `/api/audit-trail/export`

**Request**:
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Response**: CSV 파일 (다운로드)

---

## 대시보드 API

### 대시보드 통계

**GET** `/api/dashboard`

**Response**:
```json
{
  "samples": {
    "total": 150,
    "byStatus": {
      "RECEIVED": 10,
      "IN_PROGRESS": 25,
      "ISSUED": 100
    },
    "dueSoon": 5
  },
  "tests": {
    "total": 300,
    "byStatus": {
      "PENDING": 15,
      "IN_PROGRESS": 30,
      "COMPLETED": 200
    }
  },
  "equipment": {
    "total": 50,
    "dueForCalibration": 3
  },
  "certificates": {
    "total": 200,
    "byStatus": {
      "DRAFT": 5,
      "APPROVED": 150,
      "ISSUED": 45
    }
  },
  "quality": {
    "crmExpiringSoon": 2,
    "crmLowStock": 1,
    "openNonConformities": 3
  }
}
```

---

## 상태 코드

| 코드 | 설명 |
|------|------|
| 200 | 성공 |
| 201 | 생성됨 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 찾을 수 없음 |
| 500 | 서버 오류 |

---

## 에러 응답

```json
{
  "error": "에러 메시지"
}
```

---

## 보안 고려사항

1. 모든 API 요청은 인증 필요 (일부 공개 엔드포인트 제외)
2. 역할 기반 권한 확인
3. 민감한 데이터는 마스킹
4. Audit Trail 에 모든 접근 기록
