"use strict";

const scenarios = [
  {
    text: "Вы проверили защиту от утечки тока. Специальная доска для записи результатов есть.",
    correct: "board",
    feedback: {
      board: "Запишите результат на специальной доске и подтвердите запись личной подписью.",
      operations: "Оперативный журнал используют при отсутствии специальной доски. В этой ситуации доска есть.",
      handover: "Для результатов проверки защиты от утечки тока предусмотрена специальная доска. Здесь она есть.",
    },
  },
  {
    text: "Вы проверили защиту от утечки тока. Специальной доски для записи результатов нет.",
    correct: "operations",
    feedback: {
      board: "Специальной доски здесь нет. Внесите результат в оперативный журнал на электросборке комплекса.",
      operations: "При отсутствии специальной доски результат вносят в оперативный журнал на электросборке комплекса.",
      handover: "При отсутствии доски результат этой проверки вносят в оперативный журнал на электросборке комплекса.",
    },
  },
  {
    text: "Вы проверили стационарные газоанализаторы, полуавтоматическое и дистанционное управление комбайном.",
    correct: "handover",
    feedback: {
      board: "На специальной доске отмечают результаты проверки защиты от утечки тока. Результаты этих проверок внесите в журнал приёма и сдачи смен на комбайне.",
      operations: "В оперативный журнал вносят результат проверки защиты от утечки тока при отсутствии доски. Результаты этих проверок внесите в журнал приёма и сдачи смен на комбайне.",
      handover: "Результаты проверки газоанализаторов и управления внесите в журнал приёма и сдачи смен на комбайне.",
    },
  },
  {
    text: "Проектом проветривания предусмотрено устройство контроля поступления воздуха АПТВ или его аналог. Вы проверили его состояние и работу.",
    correct: "handover",
    feedback: {
      board: "Специальная доска предназначена для результата проверки защиты от утечки тока. Результат проверки устройства контроля поступления воздуха внесите в журнал приёма и сдачи смен на комбайне.",
      operations: "В оперативный журнал вносят результат проверки защиты от утечки тока при отсутствии доски. Результат проверки устройства контроля поступления воздуха внесите в журнал приёма и сдачи смен на комбайне.",
      handover: "Результат проверки предусмотренного проектом устройства внесите в журнал приёма и сдачи смен на комбайне.",
    },
  },
];

const practice = document.querySelector(".practice");
const situation = practice.querySelector("#situation");
const rules = practice.querySelector(".rules");
const places = [...practice.querySelectorAll("[data-place]")];
const feedback = practice.querySelector(".feedback");
const actions = practice.querySelector(".actions");
const next = practice.querySelector(".next");
const restart = practice.querySelector(".restart");
let current = 0;
let answered = false;

function showScenario() {
  answered = false;
  situation.textContent = scenarios[current].text;
  for (const place of places) {
    delete place.dataset.result;
    place.removeAttribute("aria-disabled");
    place.removeAttribute("tabindex");
  }
  delete feedback.dataset.result;
  feedback.replaceChildren();
  actions.hidden = true;
  const lastScenario = current === scenarios.length - 1;
  next.hidden = lastScenario;
  restart.hidden = !lastScenario;
  situation.focus();
}

for (const place of places) {
  place.addEventListener("click", () => {
    if (answered) return;

    const scenario = scenarios[current];
    const choice = place.dataset.place;
    answered = choice === scenario.correct;
    const result = answered ? "correct" : "retry";

    for (const other of places) {
      delete other.dataset.result;
      if (answered) {
        other.setAttribute("aria-disabled", "true");
        other.tabIndex = -1;
      }
    }
    place.dataset.result = result;

    const label = document.createElement("strong");
    label.textContent = "Попробуйте другое место";
    if (answered) {
      label.textContent = current === scenarios.length - 1 ? "Задание выполнено" : "Верно";
    }
    const explanation = document.createElement("p");
    explanation.textContent = scenario.feedback[choice];
    feedback.dataset.result = result;
    feedback.replaceChildren(label, explanation);
    actions.hidden = !answered;
  });
}

next.addEventListener("click", () => {
  if (!answered || current === scenarios.length - 1) return;
  current += 1;
  showScenario();
});

restart.addEventListener("click", () => {
  current = 0;
  rules.open = false;
  showScenario();
});

if (window.parent !== window) {
  function reportHeight() {
    window.parent.postMessage({
      type: "lesson-reference-height",
      height: Math.ceil(practice.getBoundingClientRect().height),
    }, "*");
  }

  new ResizeObserver(reportHeight).observe(practice);
  reportHeight();
}
