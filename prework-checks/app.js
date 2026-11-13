"use strict";

const checklist = document.querySelector(".checklist");
const groups = [...checklist.querySelectorAll("details")];

if (!("name" in groups[0])) {
  for (const group of groups) {
    group.addEventListener("toggle", () => {
      if (!group.open) return;

      for (const other of groups) {
        if (other !== group) other.open = false;
      }
    });
  }
}

if (window.parent !== window) {
  function reportHeight() {
    window.parent.postMessage({
      type: "lesson-reference-height",
      height: Math.ceil(checklist.getBoundingClientRect().height),
    }, "*");
  }

  new ResizeObserver(reportHeight).observe(checklist);
  reportHeight();
}
