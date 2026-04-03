# K-LIMS 설치 및 설정 가이드

## 1. 사전 요구사항

- Node.js 18+ 설치
- PostgreSQL 14+ 설치
- npm 또는 yarn 패키지 매니저

## 2. 설치 단계

### 2.1 의존성 설치

```bash
cd D:\qwen_workspace\kolas_management
npm install
```

### 2.2 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 다음 내용을 수정합니다:

```bash
# .env.example 복사
copy .env.example .env
```

`.env` 파일 편집:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/k_lims?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**중요**: `DATABASE_URL` 의 `username` 과 `password` 를 실제 PostgreSQL 계정으로 변경하세요.

### 2.3 데이터베이스 생성

PostgreSQL 에서 데이터베이스를 생성합니다:

```sql
CREATE DATABASE k_lims;
```

### 2.4 Prisma 스키마 생성 및 데이터베이스 동기화

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스에 스키마 적용
npm run db:push
```

### 2.5 시드 데이터 입력 (선택사항)

테스트용 기본 데이터를 입력합니다:

```bash
# tsx 설치 (필요한 경우)
npm install -D tsx

# 시드 실행
npm run db:seed
```

시드 데이터에는 다음 계정이 포함됩니다:
- **관리자**: admin@k-lims.com / admin123
- **승인권자**: approver@k-lims.com / approver123
- **검토자**: reviewer@k-lims.com / reviewer123
- **시험원**: tester@k-lims.com / tester123
- **품질책임자**: qm@k-lims.com / qm123

### 2.6 개발 서버 시작

```bash
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속합니다.

## 3. 프로젝트 구조

```
kolas_management/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── dashboard/          # 대시보드 API
│   │   ├── samples/            # 시료 API
│   │   ├── equipment/          # 장비 API
│   │   └── audit-trail/        # 감사 추적 API
│   ├── dashboard/              # 대시보드 페이지
│   ├── samples/                # 시료 관리 페이지
│   ├── tests/                  # 시험 관리 페이지
│   ├── equipment/              # 장비 관리 페이지
│   ├── certificates/           # 성적서 관리 페이지
│   └── audit/                  # 감사 추적 페이지
├── lib/                        # 비즈니스 로직
│   ├── prisma.ts               # Prisma 클라이언트
│   ├── auth-service.ts         # 인증 서비스
│   ├── sample-service.ts       # 시료 관리 서비스
│   ├── test-service.ts         # 시험 관리 서비스
│   ├── equipment-service.ts    # 장비 관리 서비스
│   ├── certificate-service.ts  # 성적서 서비스
│   ├── crm-service.ts          # 표준물질 서비스
│   ├── audit-trail.ts          # 감사 추적 서비스
│   ├── dashboard-service.ts    # 대시보드 서비스
│   └── uncertainty-engine.ts   # 불확도 계산 엔진
├── prisma/
│   ├── schema.prisma           # 데이터베이스 스키마
│   └── seed.ts                 # 시드 데이터
├── components/                 # React 컴포넌트
├── public/                     # 정적 파일
└── package.json
```

## 4. 주요 기능 사용법

### 4.1 시료 관리

1. 메인 페이지에서 "시료 접수" 클릭
2. 시료 정보 입력 (시료명, 의뢰자, 보관 조건 등)
3. 등록 시 고유 식별 번호 (Sample ID) 와 바코드가 자동 생성됨
4. QR 코드도 자동 생성되어 출력 가능

### 4.2 시험 관리

1. 시료에 대해 시험 항목 등록
2. 시험원에게 작업 배정 (자격 기반)
3. Raw Data 입력 및 환경 조건 기록
4. 불확도 자동 계산

### 4.3 장비 관리

1. 장비 등록 (장비 번호, 모델, 제조사 등)
2. 교정 주기 설정
3. 교정 기한 임박 알림 확인
4. 유지보수 이력 기록

### 4.4 Audit Trail

1. "Audit Trail" 메뉴에서 모든 활동 이력 확인
2. 날짜 범위 지정하여 조회
3. CSV 로 내보내기 (심사 대응)

### 4.5 성적서 발행

1. 시험 완료된 건에 대해 성적서 생성
2. 템플릿 선택 및 내용 작성
3. 승인권자 전자 서명
4. 2D 바코드 및 워터마크 적용

## 5. KOLAS 17025 준수 사항

### ALCOA+ 원칙 구현

- **Attributable (귀속성)**: 모든 작업은 사용자 계정에 기록됨
- **Legible (가독성)**: 명확한 인터페이스 제공
- **Contemporaneous (동시성)**: 작업 시점에 즉시 저장
- **Original (원본성)**: 데이터 수정 시 원본 보존
- **Accurate (정확성)**: 검증 로직 및 자동 계산
- **+**: 완전성, 일관성, 영속성, 가용성

### Audit Trail

- 모든 생성, 수정, 삭제 작업 기록
- "누가, 언제, 무엇을, 왜" 변경했는지 추적
- 변경 사유 입력 필수 (일부 작업)

### 권한 관리

- **ADMIN**: 시스템 전체 관리
- **APPROVER**: 성적서 승인
- **REVIEWER**: 시험 데이터 검토
- **TESTER**: 시험 수행
- **QUALITY_MANAGER**: 품질 관리

## 6. 문제 해결

### 데이터베이스 연결 오류

`.env` 파일의 `DATABASE_URL` 을 확인하세요.

```
DATABASE_URL="postgresql://username:password@localhost:5432/k_lims?schema=public"
```

### Prisma 오류

```bash
npm run db:generate
npm run db:push
```

### 포트 사용 중

```bash
# 다른 포트 사용
npm run dev -- -p 3001
```

## 7. 프로덕션 배포

### 7.1 빌드

```bash
npm run build
```

### 7.2 시작

```bash
npm start
```

### 7.3 환경 변수 설정

프로덕션에서는 다음 환경 변수를 반드시 설정하세요:

- `DATABASE_URL`: 프로덕션 데이터베이스
- `NEXTAUTH_SECRET`: 안전한 무작위 문자열
- `NEXTAUTH_URL`: 실제 도메인

### 7.4 백업 정책

- 매일 자동 증분 백업 설정
- 원격지 백업 시스템 구축
- 데이터베이스 덤프:

```bash
pg_dump k_lims > backup_$(date +%Y%m%d).sql
```

## 8. 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 9. 지원

문제가 발생하거나 질문이 있으시면:
- README.md 의 프로젝트 개요 참조
- PRD.md.txt 의 요구사항 확인
