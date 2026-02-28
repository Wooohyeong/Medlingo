# MedDaily

오프라인 학습이 가능한 의학 문제 풀이 PWA입니다. iPhone/iPad에서 **홈 화면에 추가** 후 네트워크 없이 사용 가능합니다.

## 주요 기능
- PWA 설치(standalone), Service Worker 캐시 기반 오프라인 동작
- 번들 문항(앱 내부 포함) + 사용자 커스텀 문항 병합
- IndexedDB 로컬 저장
  - 진도(progress)
  - 일일 통계(daily)
  - 설정(settings)
  - 사용자 문항(customQuestions)
  - 학습 로그(studyLogs)
  - 오답노트(wrongNotes)
- 학습 모드
  - 오늘의 퀴즈(기본 10문항): due 우선 + 신규 보충
  - 오늘 복습: due 전용
- 가져오기/내보내기
  - 문항 JSON/CSV 가져오기
  - **전체 백업 JSON 내보내기 (학습내용/복습빈도/오답노트/설정/사용자문항 전체)**
  - **전체 백업 JSON 복원**

## 실행 방법
```bash
npm install
npm run dev
```
- 개발 서버: http://localhost:5173

빌드/미리보기:
```bash
npm run build
npm run preview
```
- 미리보기 서버: http://localhost:4173

## iOS에서 사용하는 방법 (PC 없이는 최초 배포 URL 필요)
### 권장: 1회 인터넷 배포 후 홈화면 설치
이 프로젝트는 정적 파일 앱이므로 다음 중 하나로 1회 배포하면 됩니다.
- Cloudflare Pages
- Netlify
- GitHub Pages

배포 후 iOS Safari에서:
1. 배포 URL 접속
2. 공유 버튼(□↑) 탭
3. "홈 화면에 추가"
4. 설치 후 오프라인 실행

## 전체 백업/복원 (단일 파일)
문항 관리 화면에서:
- **전체 백업 내보내기**: 아래를 단일 JSON으로 저장
  - settings
  - progress
  - daily
  - customQuestions
  - studyLogs(학습 이력)
  - wrongNotes(오답노트)
- **전체 복원(백업 JSON)**: 위 데이터를 한 번에 복구

## 문항 가져오기 형식
### JSON
- 배열 또는 `{ "questions": [...] }` 형태
- 각 문항 스키마는 `public/data/questions.sample.json` 참고

### CSV
헤더 예시:
```csv
id,subject,system,topic,difficulty,tags,stem,choiceA,choiceB,choiceC,choiceD,answer,explanation
```
- `tags`는 `|`로 구분 (`심장|약리`)

## 테스트
```bash
npm test
```
- scheduler/selection/io 핵심 로직 단위 테스트 포함
