# Legal Tech Architect

판례 데이터를 바탕으로 카카오톡 대화, 녹음 파일, 계약서의 증거능력을 1분 안에 진단하는 서비스의 랜딩 페이지입니다.

## 파일 구성

```
├── index.html            # 페이지 구조와 문구 (HTML)
├── assets/
│   ├── css/style.css     # 디자인 (CSS)
│   ├── js/main.js        # 모바일 메뉴, 체험용 진단 데모 (JavaScript)
│   └── img/mark.svg      # 로고 아이콘 / 파비콘
└── README.md
```

빌드 과정 없이 HTML, CSS, JavaScript만으로 동작합니다. 글꼴은 jsDelivr CDN의 Pretendard를 사용합니다.

## 로컬에서 보기

```bash
python -m http.server 8000
```

브라우저에서 http://localhost:8000 을 엽니다. `index.html`을 직접 더블클릭해도 열립니다.

## 참고

- 히어로의 진단 데모는 체험용 예시이며, 실제 파일을 분석하지 않습니다.
- 진단 결과는 참고 정보이며 법률 자문을 대신하지 않습니다.
