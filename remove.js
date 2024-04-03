import fs from "fs";

const blockName = process.argv[2];

const uniqueArray = (arr) => {
  const obj = {};

  for (let i = 0; i < arr.length; i += 1) {
    const str = arr[i];
    obj[str] = true;
  }

  return Object.keys(obj);
};

const extensions = uniqueArray(process.argv.slice(3) || []);

const removeImport = async (filePath, blockName) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const importString = `@import "../components/${blockName}/${blockName}";`;
    const lines = data.split("\n");
    const updatedLines = lines.filter((line) => line.trim() !== importString);

    const updatedData = updatedLines.join("\n");

    fs.writeFile(filePath, updatedData, (error) => {
      if (error) {
        console.error(error);
      }
    });
  });
};

const removeFile = async (filePath, format) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Файл ${format} удалён`);
  });
};

const removeInit = async () => {
  if (blockName) {
    const dirPath = `src/components/${blockName}/`;

    if (fs.existsSync(dirPath)) {
      if (extensions.includes("all")) {
        extensions.push("scss", "html", "js");

        extensions.splice(
          extensions.findIndex((ext) => ext === "all"),
          1
        );
      }

      extensions.forEach((extension) => {
        const filePath = `${dirPath + blockName}.${extension}`;

        if (extension === "scss") {
          removeImport("./src/scss/imports.scss", blockName);

          if (fs.existsSync(filePath)) {
            removeFile(filePath, "scss");
          }
        }

        if (extension === "js") {
          removeImport("./src/js/imports.js", `/${blockName}';`);

          if (fs.existsSync(filePath)) {
            removeFile(filePath, "js");
          }
        }
      });

      fs.readdir(dirPath, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }

        if (files.length === 0) {
          fs.rmdir(dirPath, (error) => {
            if (error) {
              console.error(error);
            }
          });
        }
      });
    } else {
      console.log("Компонент не существует");
    }
  } else {
    console.log("Отмена: не указан блок"); // eslint-disable-line
  }
};

if (extensions.length === 0) {
  console.log("Укажите что нужно удалить");
} else {
  removeInit();
}
