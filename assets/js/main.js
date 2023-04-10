
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const categoryID = urlParams.get('scat');

const ed = CKEDITOR.replace('editor1', {
  language: 'tr',
  width: 302,
  height: 400,
  toolbar: [
      { name: 'basicstyles', items: [ 'Font','FontSize','Bold','Italic','Underline','Strike','Subscript','Superscript'] },
      //'/',
      { name: 'align', items: [ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
      { name: 'save', items: [ 'savebtn','Undo','Redo' ] },
      { name: 'clipboard', items: [ 'Cut','Copy','Paste','PasteText','PasteFromWord'] },
      { name: 'document', items: [ 'Find','Replace'] },
      { name: 'lists', items: [ 'NumberedList','BulletedList'] },
      { name: 'insert', items: [ 'Image','Table','Smiley','SpecialChar'] },
      '/',
  ],
});


const saveButton = document.getElementsByClassName('savebutton')[0];

saveButton.onclick = () =>{
  saveButton.setAttribute('disabled', true);
  const label = document.getElementById('headerInput');
  const textArea = CKEDITOR.instances["editor1"];
  const inner = textArea.getData();

  if(label.value.length < 1){
    alert('Lütfen içerik başlığı giriniz');
    saveButton.removeAttribute('disabled');
    return;
  }

  if(inner.trim() == ""){
    alert('İçerik doldurulmadı. Boş pdf oluşturulamaz!');
    saveButton.removeAttribute('disabled');
    return;
  }

  const formData = new FormData();
  formData.append('categoryID', categoryID);
  formData.append('contentHeader', label.value);
  formData.append('fileType', 'html');
  formData.append('file',  new Blob([inner], {type: 'text/html'}));

  const request = new XMLHttpRequest();
  request.open('POST', 'https://api.buhikayesenin.com/insertNewContent');
  request.withCredentials = true;
  // request.open('POST', 'http://localhost:2020/insertNewContent');
  request.send(formData);

  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(this.responseText);
      if(response['task'] == true){
        window.location.href = response['redirect'];
      }
      else{
        alert(response['err']['msg']);
        saveButton.removeAttribute('disabled');
      }
    }
  };
  
}