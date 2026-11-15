(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- Demo data ---------- */
  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#${id}"/></svg>`;

  const TYPES = {
    voice: {
      question: "녹음할 때 본인도 대화에 참여하고 있었나요?",
      yes: "네, 제가 대화 당사자였어요",
      no: "아니요, 다른 사람들끼리 나눈 대화예요",
      preview: () => {
        const bars = Array.from({ length: 64 }, (_, i) => {
          const h = 18 + Math.round(Math.abs(Math.sin(i * 0.55) * 60 + Math.sin(i * 1.7) * 20));
          return `<i style="height:${Math.min(h, 96)}px"${i > 22 && i < 34 ? ' class="hl"' : ""}></i>`;
        }).join("");
        return `<div class="file-head">${icon("i-mic")}<strong>녹음_계약금반환_대화.m4a</strong><span>12:48</span></div>
                <div class="wave" aria-hidden="true">${bars}</div>`;
      },
    },
    chat: {
      question: "대화가 남아 있는 원본 휴대폰을 보관하고 있나요?",
      yes: "네, 원본 휴대폰을 보관하고 있어요",
      no: "아니요, 캡처 이미지만 남아 있어요",
      preview: () => `<div class="file-head">${icon("i-chat")}<strong>카카오톡 대화 캡처</strong><span>3장</span></div>
        <div class="chat">
          <p class="bubble them"><small>상대방</small>빌린 돈은 다음 달 말까지 꼭 갚을게.</p>
          <p class="bubble me">지난번에도 똑같이 말했잖아.</p>
          <p class="bubble them"><small>상대방</small>이번엔 진짜야. 이자까지 쳐서 줄게.</p>
        </div>`,
    },
    contract: {
      question: "계약서에 상대방의 서명이나 날인이 있나요?",
      yes: "네, 서명이나 도장이 있어요",
      no: "아니요, 서명이나 도장이 없어요",
      preview: () => `<div class="file-head">${icon("i-file")}<strong>금전 차용 계약서.pdf</strong><span>2쪽</span></div>
        <div class="doc" aria-hidden="true">
          <h5>금전 차용 계약서</h5>
          <p>차용인은 대여인으로부터 금 오천만 원을 차용하며, 2026년 12월 31일까지 전액을 변제하기로 한다. 변제가 지연될 경우 연 5%의 지연 이자를 지급한다.</p>
          <div class="sign"><span>대여인 <b>&nbsp;</b></span><span>차용인 <b>&nbsp;</b></span></div>
        </div>`,
    },
  };

  const RESULTS = {
    "voice-yes": {
      level: "good", score: 82, verdict: "증거로 쓸 수 있을 가능성이 높음",
      findings: [
        ["ok", "대화에 직접 참여한 사람이 녹음한 경우, 통신비밀보호법이 금지하는 ‘타인 간의 대화’ 녹음에 해당하지 않습니다."],
        ["warn", "편집이나 짜깁기 의심을 받지 않으려면 원본 파일과 녹음한 기기를 그대로 보관해야 합니다."],
        ["warn", "녹취록을 함께 낼 때는 녹음 내용과 정확히 일치해야 신빙성을 인정받기 쉽습니다."],
      ],
      next: ["원본 파일을 수정하지 말고 그대로 보관하기","녹음한 날짜, 장소, 경위를 메모로 남기기", "필요하면 속기사에게 녹취록 작성 맡기기"],
    },
    "voice-no": {
      level: "bad", score: 18, verdict: "증거로 쓰기 어렵고 법적 위험이 있음",
      findings: [
        ["risk", "대화에 참여하지 않은 사람이 타인 간의 대화를 몰래 녹음하면 통신비밀보호법 위반이 될 수 있으며, 그 녹음은 재판에서 증거로 사용할 수 없습니다."],
        ["risk", "타인 간의 대화를 몰래 녹음하거나 그 내용을 다른 사람에게 알리는 행위는 형사처벌 대상이 될 수 있습니다."],
        ["warn", "같은 사실을 입증할 수 있는 다른 증거를 찾는 것이 우선입니다."],
      ],
      next: ["녹음 파일을 제출하거나 공유하기 전에 변호사와 상담하기", "문자, 이체 내역, 증인처럼 다른 입증 수단 확보하기"],
    },
    "chat-yes": {
      level: "good", score: 76, verdict: "증거로 쓸 수 있을 가능성이 높음",
      findings: [
        ["ok", "원본 휴대폰이 있으면 제출한 대화가 원본과 같다는 점을 입증하기 쉽습니다."],
        ["warn", "캡처만 내면 상대방이 조작 가능성을 다툴 수 있으니, 대화 내보내기 파일도 함께 보존하는 것이 좋습니다."],
        ["warn", "대화 상대방이 실제로 그 계정의 주인이라는 점을 보여 줄 자료가 필요할 수 있습니다."],
      ],
      next: ["카카오톡 ‘대화 내보내기’로 전체 대화 백업하기", "휴대폰을 초기화하거나 교체하지 말고 그대로 보관하기"],
    },
    "chat-no": {
      level: "caution", score: 45, verdict: "보완이 필요함",
      findings: [
        ["warn", "캡처 이미지만으로는 원본과 같은지를 두고 다툼이 생길 수 있습니다."],
        ["warn", "앞뒤 맥락이 잘린 캡처는 증명력이 낮게 평가될 수 있습니다."],
        ["ok", "상대방이 대화 내용을 인정하면 캡처도 증거로 충분히 쓰일 수 있습니다."],
      ],
      next: ["캡처 원본 이미지 파일을 메타데이터와 함께 보관하기", "PC 카카오톡이나 백업 등 남아 있는 원본이 있는지 확인하기"],
    },
    "contract-yes": {
      level: "good", score: 88, verdict: "증거로 쓸 수 있을 가능성이 높음",
      findings: [
        ["ok", "본인이나 대리인의 서명 또는 날인이 있는 문서는 진정하게 성립한 것으로 추정됩니다(민사소송법 제358조)."],
        ["warn", "상대방이 서명이나 도장을 부인하면 필적·인영 감정이 필요할 수 있습니다."],
      ],
      next: ["계약서 원본을 훼손되지 않게 보관하기", "계약 전후의 대화와 이체 내역을 함께 정리하기"],
    },
    "contract-no": {
      level: "caution", score: 38, verdict: "보완이 필요함",
      findings: [
        ["risk", "서명이나 날인이 없으면 상대방이 이 내용에 동의했다는 사실을 따로 입증해야 합니다."],
        ["warn", "계약 내용을 뒷받침하는 문자, 이메일, 이체 내역의 중요성이 커집니다."],
        ["ok", "계약서가 없어도 계약은 성립할 수 있으므로, 합의 사실을 보여 줄 다른 자료를 모으면 됩니다."],
      ],
      next: ["합의 과정이 담긴 메시지와 이메일 확보하기", "돈을 주고받은 기록 등 계약을 이행한 증빙 모으기"],
    },
  };

  const TAG = { ok: ["i-ok", "충족"], warn: ["i-warn", "주의"], risk: ["i-risk", "위험"] };
  const LEVEL = {
    good: { color: "var(--ok)", icon: "i-ok" },
    caution: { color: "var(--warn)", icon: "i-warn" },
    bad: { color: "var(--risk)", icon: "i-risk" },
  };

  /* ---------- Demo behaviour ---------- */
  const form = document.getElementById("demo-form");
  if (!form) return;

  const stage = document.getElementById("stage");
  const preview = document.getElementById("preview");
  const steps = document.getElementById("scan-steps");
  const result = document.getElementById("result");
  const runBtn = document.getElementById("run-btn");
  const qLegend = document.getElementById("q-legend");
  const aYes = document.getElementById("a-yes");
  const aNo = document.getElementById("a-no");

  let runId = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  const current = () => ({
    type: form.elements.type.value,
    answer: form.elements.answer.value,
  });

  function reset() {
    runId++;
    const { type } = current();
    const t = TYPES[type];
    qLegend.textContent = t.question;
    aYes.textContent = t.yes;
    aNo.textContent = t.no;
    preview.innerHTML = t.preview();
    stage.classList.remove("is-scanning", "is-compact");
    steps.hidden = true;
    result.hidden = true;
    steps.querySelectorAll("li").forEach((li) => li.classList.remove("is-active", "is-done"));
    runBtn.disabled = false;
    runBtn.textContent = "진단 시작";
  }

  function render(key) {
    const r = RESULTS[key];
    const lv = LEVEL[r.level];
    result.className = `result lvl-${r.level}`;
    result.style.setProperty("--gauge-color", lv.color);

    const verdict = document.getElementById("result-verdict");
    verdict.innerHTML = `${icon(lv.icon)}${r.verdict}`;
    document.getElementById("result-score-text").textContent = `100점 중 ${r.score}점`;

    document.getElementById("findings").innerHTML = r.findings
      .map(([s, text]) => `<li><span class="tag ${s}">${icon(TAG[s][0])}${TAG[s][1]}</span><span>${text}</span></li>`)
      .join("");
    document.getElementById("next-steps").innerHTML = r.next.map((n) => `<li>${n}</li>`).join("");

    result.hidden = false;

    // Gauge + counter
    const circle = document.getElementById("gauge-value");
    const num = document.getElementById("gauge-num");
    const C = 314.16;
    circle.style.strokeDashoffset = C;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      circle.style.strokeDashoffset = C * (1 - r.score / 100);
    }));
    if (reduceMotion) { num.textContent = r.score; }
    else {
      const start = performance.now();
      const dur = 900;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        num.textContent = Math.round(r.score * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(() => { num.textContent = r.score; }, 1000); // final value even if rAF is throttled
    }
    verdict.focus({ preventScroll: true });
  }

  async function run() {
    const id = ++runId;
    const { type, answer } = current();
    runBtn.disabled = true;
    runBtn.textContent = "진단 중…";
    result.hidden = true;
    stage.classList.remove("is-compact");
    preview.innerHTML = TYPES[type].preview();
    stage.style.setProperty("--scan-h", `${stage.clientHeight - 2}px`);
    stage.classList.add("is-scanning");
    steps.hidden = false;

    const items = [...steps.querySelectorAll("li")];
    items.forEach((li) => li.classList.remove("is-active", "is-done"));
    for (const li of items) {
      li.classList.add("is-active");
      await wait(650);
      if (id !== runId) return;
      li.classList.remove("is-active");
      li.classList.add("is-done");
    }
    await wait(200);
    if (id !== runId) return;

    stage.classList.remove("is-scanning");
    stage.classList.add("is-compact");
    preview.innerHTML = preview.querySelector(".file-head").outerHTML;
    steps.hidden = true;
    render(`${type}-${answer}`);
    runBtn.disabled = false;
    runBtn.textContent = "다시 진단하기";
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "type") {
      form.elements.answer.value = "yes";
    }
    reset();
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); run(); });

  reset();
})();
