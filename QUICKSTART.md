# K-LIMS Quick Start Guide

## 빠른 시작 (Windows)

### 1. PostgreSQL 설치 및 설정

PostgreSQL 을 설치하고 다음 명령으로 데이터베이스를 생성합니다:

```bash
# PostgreSQL 설치 후 psql 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE k_lims;
\q
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
copy .env.example .env

# .env 파일 편집 (메모장 등)
# DATABASE_URL 의 username, password 를 실제 값으로 변경
```

### 3. 설치 및 실행

```bash
# 의존성 설치
npm install

# Prisma 스키마 생성
npm run db:generate

# 데이터베이스 동기화
npm run db:push

# 시드 데이터 입력 (선택)
npm run db:seed

# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 4. 기본 계정

시드 데이터를 입력한 경우 다음 계정으로 로그인할 수 있습니다:

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | admin@k-lims.com | admin123 |
| 승인권자 | approver@k-lims.com | approver123 |
| 검토자 | reviewer@k-lims.com | reviewer123 |
| 시험원 | tester@k-lims.com | tester123 |
| 품질책임자 | qm@k-lims.com | qm123 |

## 주요 기능

1. **시료 관리**: 시료 접수 → 바코드/QR 생성 → 상태 추적
2. **시험 관리**: 작업 배정 → Raw Data 입력 → 불확도 계산
3. **장비 관리**: 장비 등록 → 교정 관리 → 유지보수 이력
4. **성적서**: 템플릿 관리 → 전자 서명 → 2D 바코드
5. **Audit Trail**: 전체 이력 추적 → CSV 내보내기

## 다음 단계

- SETUP.md: 상세 설치 가이드
- README.md: 프로젝트 개요 및 기능 설명
- PRD.md.txt: 요구사항 정의서
