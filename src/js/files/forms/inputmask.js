/* Маски для полів (у роботі) */

// Підключення функціоналу "Чертоги Фрілансера"
// Підключення списку активних модулів
import { flsModules } from '../modules.js';

// Підключення модуля
import 'inputmask/dist/inputmask.min.js';

export const initMasks = () => {
  const inputMasks = document.querySelectorAll('input._phone-mask');
  if (inputMasks.length) {
    flsModules.inputmask = Inputmask('89999999999').mask(inputMasks);
  }
};
