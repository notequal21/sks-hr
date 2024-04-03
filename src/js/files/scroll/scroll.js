// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile, getHash, menuClose, getDigFormat } from "../functions.js";
import { flsModules } from "../../files/modules.js";
// Модуль прокручування до блоку
// Змінна контролю додавання події window scroll.
let addWindowScrollEvent = false;

//====================================================================================================================================================================================================================================================================================================
window.addEventListener("hashchange", () => {
  const anchor = window.location.hash;

  if (anchor) {
    const target = document.getElementById(anchor.substring(1));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }
});

// Модуль анімація цифрового лічильника
export function digitsCounter() {
  // Функція ініціалізації
  function digitsCountersInit(digitsCountersItems) {
    let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
    if (digitsCounters.length) {
      digitsCounters.forEach((digitsCounter) => {
        // Обнулення
        digitsCounter.dataset.digitsCounter = digitsCounter.innerHTML;
        digitsCounter.innerHTML = `0`;
        // Анімація
        digitsCountersAnimate(digitsCounter);
      });
    }
  }
  // Функція анімації
  function digitsCountersAnimate(digitsCounter) {
    let startTimestamp = null;
    const duration = parseFloat(digitsCounter.dataset.digitsCounterSpeed) ? parseFloat(digitsCounter.dataset.digitsCounterSpeed) : 1000;
    const startValue = parseFloat(digitsCounter.dataset.digitsCounter);
    const format = digitsCounter.dataset.digitsCounterFormat ? digitsCounter.dataset.digitsCounterFormat : " ";
    const startPosition = 0;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (startPosition + startValue));
      digitsCounter.innerHTML = typeof digitsCounter.dataset.digitsCounterFormat !== "undefined" ? getDigFormat(value, format) : value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  function digitsCounterAction(e) {
    const entry = e.detail.entry;
    const targetElement = entry.target;
    if (targetElement.querySelectorAll("[data-digits-counter]").length) {
      digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
    }
  }

  document.addEventListener("watcherCallback", digitsCounterAction);
}
// При підключенні модуля обробник події запуститься автоматично
setTimeout(() => {
  if (addWindowScrollEvent) {
    let windowScroll = new Event("windowScroll");
    window.addEventListener("scroll", function (e) {
      document.dispatchEvent(windowScroll);
    });
  }
}, 0);
