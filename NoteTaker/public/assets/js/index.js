let noteTitle;
let noteContents;
let saveAllNotesButton;
let newNoteButton;
let noteList;

//assign elements to variables
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteContents = document.querySelector('.note-textarea');
  saveAllNotesButton = document.querySelector('.save-note');
  newNoteButton = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

//hideElement and showElement elements

const showElement = elem => {
  elem.style.display = 'inline';
};

const hideElement = elem => {
  elem.style.display = 'none';
};

let currentNote = {};

const getAllNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const saveAllNotes = note =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

const deleteAllNotes = id =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const currentNoteHandler = () => {
  hideElement(saveAllNotesButton);

  if (currentNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteContents.setAttribute('readonly', true);
    noteTitle.value = currentNote.title;
    noteContents.value = currentNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteContents.removeAttribute('readonly');
    noteTitle.value = '';
    noteContents.value = '';
  }
};

const noteSaveHandler = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteContents.value
  };
  saveAllNotes(newNote).then(() => {
    renderTheNotes();
    currentNoteHandler();
  });
};

const deleteAllNotesHandler = e => {

  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (currentNote.id === noteId) {
    currentNote = {};
  }

  deleteAllNotes(noteId).then(() => {
    renderTheNotes();
    currentNoteHandler();
  });
};

const viewNoteHandler = e => {
  e.preventDefault();
  currentNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  currentNoteHandler();
};

const viewNewNoteHandler = e => {
  currentNote = {};
  currentNoteHandler();
};

const saveButtonHandler = () => {
  if (!noteTitle.value.trim() || !noteContents.value.trim()) {
    hideElement(saveAllNotesButton);
  } else {
    showElement(saveAllNotesButton);
  }
};

const noteListRenderer = async notes => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach(el => (el.innerHTML = ''));
  }

  let noteListItems = [];

  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', viewNoteHandler);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', deleteAllNotesHandler);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach(note => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach(note => noteList[0].append(note));
  }
};

const renderTheNotes = () => getAllNotes().then(noteListRenderer);

if (window.location.pathname === '/notes') {
  saveAllNotesButton.addEventListener('click', noteSaveHandler);
  newNoteButton.addEventListener('click', viewNewNoteHandler);
  noteTitle.addEventListener('keyup', saveButtonHandler);
  noteContents.addEventListener('keyup', saveButtonHandler);
}

renderTheNotes();
