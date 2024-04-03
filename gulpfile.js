import gulp from "gulp";
import { plugins } from "./config/gulp-plugins.js";
import { readFile, writeFile } from "node:fs/promises";
import { path } from "./config/gulp-settings.js";
import htmlBemValidator from "gulp-html-bem-validator";
import { htmlValidator } from "gulp-w3c-html-validator";

// Передаємо значення у глобальну змінну
global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
  isWebP: !process.argv.includes("--nowebp"),
  isImgOpt: !process.argv.includes("--noimgopt"),
  isFontsReW: process.argv.includes("--rewrite"),
  gulp: gulp,
  path: path,
  plugins: plugins,
};

// Імпорт завдань
import { reset } from "./config/gulp-tasks/reset.js";
import { html } from "./config/gulp-tasks/html.js";
import { css } from "./config/gulp-tasks/css.js";
import { js } from "./config/gulp-tasks/js.js";
import { jsDev } from "./config/gulp-tasks/js-dev.js";
import { images } from "./config/gulp-tasks/images.js";
import { ftp } from "./config/gulp-tasks/ftp.js";
import { zip } from "./config/gulp-tasks/zip.js";
import { sprite } from "./config/gulp-tasks/sprite.js";
import { gitignore } from "./config/gulp-tasks/gitignore.js";
import { otfToTtf, ttfToWoff, fonstStyle } from "./config/gulp-tasks/fonts.js";
import { glob } from "glob";

// Последовательная обработка шрифтов
const fonts = gulp.series(reset, otfToTtf, ttfToWoff, fonstStyle);
// Основные задачи будем выполнять параллельно после обработки шрифтов
const devTasks = gulp.parallel(fonts, gitignore);
// Основные задачи будем выполнять параллельно после обработки шрифтов
const buildTasks = gulp.series(
  fonts,
  jsDev,
  js,
  gulp.parallel(html, css, images, gitignore)
);

// Експорт завдань
export { html };
export { css };
export { js };
export { jsDev };
export { images };
export { fonts };
export { sprite };
export { ftp };
export { zip };

// Побудова сценаріїв виконання завдань
const development = gulp.series(devTasks);
const build = gulp.series(buildTasks);
const deployFTP = gulp.series(buildTasks, ftp);
const deployZIP = gulp.series(buildTasks, zip);

// Експорт сценаріїв
export { development };
export { build };
export { deployFTP };
export { deployZIP };
const FIND_STRINGS_JS = {
  '.p="/"': ".p=baseUrl",
  '__webpack_require__.p = "/";': "__webpack_require__.p=baseUrl",
};
// __webpack_require__.p
const replacePath = async () => {
  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  try {
    glob("dist/**/*.js").then(async (files) => {
      console.log("flies", files);
      for (const file of files) {
        console.log("file", file);
        let fileContent = await readFile(file, "utf8");

        Object.entries(FIND_STRINGS_JS).forEach(([key, value]) => {
          fileContent = fileContent.replace(
            new RegExp(escapeRegExp(key), "g"),
            value
          );
        });

        await writeFile(file, fileContent, "utf8");
      }
    });
    // glob("dist/**/*.js", {}, async (error, files) => {
    //   // eslint-disable-next-line no-restricted-syntax

    // });

    // eslint-disable-next-line no-console
    console.log("\x1b[32m%s\x1b[0m", "BUILD END!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Ошибка при чтении директории`);
  }
};
/* TEST */
const validateBEM = () =>
  gulp
    .src([`dist/*.html`, `!dist/popup-*.html`, `!dist/responses-*.html`])
    .pipe(htmlBemValidator());
const validateHTML = () =>
  gulp
    .src([`dist/*.html`, `!dist/popup-*.html`, `!dist/responses-*.html`])
    .pipe(
      htmlValidator.analyzer({
        ignoreMessages: new RegExp(
          "^Section lacks heading. Consider using “h2”-“h6”|^Element “img” is missing required attribute “src”.|Element “source” is missing required attribute “srcset”"
        ),
      })
    )
    .pipe(
      htmlValidator.reporter({
        throwErrors: true,
      })
    );

export const test = gulp.series(validateBEM, validateHTML);
export const afterBuild = gulp.parallel(replacePath);
// Виконання сценарію за замовчуванням
gulp.task("default", development);
