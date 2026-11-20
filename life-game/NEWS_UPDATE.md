# 오천만분의 일 · 주간 뉴스 업데이트 절차

- 소스: `life-game/src/` · 빌드 결과: `life-game/오천만분의일.html`
- 브랜치: `claude/game-analysis-comparison-3f8iqx` (master 에는 올리지 않는다)
- 배포 주소: https://claude.ai/artifact/AzErGR7YnuuASDUWLGEfUF

## 매주 할 일
1. 저장소 최신화: `git fetch origin claude/game-analysis-comparison-3f8iqx && git checkout claude/game-analysis-comparison-3f8iqx && git pull`
2. 지난 7일간 한국 주요 뉴스 토픽을 웹 검색으로 확인하고, 게임에 넣을 만한 것을 0~3개 고른다.
   - 넣는다: 경제(증시·금리·집값·물가·최저임금), 교육(수능·입시), 기술·생활(AI, 앱, 유행), 스포츠·문화, 재난·날씨, 제도 변화.
   - 넣지 않는다: 특정 정치인·정당 평가, 범죄 피해자·가해자, 실명 개인, 확인 안 된 루머, 이미 들어간 것과 비슷한 것.
3. `life-game/src/news_live.js` 만 고친다.
   - `NEWS.push(` 안 맨 끝에 항목 추가 (기존 항목 순서·내용은 바꾸지 않는다: 저장된 게임의 뉴스 번호가 어긋난다).
     형식: `{y:올해, a:[최소나이,최대나이], h:'헤드라인', t:'나에게 생긴 일(내 시점, 1~2문장)', e:{행:2}}`
     선택지형: `c:[{l:'선택', e:{...}, t:'결과'}, {l:'다른 선택', e:{}, t:'결과'}]`
     스탯 키: 학 체 멘 행 인 매 돈(만원) · 변화는 ±1~6. 조건: `if:S=>!!S.job` (직장인) 등.
   - `LIVE_UPDATED` 를 오늘 날짜로.
   - `KOSPI_LIVE[올해]` = (최근 코스피 종가 / 전년 말 종가 - 1) × 100. 2025년 말 종가는 약 4,214.
     해가 바뀌면 전년 값을 연말 종가로 확정하고 새해 키를 추가한다.
4. 검증 (`life-game/src` 에서):
   - `python3 assemble3.py` → `../오천만분의일.html` 생성
   - `node simrt.js 300` → `errors 0`
   - `node pw4.js "$PWD/../오천만분의일.html" <임시폴더>` → `"errs":[]`, `"ended":true`
   - 실패하면 배포·커밋하지 말고 원인을 보고한다.
5. 배포: Artifact 를 먼저 read 한 뒤, `life-game/오천만분의일.html` 을 같은 url 로 publish.
6. 커밋: `git add -f life-game` → 커밋 → `git push -u origin claude/game-analysis-comparison-3f8iqx`
7. 넣은 뉴스를 2~3줄로 보고한다. 넣을 뉴스가 없으면 날짜·코스피만 갱신하고 그렇게 보고한다.
