haruteum/
├── app/
│ ├── \_layout.tsx ← 루트 레이아웃 (탭바 설정)
│ ├── index.tsx ← 진입점 (로그인 체크 후 리다이렉트)
│ └── (tabs)/
│ ├── \_layout.tsx ← 하단 탭바 정의
│ ├── diary.tsx ← 오늘의 다이어리 (메인)
│ ├── history.tsx ← 히스토리
│ └── settings.tsx ← 설정
│
├── components/
│ └── diary/
│ ├── DateHeader.tsx ← 날짜 표시 컴포넌트
│ ├── TextInput.tsx ← 글쓰기 입력창
│ ├── PhotoCard.tsx ← 사진 업로드 카드
│ ├── EmojiPicker.tsx ← 감정 이모지 선택
│ └── SubmitButton.tsx ← 우리 하루 남기기 버튼
│
├── hooks/
│ └── useDiary.ts ← 다이어리 상태 & 저장 로직
│
├── store/
│ └── diaryStore.ts ← Zustand 전역 상태
│
├── services/
│ └── diaryService.ts ← API 호출 (저장, 불러오기)
│
├── constants/
│ └── emotions.ts ← 감정 이모지 목록 정의
│
└── utils/
└── dateFormat.ts ← 날짜 포맷 (2026.05.19 화요일)

---

방향성 변경
haruteum/
├── app/
│ ├── \_layout.tsx ← 루트 레이아웃
│ ├── index.tsx ← 스플래시 (로그인 체크)
│ ├── login.tsx ← 로그인/회원가입 로그인토큰 -> secureStore 저장(기기내부 저장소)
│ ├── home.tsx ← 모드 선택 화면 (나혼자/함께)
│ ├── diary-result.tsx ← AI 결과 화면 (공통)
│ │
│ ├── (solo)/ ← 나혼자 다이어리
│ │ ├── \_layout.tsx ← 나혼자 탭바
│ │ ├── diary.tsx ← 오늘 기록
│ │ ├── history.tsx ← 내 기록 모아보기
│ │ └── settings.tsx ← 설정
│ │
│ └── (together)/ ← 함께 다이어리
│ ├── \_layout.tsx ← 함께 탭바
│ ├── diary.tsx ← 오늘 기록
│ ├── partner.tsx ← 상대방 기록 보기
│ ├── history.tsx ← 함께한 기록 모아보기
│ └── settings.tsx ← 설정 (커플코드/친구코드)
│
├── components/
│ ├── common/ ← 공통 컴포넌트
│ │ ├── ModeSelectCard.tsx ← 나혼자/함께 선택 카드
│ │ └── AiResultCard.tsx ← AI 결과 카드 (공통)
│ │
│ ├── diary/ ← 다이어리 작성 (공통)
│ │ ├── DateHeader.tsx ← 날짜 표시
│ │ ├── TextInput.tsx ← 글쓰기 입력창
│ │ ├── PhotoCard.tsx ← 사진 업로드
│ │ ├── EmojiPicker.tsx ← 감정 이모지 선택
│ │ └── SubmitButton.tsx ← 기록하기 버튼
│ │
│ └── result/ ← AI 결과 컴포넌트
│ ├── SoloSummary.tsx ← 나혼자 AI 요약
│ ├── TogetherSummary.tsx ← 함께 AI 케미 분석
│ ├── EmotionScore.tsx ← 감정 점수
│ └── AiMessage.tsx ← AI 한마디
│
├── hooks/
│ ├── useDiary.ts ← 다이어리 작성 로직 (공통)
│ ├── useSoloDiary.ts ← 나혼자 전용 로직
│ └── useTogetherDiary.ts ← 함께 전용 로직
│
├── store/
│ ├── authStore.ts ← 로그인 상태
│ ├── diaryStore.ts ← 다이어리 상태
│ └── modeStore.ts ← 나혼자/함께 모드 상태
│
├── services/
│ ├── authService.ts ← 로그인/회원가입
│ ├── diaryService.ts ← 다이어리 저장/불러오기
│ └── aiService.ts ← Claude API 호출
│
├── constants/
│ ├── emotions.ts ← 감정 이모지 목록
│ └── modes.ts ← 나혼자/함께 모드 상수
│
└── utils/
├── dateFormat.ts ← 날짜 포맷
└── aiPrompt.ts ← AI 프롬프트 템플릿

backend : http://172.17.22.116:3000/swagger
