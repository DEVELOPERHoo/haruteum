haruteum/
├── app/
│   ├── _layout.tsx          ← 루트 레이아웃 (탭바 설정)
│   ├── index.tsx            ← 진입점 (로그인 체크 후 리다이렉트)
│   └── (tabs)/
│       ├── _layout.tsx      ← 하단 탭바 정의
│       ├── diary.tsx        ← 오늘의 다이어리 (메인)
│       ├── history.tsx      ← 히스토리
│       └── settings.tsx     ← 설정
│
├── components/
│   └── diary/
│       ├── DateHeader.tsx   ← 날짜 표시 컴포넌트
│       ├── TextInput.tsx    ← 글쓰기 입력창
│       ├── PhotoCard.tsx    ← 사진 업로드 카드
│       ├── EmojiPicker.tsx  ← 감정 이모지 선택
│       └── SubmitButton.tsx ← 우리 하루 남기기 버튼
│
├── hooks/
│   └── useDiary.ts          ← 다이어리 상태 & 저장 로직
│
├── store/
│   └── diaryStore.ts        ← Zustand 전역 상태
│
├── services/
│   └── diaryService.ts      ← API 호출 (저장, 불러오기)
│
├── constants/
│   └── emotions.ts          ← 감정 이모지 목록 정의
│
└── utils/
    └── dateFormat.ts        ← 날짜 포맷 (2026.05.19 화요일)

backend : http://172.17.22.215:3000/swagger
