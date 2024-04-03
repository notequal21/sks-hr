import { flsModules } from "./modules.js";

// Пример чанк импорта fslightbox
// export default async () => {
//   const el = document.querySelector('[data-fslightbox]');
//   if (!el) return;
//   await import(/* webpackChunkName: "fslightbox" */ 'fslightbox');
//   window.FsLightbox();
// };

// Пример чанк импорта для подключения модуля без названия
// export default async () => {
//   if (!tipItems) return;
//   const { default: Tippy } = await import(
//     /* webpackChunkName: "tippy" */ 'tippy.js'
//   );

// };
