document.addEventListener("DOMContentLoaded", function () {
  jsSelect(".bl_select");
  jsSelect(".bl_emoji", true);
  jsSelectMulti(".bl_select");
  jsSelectStar(".el_star");
  jsTextarea();
  jsLoadProgress();
  jsScroll();
  jsTabDown();
  jsIsFirstPage();
  jsOptionInsert();
  jsGoBack();
});

// jsSelect
function jsSelect(item, disabled = false) {
  const selects = document.querySelectorAll(`.js_select ${item} > input`);

  selects?.forEach((el) => {
    el.addEventListener("change", () => {
      const select = el.closest(item);
      const sibling = select.parentElement.querySelectorAll(item);

      sibling.forEach((opt) => {
        opt.classList.remove("is_active");
        if (disabled) {
          opt.classList.add("is_disabled");
        }
      });
      select.classList.add("is_active");
      if (disabled) {
        select.classList.remove("is_disabled");
      }

      jsUpdateAnswer();
    });
  });
}
// jsSelectMulti
function jsSelectMulti(item) {
  const selects = document.querySelectorAll(`.js_selectMulti ${item} > input`);

  selects?.forEach((el) => {
    el.addEventListener("click", () => {
      const select = el.closest(item);
      select.classList.toggle("is_active");
      jsUpdateAnswer();
    });
  });
}
// jsSelectStar
function jsSelectStar(item) {
  const stars = document.querySelectorAll(`.js_selectStar > ${item}`);

  stars?.forEach((el, index) => {
    el.addEventListener("click", () => {
      const sibling = el.parentElement.querySelectorAll(item);

      sibling.forEach((opt, idx) => {
        if (idx <= index) {
          opt.classList.add("is_active");
        } else {
          opt.classList.remove("is_active");
        }
      });

      jsUpdateAnswer();
    });
  });
}
// jsTextarea
function jsTextarea() {
  const textareas = document.querySelectorAll(".js_textarea");

  textareas?.forEach((wrap) => {
    const ta = wrap.querySelector("textarea");
    const count = wrap.querySelector(".bl_textarea_count");
    const total = wrap.querySelector(".bl_textarea_total");
    const maxLength = parseInt(ta.getAttribute("maxlength"), 10) || 150;

    count.textContent = 0;
    total.textContent = maxLength;

    const update = () => {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
      count.textContent = ta.value.length;

      if (ta.value.trim() !== "") {
        wrap.classList.add("is_active");
      } else {
        wrap.classList.remove("is_active");
      }
      jsUpdateAnswer();
    };

    ta.addEventListener("input", update);
  });
}

// jsUpdateAnswer
function jsUpdateAnswer() {
  const items = document.querySelectorAll(".js_quesList .bl_quesList_item");
  items?.forEach((item) => {
    const hasActive = item.querySelector(`[class^="bl_opt"] .is_active`);
    item.classList.toggle("has_answer", !!hasActive);
  });

  const AnsweredItems = document.querySelectorAll(
    ".js_quesList .bl_quesList_item.has_answer"
  );

  let pageStep = Number(localStorage.getItem("pageStep")) || 0;
  let step = AnsweredItems?.length;

  if (pageStep < step) {
    jsStepUp();
    localStorage.setItem("pageStep", step);
  } else if (pageStep > step) {
    jsStepDown();
    localStorage.setItem("pageStep", step);
  }
}
// jsProgress
function jsLoadProgress() {
  jsProgress();
}
function jsStepUp() {
  let surveyStep = Number(localStorage.getItem("surveyStep"));
  surveyStep += 1;
  localStorage.setItem("surveyStep", surveyStep);
  jsProgress();
}
function jsStepDown() {
  let surveyStep = Number(localStorage.getItem("surveyStep"));
  surveyStep -= 1;
  localStorage.setItem("surveyStep", surveyStep);
  jsProgress();
}
function jsProgress() {
  const progress = document.querySelector(".js_progress");

  if (!progress) return;

  const fillEl = progress.querySelector(".bl_progressBar_fill");
  const totalEl = progress.querySelector(".bl_progressCount_total");
  const nowEl = progress.querySelector(".bl_progressCount_now");
  const bar = progress.querySelector(".bl_progressBar");

  const totalStep = 7; // 개발 시 추가(퍼블에서는 dom요소를 기반으로 체크됨)
  totalEl.textContent = totalStep;
  bar.setAttribute("aria-valuemax", totalStep);

  let currentStep = Number(localStorage.getItem("surveyStep")) || 0;
  nowEl.textContent = currentStep;
  bar.setAttribute("aria-valuenow", currentStep);

  const percent = (currentStep / totalStep) * 100;
  fillEl.style.width = percent + "%";

  jsBtnActive();
}
// jsBtnActive
function jsBtnActive() {
  const items = document.querySelectorAll(".js_quesList .bl_quesList_item");
  const btn = document.querySelector(".js_btnActive");

  if (!items.length) return;
  if (!btn) return;

  let shouldActive = true;

  for (const el of items) {
    const hasAnswerd = el.classList.contains("has_answer");
    const isOptional = el.classList.contains("is_optional");

    if (!hasAnswerd && !isOptional) {
      shouldActive = false;
      break;
    }
  }

  btn.classList.toggle("is_active", shouldActive);
  btn.toggleAttribute("disabled", !shouldActive);
  jsGoNext(btn);
}
// jsOptionInsert
function jsOptionInsert() {
  const optionItems = document.querySelectorAll(".is_optional");

  optionItems?.forEach((item) => {
    const ques = item.querySelector(".bl_quesT");
    if (!ques) return;

    const hasOption = ques.querySelector(".el_optionT");

    if (!hasOption) {
      ques.insertAdjacentHTML(
        "beforeend",
        '<span class="el_optionT">(선택)</span>'
      );
    }
  });
}
// jsIsFirstPage
function jsIsFirstPage() {
  const quesNum = document.querySelector(".el_numT").textContent;
  const goBackBtn = document.querySelector(".js_goBack");

  if (quesNum && Number(quesNum) !== 1) {
    goBackBtn?.classList.add("is_active");
  }
}
// jsGoBack
function jsGoBack() {
  const goBackBtn = document.querySelector(".js_goBack");

  goBackBtn?.addEventListener("click", () => {
    window.history.back();
  });
}

// jsScroll
function jsScroll() {
  const hasScroll = document.body.scrollHeight > window.innerHeight;

  if (hasScroll) {
    document.body.classList.add("has_scroll");
  } else {
    document.body.classList.remove("has_scroll");
  }
}
// jsUseMouse
function jsTabDown() {
  document.body.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("is_tabDown");
    } else {
      document.body.classList.remove("is_tabDown");
    }
  });
  document.body.addEventListener("mousedown", () => {
    document.body.classList.remove("is_tabDown");
  });
}

// jsGoNext
let isFirstPage = true;
let isClicked = false; // 임시 전역 변수
function jsGoNext(btn) {
  const nextUrl = btn.dataset.next;

  if (!nextUrl) {
    btn.addEventListener("click", () => {
      if (!btn.classList.contains("is_active")) return;
      if (isClicked) return;

      isClicked = true;
      alert("설문조사를 참여했습니다."); // 개발 시 삭제
      window.location.href = "/survey-start.html"; // 개발 시 삭제
      localStorage.removeItem("pageStep");
      localStorage.removeItem("surveyStep");
    });
  } else {
    btn.addEventListener(
      "click",
      () => {
        if (!btn.classList.contains("is_active")) return;
        window.location.href = nextUrl;
        localStorage.removeItem("pageStep");
      },
      { once: true }
    );
  }
}
