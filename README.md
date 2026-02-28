# MedDaily

오프라인 학습이 가능한 의학 문제 풀이 PWA입니다. iPhone/iPad에서 **홈 화면에 추가** 후 네트워크 없이 사용 가능합니다.

## 주요 기능
- PWA 설치(standalone), Service Worker 캐시 기반 오프라인 동작
- 번들 문항 + 사용자 커스텀 문항 병합
- IndexedDB 로컬 저장(진도/일일 통계/설정/커스텀 문항)
- 학습 모드
  - 오늘의 퀴즈(기본 10문항): due 우선 + 신규 보충
  - 오늘 복습: due 전용
- 가져오기/내보내기
  - JSON/CSV 파일 가져오기
  - 진도+커스텀 문항 백업 JSON 내보내기
- 통계/설정 화면

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

## iOS 홈 화면 설치
1. Safari에서 앱 접속
2. 공유 버튼(□↑) 탭
3. "홈 화면에 추가" 선택
4. 설치 후 아이콘으로 실행

## 문항 가져오기 형식
### JSON
- 배열 또는 `{ "questions": [...] }` 형태
- 각 문항 스키마는 `public/data/questions.sample.json` 참고

### CSV
헤더 예시:
```csv
id,subject,system,topic,difficulty,grade,setId,setName,tags,stem,choiceA,choiceB,choiceC,choiceD,answer,explanation
```
- `tags`는 `|`로 구분 (`심장|약리`)

## 백업
문항 관리 > "백업 내보내기" 버튼으로 다음을 단일 JSON 파일로 저장:
- settings
- progress
- customQuestions
- daily

## 테스트
```bash
npm test
```
- scheduler/selection 핵심 로직 단위 테스트 포함
