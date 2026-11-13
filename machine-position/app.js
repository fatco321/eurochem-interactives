"use strict";

const position = document.querySelector(".position");
const modePicker = position.querySelector(".mode-picker");
const plans = position.querySelectorAll("[data-plan]");

function showSelectedPlan() {
  const mode = modePicker.querySelector("input:checked").value;
  for (const plan of plans) {
    plan.toggleAttribute("hidden", plan.dataset.plan !== mode);
  }
}

modePicker.addEventListener("change", showSelectedPlan);
showSelectedPlan();

if (window.parent !== window) {
  function reportHeight() {
    window.parent.postMessage({
      type: "lesson-reference-height",
      height: Math.ceil(position.getBoundingClientRect().height),
    }, "*");
  }

  new ResizeObserver(reportHeight).observe(position);
  reportHeight();
}
