// Подключение списка активных модулей
import { flsModules } from "./modules.js";

/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
export function isWebp() {
  // Проверка поддержки webp
  function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {
    let className = support === true ? "webp" : "no-webp";
    document.documentElement.classList.add(className);
  });
}

export let isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};
/* Добавление класса touch для HTML, если браузер мобильный */
export function addTouchClass() {
  if (isMobile.any()) document.documentElement.classList.add("touch");
}
// Добавление loaded для HTML после полной загрузки страницы
export function addLoadedClass() {
  if (!document.documentElement.classList.contains("loading")) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        document.documentElement.classList.add("loaded");
      }, 0);
    });
  }
}
// Получение хеша по адресу сайта
export function getHash() {
  if (location.hash) {
    return location.hash.replace("#", "");
  }
}
// Указание хеша по адресу сайта
export function setHash(hash) {
  hash = hash ? `#${hash}` : window.location.href.split("#")[0];
  history.pushState("", "", hash);
}
// Учет плавающей панели на мобильных устройствах при 100vh
export function fullVHfix() {
  const fullScreens = document.querySelectorAll("[data-fullscreen]");
  if (fullScreens.length && isMobile.any()) {
    window.addEventListener("resize", fixHeight);
    function fixHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    fixHeight();
  }
}
// Вспомогательные модули плавного раскрытия и закрытия объекта======================================================================================================================================================================
/**
 * Скрывает элемент путем анимации слайд-ап.
 *
 * @param {HTMLElement} target - Целевой элемент, который будет скрыт.
 * @param {number} duration - Длительность анимации в миллисекундах (по умолчанию 500 мс).
 * @param {number} showmore - Высота элемента после анимации (по умолчанию 0).
 */
export let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      // Создаем событие
      document.dispatchEvent(
        new CustomEvent("slideUpDone", {
          detail: {
            target: target,
          },
        })
      );
    }, duration);
  }
};
/**
 * Показывает элемент путем анимации слайд-даун.
 *
 * @param {HTMLElement} target - Целевой элемент, который будет показан.
 * @param {number} duration - Длительность анимации в миллисекундах (по умолчанию 500 мс).
 * @param {number} showmore - Высота элемента после анимации (по умолчанию 0).
 */
export let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      // Создаем событие
      document.dispatchEvent(
        new CustomEvent("slideDownDone", {
          detail: {
            target: target,
          },
        })
      );
    }, duration);
  }
};
export let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};
// Вспомогательные модули блокировки прокрутки и прыжка ====================================================================================================================================================================================================================================================================================
export let bodyLockStatus = true;
/**
 * Переключает блокировку прокрутки страницы.
 *
 * @param {number} delay - Задержка перед выполнением операции блокировки или разблокировки (по умолчанию 500 мс).
 *//**
 * Разблокирует элемент body после указанной задержки.
 *
 * @param {number} delay - Задержка в миллисекундах перед разблокировкой элемента body. По умолчанию 500 миллисекунд.
 * @return {undefined} Нет возвращаемого значения.
 */
export let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains("lock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
/**
 * Разблокирует элемент body после указанной задержки.
 *
 * @param {number} delay - Задержка в миллисекундах перед разблокировкой элемента body. По умолчанию 500 миллисекунд.
 * @return {undefined} Нет возвращаемого значения.
 */
export let bodyUnlock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = "0px";
      }
      body.style.paddingRight = "0px";
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
/**
+ * Locks the scrolling of the page body for a specific duration.
+ *
+ * @param {number} delay - The delay in milliseconds before the scrolling is unlocked again. Defaults to 500 milliseconds.
+ * @return {undefined} This function does not return any value.
+ */
export let bodyLock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight =
        window.innerWidth -
        document.querySelector(".wrapper").offsetWidth +
        "px";
    }
    body.style.paddingRight =
      window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
    document.documentElement.classList.add("lock");

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
// Модуль работы со спойлерами =======================================================================================================================================================================================================================
export function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    document.addEventListener("click", setSpollerAction);
    const spollersRegular = Array.from(spollersArray).filter(
      function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
      }
    );
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    // Получение слойлеров с медиа-запросами
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        // Событие
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
        }
      });
    }
    // Робота с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll("details");
      if (spollerItems.length) {
        //spollerItems = Array.from(spollerItems).filter(item => item.closest('[data-spollers]') === spollersBlock);
        spollerItems.forEach((spollerItem) => {
          let spollerTitle = spollerItem.querySelector("summary");
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerItem.hasAttribute("data-open")) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add("_spoller-active");
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.classList.remove("_spoller-active");
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest("summary") && el.closest("[data-spollers]")) {
        e.preventDefault();
        if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
          const spollerTitle = el.closest("summary");
          const spollerBlock = spollerTitle.closest("details");
          const spollersBlock = spollerTitle.closest("[data-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
          const scrollSpoller = spollerBlock.hasAttribute(
            "data-spoller-scroll"
          );
          const spollerSpeed = spollersBlock.dataset.spollersSpeed
            ? parseInt(spollersBlock.dataset.spollersSpeed)
            : 500;
          if (!spollersBlock.querySelectorAll("._slide").length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }

            !spollerBlock.open
              ? (spollerBlock.open = true)
              : setTimeout(() => {
                  spollerBlock.open = false;
                }, spollerSpeed);

            spollerTitle.classList.toggle("_spoller-active");
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);

            if (
              scrollSpoller &&
              spollerTitle.classList.contains("_spoller-active")
            ) {
              const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
              const scrollSpollerOffset = +scrollSpollerValue
                ? +scrollSpollerValue
                : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute(
                "data-spoller-scroll-noheader"
              )
                ? document.querySelector(".header").offsetHeight
                : 0;

              //setTimeout(() => {
              window.scrollTo({
                top:
                  spollerBlock.offsetTop -
                  (scrollSpollerOffset + scrollSpollerNoHeader),
                behavior: "smooth",
              });
              //}, spollerSpeed);
            }
          }
        }
      }
      // Закрытие при клике вне спойлера
      if (!el.closest("[data-spollers]")) {
        const spollersClose = document.querySelectorAll("[data-spoller-close]");
        if (spollersClose.length) {
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains("_spoller-init")) {
              const spollerSpeed = spollersBlock.dataset.spollersSpeed
                ? parseInt(spollersBlock.dataset.spollersSpeed)
                : 500;
              spollerClose.classList.remove("_spoller-active");
              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => {
                spollerCloseBlock.open = false;
              }, spollerSpeed);
            }
          });
        }
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector("details[open]");
      if (
        spollerActiveBlock &&
        !spollersBlock.querySelectorAll("._slide").length
      ) {
        const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed
          ? parseInt(spollersBlock.dataset.spollersSpeed)
          : 500;
        spollerActiveTitle.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => {
          spollerActiveBlock.open = false;
        }, spollerSpeed);
      }
    }
  }
}
// Модуль работы с табами =======================================================================================================================================================================================================================
export function tabs(context = document) {
  const tabs = context.querySelectorAll("[data-tabs]");
  const setAttrIfNotExists = (el, attr, value) => {
    if (!el.hasAttribute(attr)) {
      el.setAttribute(attr, value);
    }
  };
  const setInitalAttrs = (tabs, btns, panels, index) => {
    setAttrIfNotExists(btns[0].parentElement, "role", "tablist");

    btns.forEach((btn, i) => {
      setAttrIfNotExists(btn, "role", "tab");
      btn.setAttribute("aria-selected", btn.classList.contains("_tab-active"));
      btn.setAttribute("id", `tab-${index}-${i}`);
    });

    panels.forEach((panel, i) => {
      setAttrIfNotExists(panel, "role", "tabpanel");
      panel.setAttribute("id", `panel-${index}-${i}`);
      panel.setAttribute("aria-labelledby", btns[i].getAttribute("id"));
    });

    btns.forEach((btn, i) => {
      btn.setAttribute("aria-controls", panels[i].getAttribute("id"));
    });
  };

  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith("tab-")) {
      tabsActiveHash = hash.replace("tab-", "").split("-");
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add("_tab-init");
      tabsBlock.setAttribute("data-tabs-index", index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock, index);
    });

    // Получение слойлеров с медиа-запросами
    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        // Подія
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
  // Установка позиций заголовков
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach((tabsMediaItem) => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
      let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
      let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
      let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
      tabsTitleItems = Array.from(tabsTitleItems).filter(
        (item) => item.closest("[data-tabs]") === tabsMediaItem
      );
      tabsContentItems = Array.from(tabsContentItems).filter(
        (item) => item.closest("[data-tabs]") === tabsMediaItem
      );
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add("_tab-spoller");
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove("_tab-spoller");
        }
      });
    });
  }
  // Работа с контентом
  function initTabs(tabsBlock, index) {
    let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
    let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
    setInitalAttrs(tabs, tabsTitles, tabsContent, index);

    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector(
        "[data-tabs-titles]>._tab-active"
      );
      tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
    }
    if (tabsContent.length) {
      //tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      //tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute("data-tabs-title", "");
        tabsContentItem.setAttribute("data-tabs-item", "");

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add("_tab-active");
        }
        tabsContentItem.hidden =
          !tabsTitles[index].classList.contains("_tab-active");
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
    let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    function isTabsAnamate(tabsBlock) {
      if (tabsBlock.hasAttribute("data-tabs-animate")) {
        return tabsBlock.dataset.tabsAnimate > 0
          ? Number(tabsBlock.dataset.tabsAnimate)
          : 500;
      }
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute("data-tabs-hash");
      tabsContent = Array.from(tabsContent).filter(
        (item) => item.closest("[data-tabs]") === tabsBlock
      );
      tabsTitles = Array.from(tabsTitles).filter(
        (item) => item.closest("[data-tabs]") === tabsBlock
      );
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains("_tab-active")) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest(".popup")) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest("[data-tabs-title]")) {
      const tabTitle = el.closest("[data-tabs-title]");
      const tabsBlock = tabTitle.closest("[data-tabs]");
      if (
        !tabTitle.classList.contains("_tab-active") &&
        !tabsBlock.querySelector("._slide")
      ) {
        let tabActiveTitle = tabsBlock.querySelectorAll(
          "[data-tabs-title]._tab-active"
        );
        tabActiveTitle.length
          ? (tabActiveTitle = Array.from(tabActiveTitle).filter(
              (item) => item.closest("[data-tabs]") === tabsBlock
            ))
          : null;

        if (tabActiveTitle.length) {
          tabActiveTitle[0].classList.remove("_tab-active");
          tabActiveTitle[0].setAttribute("aria-selected", false);
        }
        tabTitle.classList.add("_tab-active");
        tabTitle.setAttribute("aria-selected", true);

        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
// Модуль работы по меню (бургер) =======================================================================================================================================================================================================================
export function menuInit() {
  const iconMenu = document.querySelector(".icon-menu");
  if (iconMenu) {
    setAttr([iconMenu], "aria-expanded");
    document.addEventListener("click", function (e) {
      if (bodyLockStatus && e.target.closest(".icon-menu")) {
        bodyLockToggle();
        toggleAttr([iconMenu], "aria-expanded");
        document.documentElement.classList.toggle("menu-open");
      }
    });
  }
}
export function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
export function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}
// Модуль "показать еще" =======================================================================================================================================================================================================================
export function showMore() {
  window.addEventListener("load", function (e) {
    const showMoreBlocks = document.querySelectorAll("[data-showmore]");
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
      // Инициализация обычных объектов
      showMoreBlocksRegular = Array.from(showMoreBlocks).filter(
        function (item, index, self) {
          return !item.dataset.showmoreMedia;
        }
      );
      // Инициализация обычных объектов
      showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

      document.addEventListener("click", showMoreActions);
      window.addEventListener("resize", showMoreActions);

      // Получение объектов с медиа-запросами
      mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach((mdQueriesItem) => {
          // Событие
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
        });
        initItemsMedia(mdQueriesArray);
      }
    }
    function initItemsMedia(mdQueriesArray) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    function initItems(showMoreBlocks, matchMedia) {
      showMoreBlocks.forEach((showMoreBlock) => {
        initItem(showMoreBlock, matchMedia);
      });
    }
    function initItem(showMoreBlock, matchMedia = false) {
      showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
      let showMoreContent = showMoreBlock.querySelectorAll(
        "[data-showmore-content]"
      );
      let showMoreButton = showMoreBlock.querySelectorAll(
        "[data-showmore-button]"
      );
      showMoreContent = Array.from(showMoreContent).filter(
        (item) => item.closest("[data-showmore]") === showMoreBlock
      )[0];
      showMoreButton = Array.from(showMoreButton).filter(
        (item) => item.closest("[data-showmore]") === showMoreBlock
      )[0];
      const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
      if (matchMedia.matches || !matchMedia) {
        if (hiddenHeight < getOriginalHeight(showMoreContent)) {
          _slideUp(
            showMoreContent,
            0,
            showMoreBlock.classList.contains("_showmore-active")
              ? getOriginalHeight(showMoreContent)
              : hiddenHeight
          );
          showMoreButton.hidden = false;
        } else {
          _slideDown(showMoreContent, 0, hiddenHeight);
          showMoreButton.hidden = true;
        }
      } else {
        _slideDown(showMoreContent, 0, hiddenHeight);
        showMoreButton.hidden = true;
      }
    }
    function getHeight(showMoreBlock, showMoreContent) {
      let hiddenHeight = 0;
      const showMoreType = showMoreBlock.dataset.showmore
        ? showMoreBlock.dataset.showmore
        : "size";
      const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap)
        ? parseFloat(getComputedStyle(showMoreContent).rowGap)
        : 0;
      if (showMoreType === "items") {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent
          ? showMoreContent.dataset.showmoreContent
          : 3;
        const showMoreItems = showMoreContent.children;
        for (let index = 1; index < showMoreItems.length; index++) {
          const showMoreItem = showMoreItems[index - 1];
          const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop)
            ? parseFloat(getComputedStyle(showMoreItem).marginTop)
            : 0;
          const marginBottom = parseFloat(
            getComputedStyle(showMoreItem).marginBottom
          )
            ? parseFloat(getComputedStyle(showMoreItem).marginBottom)
            : 0;
          hiddenHeight += showMoreItem.offsetHeight + marginTop;
          if (index == showMoreTypeValue) break;
          hiddenHeight += marginBottom;
        }
        rowGap ? (hiddenHeight += (showMoreTypeValue - 1) * rowGap) : null;
      } else {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent
          ? showMoreContent.dataset.showmoreContent
          : 150;
        hiddenHeight = showMoreTypeValue;
      }
      return hiddenHeight;
    }

    function getOriginalHeight(showMoreContent) {
      let parentHidden;
      let hiddenHeight = showMoreContent.offsetHeight;
      showMoreContent.style.removeProperty("height");
      if (showMoreContent.closest(`[hidden]`)) {
        parentHidden = showMoreContent.closest(`[hidden]`);
        parentHidden.hidden = false;
      }
      let originalHeight = showMoreContent.offsetHeight;
      parentHidden ? (parentHidden.hidden = true) : null;
      showMoreContent.style.height = `${hiddenHeight}px`;
      return originalHeight;
    }
    function showMoreActions(e) {
      const targetEvent = e.target;
      const targetType = e.type;
      if (targetType === "click") {
        if (targetEvent.closest("[data-showmore-button]")) {
          const showMoreButton = targetEvent.closest("[data-showmore-button]");
          const showMoreBlock = showMoreButton.closest("[data-showmore]");
          const showMoreContent = showMoreBlock.querySelector(
            "[data-showmore-content]"
          );
          const showMoreSpeed = showMoreBlock.dataset.showmoreButton
            ? showMoreBlock.dataset.showmoreButton
            : "500";
          const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
          if (!showMoreContent.classList.contains("_slide")) {
            showMoreBlock.classList.contains("_showmore-active")
              ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight)
              : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
            showMoreBlock.classList.toggle("_showmore-active");
          }
        }
      } else if (targetType === "resize") {
        showMoreBlocksRegular && showMoreBlocksRegular.length
          ? initItems(showMoreBlocksRegular)
          : null;
        mdQueriesArray && mdQueriesArray.length
          ? initItemsMedia(mdQueriesArray)
          : null;
      }
    }
  });
}
// Модуль "Ripple effect"=======================================================================================================================================================================================================================
export function rippleEffect() {
  // Подія кліку на кнопці
  document.addEventListener("click", function (e) {
    const targetItem = e.target;
    if (targetItem.closest("[data-ripple]")) {
      // Переменные
      const button = targetItem.closest("[data-ripple]");
      const ripple = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      // Формирование элемента
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${e.pageX - (button.getBoundingClientRect().left + scrollX) - radius}px`;
      ripple.style.top = `${e.pageY - (button.getBoundingClientRect().top + scrollY) - radius}px`;
      ripple.classList.add("ripple");

      // Удаление существующего элемента (опционально)
      button.dataset.ripple === "once" && button.querySelector(".ripple")
        ? button.querySelector(".ripple").remove()
        : null;

      // Добавление элемента
      button.appendChild(ripple);

      // Получение времени действия анимации
      const timeOut = getAnimationDuration(ripple);

      // Удаление элемента
      setTimeout(() => {
        ripple ? ripple.remove() : null;
      }, timeOut);

      // Удаление элемента
      function getAnimationDuration() {
        const aDuration = window.getComputedStyle(ripple).animationDuration;
        return aDuration.includes("ms")
          ? aDuration.replace("ms", "")
          : aDuration.replace("s", "") * 1000;
      }
    }
  });
}
/**
 * Устанавливает указанный атрибут для всех элементов в массиве, если он еще не установлен.
 *
 * @param {Array} array - Массив элементов, для которых устанавливается атрибут
 * @param {string} attr - Устанавливаемый атрибут
 * @return {void}
 */
export function setAttr(array, attr) {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (!element.hasAttribute(attr)) {
      element.setAttribute(attr, "false");
    }
  }
}
/**
 * Переключает значение атрибута для каждого элемента в массиве.
 *
 * @param {Array} array - Массив элементов
 * @param {string} attr - Название атрибута для переключения
 * @return {void}
 */
export function toggleAttr(array, attr) {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    if (element.getAttribute(attr) === "false") {
      element.setAttribute(attr, "true");
    } else {
      element.setAttribute(attr, "false");
    }
  }
}
/**
 * Устанавливает указанный атрибут в "false" для каждого элемента в заданном массиве.
 *
 * @param {Array} array - Массив элементов
 * @param {string} attr - Атрибут, который нужно установить в "false"
 */
export function falseAttr(array, attr) {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    element.setAttribute(attr, "false");
  }
}
/**
 * Устанавливает указанный атрибут в "true" для каждого элемента в заданном массиве.
 *
 * @param {Array} array - Массив элементов
 * @param {string} attr - Атрибут, который нужно установить в "true"
 */
export function trueAttr(array, attr) {
  console.log(array);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    console.log(element);
    element.setAttribute(attr, "true");
  }
}
// Модуль "Сustom сursor" =======================================================================================================================================================================================================================
export function customCursor(isShadowTrue) {
  const wrapper = document.querySelector("[data-custom-cursor]")
    ? document.querySelector("[data-custom-cursor]")
    : document.documentElement;
  if (wrapper && !isMobile.any()) {
    // Создаем и добавляем объект курсора
    const cursor = document.createElement("div");
    cursor.classList.add("fls-cursor");
    cursor.style.opacity = 0;
    cursor.insertAdjacentHTML(
      "beforeend",
      `<span class="fls-cursor__pointer"></span>`
    );
    isShadowTrue
      ? cursor.insertAdjacentHTML(
          "beforeend",
          `<span class="fls-cursor__shadow"></span>`
        )
      : null;
    wrapper.append(cursor);

    const cursorPointer = document.querySelector(".fls-cursor__pointer");
    const cursorPointerStyle = {
      width: cursorPointer.offsetWidth,
      height: cursorPointer.offsetHeight,
    };
    let cursorShadow, cursorShadowStyle;
    if (isShadowTrue) {
      cursorShadow = document.querySelector(".fls-cursor__shadow");
      cursorShadowStyle = {
        width: cursorShadow.offsetWidth,
        height: cursorShadow.offsetHeight,
      };
    }
    function mouseActions(e) {
      if (e.type === "mouseout") {
        cursor.style.opacity = 0;
      } else if (e.type === "mousemove") {
        cursor.style.removeProperty("opacity");
        if (
          e.target.closest("button") ||
          e.target.closest("a") ||
          e.target.closest("input") ||
          (window.getComputedStyle(e.target).cursor !== "none" &&
            window.getComputedStyle(e.target).cursor !== "default")
        ) {
          cursor.classList.add("_hover");
        } else {
          cursor.classList.remove("_hover");
        }
      } else if (e.type === "mousedown") {
        cursor.classList.add("_active");
      } else if (e.type === "mouseup") {
        cursor.classList.remove("_active");
      }
      cursorPointer
        ? (cursorPointer.style.transform = `translate3d(${e.clientX - cursorPointerStyle.width / 2}px, ${e.clientY - cursorPointerStyle.height / 2}px, 0)`)
        : null;
      cursorShadow
        ? (cursorShadow.style.transform = `translate3d(${e.clientX - cursorShadowStyle.width / 2}px, ${e.clientY - cursorShadowStyle.height / 2}px, 0)`)
        : null;
    }

    window.addEventListener("mouseup", mouseActions);
    window.addEventListener("mousedown", mouseActions);
    window.addEventListener("mousemove", mouseActions);
    window.addEventListener("mouseout", mouseActions);
  }
}
//================================================================================================================================================================================================================================================================================================================
// Другие полезные функции ================================================================================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================================================================================
// FLS (Full Logging System)
export function FLS(message) {
  setTimeout(() => {
    if (window.FLS) {
      console.log(message);
    }
  }, 0);
}
// Получить цифры из строки
export function getDigFromString(item) {
  return parseInt(item.replace(/[^\d]/g, ""));
}
/**
 * Возвращает строковое представление числа с разделителями разрядов.
 *
 * @param {number} item - Число, для которого нужно получить формат с разделителями разрядов.
 * @param {string} [sepp=" "] - Разделитель разрядов. По умолчанию используется пробел.
 * @return {string} Строковое представление числа с разделителями разрядов.
 */
export function getDigFormat(item, sepp = " ") {
  return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
}
/**
 * Удаляет указанный класс у каждого элемента в заданном массиве.
 *
 * @param {Array} array - Массив элементов, у которых будет удален класс.
 * @param {string} className - Имя класса, который будет удален у каждого элемента.
 * @return {undefined} Эта функция не возвращает значения.
 */
export function removeClasses(array, className) {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className);
  }
}

// Добавить класс из всех элементов массива
/**
 * Добавляет указанный класс каждому элементу в заданном массиве.
 *
 * @param {Array} array - Массив элементов, к которым будет добавлен класс.
 * @param {string} className - Имя класса, которое будет добавлено каждому элементу.
 * @return {undefined} Эта функция не возвращает значения.
 */
export function addClasses(array, className) {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.add(className);
  }
}
// Уникализация массива
export function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}
// Функция получения индекса внутри родительского элемента
export function indexInParent(parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
}
// Функция проверяет, видим ли объект видимый
export function isHidden(el) {
  return el.offsetParent === null;
}
// Обработка медиа запросов по атрибутам
export function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(",")[0];
    }
  });
  // Инициализация объектов с медиа-запросами
  if (media.length) {
    const breakpointsArray = [];
    media.forEach((item) => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    let mdQueries = breakpointsArray.map(function (item) {
      return (
        "(" +
        item.type +
        "-width: " +
        item.value +
        "px)," +
        item.value +
        "," +
        item.type
      );
    });
    mdQueries = uniqArray(mdQueries);
    const mdQueriesArray = [];

    if (mdQueries.length) {
      mdQueries.forEach((breakpoint) => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // Объекты с необходимыми условиями
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia,
        });
      });
      return mdQueriesArray;
    }
  }
}
//================================================================================================================================================================================================================================================================================================================
export const throttle = (delay, fn) => {
  let last;
  let deferTimer;
  return (...args) => {
    const context = this;
    const now = +new Date();
    if (last && now < last + delay) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, delay);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};
