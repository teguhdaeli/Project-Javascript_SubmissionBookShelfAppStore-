let books = [];

window.addEventListener('load', () => {
  books = JSON.parse(localStorage.getItem('BOOKS_APP')) || [], updateUI(books);
  
  $('form').onsubmit = addBook;
  
  $('.toolbar>.form-input').onchange = searchData;
  
  $('#isComplete').onclick = (e) => {
    $('form>button').innerText = e.target.checked ? 'Simpan buku yang sudah dibaca' : 'Simpan buku yang belum dibaca';
  };
  
  $('#tambahBuku').onclick = () => {
    const isEdit  = $('form').id;
    const isShown = !$('.input-data').classList.contains('hide');
    if(isShown && isEdit) {
      if(confirm('Yakin gak jadi edit data?')) {
        $('.input-data>h3').innerText = 'Tambah Data';
        $('form').removeAttribute('id');
        $('form').reset();
      }
    } else {
      $('.input-data').classList.toggle('hide');
    }
  };
});


function updateUI(books) {
  const finished   = $('#completeBookshelfList'), 
        unfinished = $('#incompleteBookshelfList');
        
  finished.innerHTML = '', unfinished.innerHTML = '';
  
  for(let BOOKS_APP of books) {
    let item   = $new('div', { id: BOOKS_APP.id, css: ['buku'] });
    let title  = $new('h4', { css: ['p','penulis'], text: `${BOOKS_APP.title}` });
    let author = $new('p', { css: ['p','penulis'], text: `Penulis: ${BOOKS_APP.author}` });
    let year   = $new('p', { css: ['p','penulis'], text: `Tahun: ${BOOKS_APP.year}` });
    let group  = $new('button', { css: ['button', 'button-success'], text: `${ BOOKS_APP.isComplete ? 'Belum selesai' : 'Udah dibaca'}`, action: moveGroup });
    let remove = $new('button', { css: ['button', 'button-danger'], text: 'Hapus', action: removeBook });
    let edit   = $new('button', { css: ['button', 'button-warning'], text: 'Edit', action: editBook });
    
    [title, author, year, group, remove, edit].forEach(e => {
      item.appendChild(e);
    });
    
    BOOKS_APP.isComplete ? finished.appendChild(item) : unfinished.appendChild(item);
  }
  
  !finished.hasChildNodes() ? finished.innerHTML = 'Rak Buku Kosong' : 0;
  !unfinished.hasChildNodes() ? unfinished.innerHTML = 'Rak Buku Kosong' : 0;
}


function moveGroup(e) {
  const position = books.findIndex(i => i.id == e.target.parentNode.id);
  books[position].isComplete = !books[position].isComplete;
  saveData();
  updateUI(books);
}


function removeBook(e) {
  if(confirm('Apakah anda yakin, Menghapus buku dari rak ini ?')) {
    const position = books.findIndex(i => i.id == e.target.parentNode.id);
    books.splice(position, 1);
    saveData();
    updateUI(books);
  }
}


function editBook(e) {
  const position = books.findIndex(i => i.id == e.target.parentNode.id);
  
  $('#title').value  = books[position].title;
  $('#author').value = books[position].author;
  $('#year').value   = books[position].year;
  $('#isComplete').checked = books[position].isComplete;
  
  $('form').id = position;
  
  $('.input-data>h3').innerText = 'Edit Data';
  $('.input-data').classList.remove('hide');
  $('.input-data').scrollIntoView();
  
  $('#title').focus();
}


function addBook() {
  const position = $('form').id;
  
  let model = {
    id: +new Date(),
    title: $('#title').value,
    author: $('#author').value,
    year: $('#year').value,
    isComplete: $('#isComplete').checked
  }
  
  if(position) {
    books[position].title  = model.title;
    books[position].author = model.author;
    books[position].year   = model.year;
    books[position].isComplete = model.isComplete;
  } else {
    books.push(model);
  }
  
  saveData();
  updateUI(books);
}


function searchData(e) {
  e = e.target.value;
  
  updateUI(books.filter(BOOKS_APP => {
    return BOOKS_APP.title.toLowerCase().includes(e.toLowerCase());
  }));
}


function saveData() {
  localStorage.setItem('BOOKS_APP', JSON.stringify(books));
}


function $new(e,a) {
  e = document.createElement(e);
  a.id ? e.id = a.id : 0;
  a.text ? e.innerText = a.text : 0;
  a.action ? e.addEventListener('click', a.action) : 0;
  a.css ? a.css.forEach(css => e.classList.add(css)) : 0;
  return e;
}


function $(e) {
  e = document.querySelectorAll(e);
  return e.length >= 1 ? e[0] : e;
}