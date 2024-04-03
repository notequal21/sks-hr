if (document.querySelector('.form-body__file')) {
  const fileLabel = document.querySelector('.form-body__file');
  const fileInput = fileLabel.querySelector('input');
  const fileText = fileLabel.querySelector('.form-body__file-text');
  const defaultText = fileText.innerHTML;

  fileInput.addEventListener('change', () => {
    var txt = '';
    if ('files' in fileInput) {
      if (fileInput.files.length == 0) {
        txt = defaultText;
      } else {
        for (var i = 0; i < fileInput.files.length; i++) {
          var file = fileInput.files[i];
          if ('name' in file) {
            txt += file.name;
          }
        }
      }
    }
    fileText.innerHTML = txt;
  });
}
