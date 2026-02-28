import type { Question } from '../core/types.js';

export const sampleQuestions: Question[] = [
  {
    "id": "Q1",
    "type": "single",
    "subject": "내과",
    "system": "심장",
    "topic": "심부전",
    "difficulty": 2,
    "tags": [
      "BNP",
      "진단"
    ],
    "stem": "심부전 악화에서 흔히 상승하는 혈액 표지자는?",
    "choices": [
      {
        "key": "A",
        "text": "Troponin I"
      },
      {
        "key": "B",
        "text": "BNP"
      },
      {
        "key": "C",
        "text": "D-dimer"
      },
      {
        "key": "D",
        "text": "CRP"
      }
    ],
    "answer": "B",
    "explanation": "BNP는 심실 벽 스트레스 증가 시 상승합니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q2",
    "type": "single",
    "subject": "내과",
    "system": "호흡",
    "topic": "천식",
    "difficulty": 2,
    "tags": [
      "치료"
    ],
    "stem": "급성 천식 악화 초기 치료로 가장 우선되는 것은?",
    "choices": [
      {
        "key": "A",
        "text": "흡입 SABA"
      },
      {
        "key": "B",
        "text": "항생제"
      },
      {
        "key": "C",
        "text": "항히스타민"
      },
      {
        "key": "D",
        "text": "진해제"
      }
    ],
    "answer": "A",
    "explanation": "급성 천식은 빠른 기관지 확장(SABA)이 우선입니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q3",
    "type": "single",
    "subject": "내과",
    "system": "내분비",
    "topic": "당뇨",
    "difficulty": 1,
    "tags": [
      "진단"
    ],
    "stem": "당뇨병 진단 기준 중 하나는?",
    "choices": [
      {
        "key": "A",
        "text": "공복혈당 110 mg/dL 이상"
      },
      {
        "key": "B",
        "text": "공복혈당 126 mg/dL 이상"
      },
      {
        "key": "C",
        "text": "식후혈당 160 mg/dL 이상"
      },
      {
        "key": "D",
        "text": "Hb 10 이하"
      }
    ],
    "answer": "B",
    "explanation": "공복혈당 126 이상은 진단 기준입니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q4",
    "type": "single",
    "subject": "외과",
    "system": "복부",
    "topic": "충수염",
    "difficulty": 2,
    "tags": [
      "진찰"
    ],
    "stem": "급성 충수염에서 흔한 통증 이동은?",
    "choices": [
      {
        "key": "A",
        "text": "우하복부→명치"
      },
      {
        "key": "B",
        "text": "명치/배꼽주위→우하복부"
      },
      {
        "key": "C",
        "text": "좌하복부→우상복부"
      },
      {
        "key": "D",
        "text": "우상복부→등"
      }
    ],
    "answer": "B",
    "explanation": "초기 내장통 후 우하복부 국소통으로 이동합니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q5",
    "type": "single",
    "subject": "소아과",
    "system": "감염",
    "topic": "예방접종",
    "difficulty": 2,
    "tags": [
      "백신"
    ],
    "stem": "MMR 백신이 예방하는 질환 조합은?",
    "choices": [
      {
        "key": "A",
        "text": "홍역-유행성이하선염-풍진"
      },
      {
        "key": "B",
        "text": "수두-풍진-파상풍"
      },
      {
        "key": "C",
        "text": "A형간염-B형간염-홍역"
      },
      {
        "key": "D",
        "text": "디프테리아-파상풍-백일해"
      }
    ],
    "answer": "A",
    "explanation": "MMR은 measles, mumps, rubella입니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q6",
    "type": "single",
    "subject": "내과",
    "system": "신장",
    "topic": "AKI",
    "difficulty": 3,
    "tags": [
      "진단"
    ],
    "stem": "AKI에서 prerenal 원인을 시사하는 것은?",
    "choices": [
      {
        "key": "A",
        "text": "FENa >2%"
      },
      {
        "key": "B",
        "text": "FENa <1%"
      },
      {
        "key": "C",
        "text": "요중 Na 80"
      },
      {
        "key": "D",
        "text": "BUN/Cr <10"
      }
    ],
    "answer": "B",
    "explanation": "Prerenal은 나트륨 재흡수 증가로 FENa가 낮습니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q7",
    "type": "single",
    "subject": "응급",
    "system": "중독",
    "topic": "아세트아미노펜",
    "difficulty": 2,
    "tags": [
      "해독제"
    ],
    "stem": "Acetaminophen 과량 복용의 해독제는?",
    "choices": [
      {
        "key": "A",
        "text": "Naloxone"
      },
      {
        "key": "B",
        "text": "Flumazenil"
      },
      {
        "key": "C",
        "text": "N-acetylcysteine"
      },
      {
        "key": "D",
        "text": "Atropine"
      }
    ],
    "answer": "C",
    "explanation": "NAC가 표준 해독제입니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q8",
    "type": "single",
    "subject": "산부인과",
    "system": "임신",
    "topic": "전자간증",
    "difficulty": 3,
    "tags": [
      "고혈압"
    ],
    "stem": "전자간증 정의에 포함되는 소견은?",
    "choices": [
      {
        "key": "A",
        "text": "20주 이전 고혈압"
      },
      {
        "key": "B",
        "text": "20주 이후 고혈압 + 단백뇨/장기손상"
      },
      {
        "key": "C",
        "text": "무증상 저혈압"
      },
      {
        "key": "D",
        "text": "산후 1년 고혈압만"
      }
    ],
    "answer": "B",
    "explanation": "전자간증은 임신 20주 이후 발생이 핵심입니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q9",
    "type": "single",
    "subject": "신경과",
    "system": "뇌혈관",
    "topic": "뇌졸중",
    "difficulty": 3,
    "tags": [
      "응급"
    ],
    "stem": "허혈성 뇌졸중에서 tPA 고려 전 반드시 확인할 것은?",
    "choices": [
      {
        "key": "A",
        "text": "복부 CT"
      },
      {
        "key": "B",
        "text": "흉부 X-ray"
      },
      {
        "key": "C",
        "text": "뇌출혈 배제를 위한 뇌영상"
      },
      {
        "key": "D",
        "text": "심초음파"
      }
    ],
    "answer": "C",
    "explanation": "출혈성 병변 배제가 선행되어야 합니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q10",
    "type": "single",
    "subject": "정형외과",
    "system": "외상",
    "topic": "골절",
    "difficulty": 2,
    "tags": [
      "응급"
    ],
    "stem": "개방성 골절에서 초기 처치로 적절한 것은?",
    "choices": [
      {
        "key": "A",
        "text": "항생제 지연"
      },
      {
        "key": "B",
        "text": "상처 세척과 조기 항생제"
      },
      {
        "key": "C",
        "text": "즉시 재활운동"
      },
      {
        "key": "D",
        "text": "관찰만"
      }
    ],
    "answer": "B",
    "explanation": "감염 예방을 위해 조기 항생제/세척이 중요합니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q11",
    "type": "single",
    "subject": "내과",
    "system": "감염",
    "topic": "패혈증",
    "difficulty": 3,
    "tags": [
      "응급"
    ],
    "stem": "패혈증 초기 관리 bundle에 포함되는 것은?",
    "choices": [
      {
        "key": "A",
        "text": "혈액배양 후 광범위 항생제"
      },
      {
        "key": "B",
        "text": "항생제 48시간 후 시작"
      },
      {
        "key": "C",
        "text": "수액 금지"
      },
      {
        "key": "D",
        "text": "젖산 측정 불필요"
      }
    ],
    "answer": "A",
    "explanation": "초기 항생제와 수액, 젖산 추적이 중요합니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q12",
    "type": "single",
    "subject": "정신건강",
    "system": "약물",
    "topic": "우울증",
    "difficulty": 2,
    "tags": [
      "치료"
    ],
    "stem": "SSRI의 흔한 부작용은?",
    "choices": [
      {
        "key": "A",
        "text": "심한 저혈당"
      },
      {
        "key": "B",
        "text": "성기능 저하"
      },
      {
        "key": "C",
        "text": "청력 소실"
      },
      {
        "key": "D",
        "text": "중증 탈모"
      }
    ],
    "answer": "B",
    "explanation": "위장관 증상과 성기능 저하가 비교적 흔합니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q13",
    "type": "single",
    "subject": "내과",
    "system": "혈액",
    "topic": "빈혈",
    "difficulty": 2,
    "tags": [
      "진단"
    ],
    "stem": "철결핍성 빈혈에서 기대되는 소견은?",
    "choices": [
      {
        "key": "A",
        "text": "Ferritin 증가"
      },
      {
        "key": "B",
        "text": "MCV 증가"
      },
      {
        "key": "C",
        "text": "Ferritin 감소"
      },
      {
        "key": "D",
        "text": "Transferrin 감소"
      }
    ],
    "answer": "C",
    "explanation": "철 저장량 감소로 ferritin이 낮아집니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q14",
    "type": "single",
    "subject": "내과",
    "system": "간",
    "topic": "B형간염",
    "difficulty": 2,
    "tags": [
      "감염"
    ],
    "stem": "만성 B형간염의 대표적인 혈청표지자는?",
    "choices": [
      {
        "key": "A",
        "text": "HBsAg 지속 양성"
      },
      {
        "key": "B",
        "text": "anti-HBs 고역가"
      },
      {
        "key": "C",
        "text": "anti-HAV IgM"
      },
      {
        "key": "D",
        "text": "HCV RNA 음성"
      }
    ],
    "answer": "A",
    "explanation": "HBsAg 6개월 이상 양성은 만성을 시사합니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  },
  {
    "id": "Q15",
    "type": "single",
    "subject": "응급",
    "system": "순환",
    "topic": "쇼크",
    "difficulty": 3,
    "tags": [
      "처치"
    ],
    "stem": "저혈량성 쇼크 초기 처치로 가장 적절한 것은?",
    "choices": [
      {
        "key": "A",
        "text": "이뇨제 투여"
      },
      {
        "key": "B",
        "text": "빠른 수액 소생"
      },
      {
        "key": "C",
        "text": "진정제 우선"
      },
      {
        "key": "D",
        "text": "수분 제한"
      }
    ],
    "answer": "B",
    "explanation": "원인 교정과 함께 빠른 수액 소생이 우선입니다.",
    "createdBy": "bundled",
    "createdAt": "2026-02-01",
    "grade": 2,
    "setId": "bundled-core",
    "setName": "기본 샘플"
  }
];
