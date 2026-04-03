# K-LIMS (KOLAS-ready Laboratory Information Management System)

KOLAS 17025 기준을 준수하는 시험실 정보 관리 시스템 (LIMS)

## 주요 기능

### 1. 시험 접수 및 워크플로우 관리
- 시료 입고 시 고유 식별 번호 자동 부여 및 바코드/QR 코드 출력
- 접수 → 배정 → 시험 중 → 검토 → 승인 → 발행 전 과정 실시간 모니터링
- 시험원별 자격 확인을 통한 적격 업무 배정

### 2. KOLAS 17025 특화 데이터 관리
- 환경 조건 (온·습도 등) 기록 및 기준 이탈 알림
- 측정불확도 (Uncertainty) 자동 계산
- 장비 연동을 통한 데이터 자동 수집

### 3. 품질 시스템 및 문서 관리
- Audit Trail (감사 추적) - ALCOA+ 원칙 준수
- 장비 관리 (교정 주기 알림, 이력 카드)
- 표준물질 (CRM) 관리 (유효기간, 재고)

### 4. 성적서 발행 및 보안
- KOLAS 로고 및 인정 마크 포함 템플릿
- 전자 서명 및 위변조 방지 워터마크/2D 바코드
- 권한별 데이터 접근 제어

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: bcryptjs

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
# .env 파일 복사
cp .env.example .env

# 데이터베이스 URL 수정
DATABASE_URL="postgresql://username:password@localhost:5432/k_lims?schema=public"
```

### 3. 데이터베이스 설정

```bash
# Prisma 스키마 생성
npx prisma generate

# 데이터베이스 푸시 (테이블 생성)
npx prisma db push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인 가능

## 프로젝트 구조

```
kolas_management/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   ├── dashboard/            # 대시보드 페이지
│   ├── samples/              # 시료 관리
│   ├── tests/                # 시험 관리
│   ├── equipment/            # 장비 관리
│   └── certificates/         # 성적서 관리
├── lib/                      # 비즈니스 로직
│   ├── prisma.ts             # Prisma 클라이언트
│   ├── auth-service.ts       # 인증 서비스
│   ├── sample-service.ts     # 시료 서비스
│   ├── test-service.ts       # 시험 서비스
│   ├── equipment-service.ts  # 장비 서비스
│   ├── certificate-service.ts # 성적서 서비스
│   ├── crm-service.ts        # 표준물질 서비스
│   ├── audit-trail.ts        # 감사 추적
│   ├── dashboard-service.ts  # 대시보드
│   └── uncertainty-engine.ts # 불확도 계산 엔진
├── prisma/
│   └── schema.prisma         # 데이터베이스 스키마
└── components/               # 재사용 가능 컴포넌트
```

## 데이터베이스 스키마

### 주요 엔티티

- **User**: 사용자 (시험원, 검토자, 승인권자, 관리자)
- **Sample**: 시료 (고유 식별번호, 바코드, QR 코드)
- **Equipment**: 장비 (교정 주기, 상태)
- **TestRecord**: 시험 기록 (Raw Data, 불확도)
- **Certificate**: 성적서 (전자 서명, 워터마크)
- **CRM**: 표준물질 (유효기간, 재고)
- **AuditTrail**: 감사 추적 (ALCOA+ 준수)
- **MaintenanceLog**: 장비 유지보수 이력

## KOLAS 17025 준수 사항

### ALCOA+ 원칙

- **A**ttributable (귀속성): 누가 생성/수정했는지 기록
- **L**egible (가독성): 명확하고 읽기 쉬운 기록
- **C**ontemporaneous (동시성): 작업 수행 시점에 즉시 기록
- **O**riginal (원본성): 원본 데이터 보존
- **A**ccurate (정확성): 정확한 데이터 기록
- **+**: 완전성, 일관성, 영속성, 가용성

### Audit Trail

모든 데이터의 생성, 수정, 삭제 이력을 다음 정보와 함께 영구 기록:
- 누가 (Who)
- 언제 (When)
- 무엇을 (What)
- 왜 (Why)

## 로드맵

### Phase 1: 기반 구축 (1-3 개월)
- [x] 장비/시료 마스터 정보 구축
- [x] 기본 워크플로우 (접수~발행) 세팅
- [x] 표준 성적서 템플릿 디지털화

### Phase 2: 품질 고도화 (4-6 개월)
- [x] 측정불확도 계산 엔진 탑재
- [ ] 장비 인터페이스 (RS232/TCP-IP) 연동

### Phase 3: 심사 자동화 (7 개월 이후)
- [ ] 내부 심사 및 숙련도 시험 기록 관리
- [ ] KOLAS 갱신 심사를 위한 '원클릭 증빙 자료 생성'

## 기대 효과

- 심사 준비 시간 70% 단축
- 데이터 신뢰도 향상 (인적 오류 제거)
- 고객 만족도 증대 (성적서 발행 리드타임 단축)

## 라이선스

MIT
