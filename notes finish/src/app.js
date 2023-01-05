const Note = function(dataNote) {
    let data = {};

    if (!dataNote) return;
    if (!dataNote.title && !dataNote.content) return;

    data = dataNote;

    this.edit = function(dataNote) {
        if (!dataNote) return;
        if (dataNote.title !== undefined && 
            dataNote.content !== undefined &&
            dataNote.title.length == 0 &&
            dataNote.content.length == 0
        ) return;

        data = {...data, ...dataNote};
    }

    this.get = function() {
        return data;
    }
};


const Notes = function() {
    let lastId = 0;

    let data = [];

    this.add = function(dataNote) {
        const note = new Note(dataNote);

        if (!note || !note.get) return;

        const noteKeys = Object.keys(note.get());

        if (noteKeys.length == 0) return;

        lastId++;
        note.id = lastId;

        data.push(note);
    }

    this.edit = function(id, dataNote) {
        if (!id) return;

        const note = this.get(id);

        if (!note) return;

        note.edit(dataNote);
    }

    this.remove = function(id) {
        if (!id) return;

        const newData = data.filter(item => item.id != id);
        
        data = newData;
    }

    this.get = function(id, print = false) {
        if (id > 0) {
            const note = data.find(item => item.id == id);

            if (note) {
                return print ? note.get() : note;
            }
        } else if (!id && print) {
            data.forEach(item => console.log(item.get()));
            return;
        }

        return data;
    }
};


/*
NotesUI
*/

const NotesUI = function() {
    Notes.apply(this);

    // this.add({ title: 'Title note 1' });
    // this.add({ title: 'Title note 2', content: 'Bla bla bla' });
    // this.add({ color: 'red', content: 'Content note 4' });
    // this.add({ content: 'Text note 3' });

    let data = [];

    let notesListElem = null,
        noteTitleInput = null,
        noteContentTextarea = null;

    let editStatus = false;
    let editId = null;


    const update = () => {
        data = this.get();

        notesListElem.innerHTML = '';

        data.forEach(note => {
            let id = note.id;
            note = note.get();

            const noteElem = document.createElement('li');
            noteElem.dataset.id = id;
            noteElem.classList.add('note');

            const noteCloseElem = document.createElement('button');
            noteCloseElem.classList.add('note__remove');
            noteCloseElem.innerHTML = '+';
            
            if (note.title) noteElem.innerHTML = `<h3 class="note__title">${note.title}</h3>`;

            if (note.content) noteElem.innerHTML += `<div class="note__content">${note.content}</div>`;

            noteElem.append(noteCloseElem);
            notesListElem.append(noteElem);

            noteCloseElem.addEventListener('click', (event) => {
                event.stopPropagation();

                onRemove(event, id);
            }, { once: true });

            noteElem.addEventListener('click', () => {
                // onEdit(id);
                onEdit2(id, noteElem);
            });


            // drag & drop

            noteElem.draggable = true;
            
            let dragElem = null;

            noteElem.addEventListener('dragstart', (event) => {
                // console.log('dragstart');

                dragElem = event.target;

                event.dataTransfer.setData('dragElem', id);

                event.target.classList.add('dragstart');
            });

            noteElem.addEventListener('dragend', (event) => {
                // console.log('dragend');
                
                event.target.classList.remove('dragstart');

                dragElem = null;
            });

            noteElem.addEventListener('drag', (event) => {
                // console.log('drag');
            });

            noteElem.addEventListener('dragenter', (event) => {
                // console.log('dragenter');

                let noteElem = event.target;

                if (!noteElem.classList.contains('note') || noteElem.nodeName != 'LI') {
                    noteElem = noteElem.closest('li.note');
                }

                if (dragElem == noteElem) return;

                noteElem.classList.add('dragenter');
            });

            noteElem.addEventListener('dragleave', (event) => {
                // console.log('dragleave');

                let parentNoteElem = event.fromElement.closest('li.note');

                if (parentNoteElem == dragElem) parentNoteElem = null;

                if (parentNoteElem == null) noteElem.classList.remove('dragenter');
            });

            noteElem.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            noteElem.addEventListener('drop', (event) => {
                // console.log('drop');

                let noteElem = event.target;

                if (!noteElem.classList.contains('note') || noteElem.nodeName != 'LI') {
                    noteElem = noteElem.closest('li.note');
                }

                const dragElemId = event.dataTransfer.getData('dragElem');
                let dragElem = notesListElem.querySelector(`[data-id="${dragElemId}"]`);

                if (dragElem == noteElem) return;

                noteElem.classList.remove('dragenter');

                noteElem.before(dragElem);
            });
        });

        setStorage();
    }

    function getCookie(name) { let matches = document.cookie.match(new RegExp( "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)" )); return matches ? decodeURIComponent(matches[1]) : undefined; }

    function setCookie(name, value, options = {}) { options = { path: '/', ...options }; if (options.expires instanceof Date) { options.expires = options.expires.toUTCString(); } let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value); for (let optionKey in options) { updatedCookie += "; " + optionKey; let optionValue = options[optionKey]; if (optionValue !== true) { updatedCookie += "=" + optionValue; } } document.cookie = updatedCookie; }

    const setStorage = () => {
        let dataTmp = data.map(item => {
            return {...{ id: item.id }, ...item.get()};
        });

        let dataJson = JSON.stringify(dataTmp);

        if (!dataJson) return;

        localStorage.setItem('data', dataJson);

        if (dataJson && dataJson != '[]') setCookie('dataExp', '1', { 'max-age': 86400 });
    }

    const getStorage = () => {
        let dataTmp = localStorage.getItem('data');

        dataTmp = JSON.parse(dataTmp);

        if (!dataTmp) return;

        dataTmp.forEach(item => {
            delete item.id;

            this.add(item);
        });
    }

    const getData = () => {
        console.log('get data');

        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
            if (response.status == 200) return response.json();
        })
        .then(body => {
            if (body && body.length > 0) {
                let dataTmp = body.map(item => {
                    return { title: item.title, content: item.body };
                });

                dataTmp.forEach(item => {
                    this.add(item);
                });

                update();
            }
        });
    }

    const onEdit = (id) => {
        const note = this.get(id, true);

        if (!note) return;

        editStatus = true;
        editId = id;

        noteTitleInput.value = '';
        noteContentTextarea.value = '';

        if (note.title && note.title.length > 0) noteTitleInput.value = note.title;
        if (note.content && note.content.length > 0) noteContentTextarea.value = note.content;
    }

    const onEdit2 = (id, noteElem) => {
        const note = this.get(id, true);

        if (!note) return;

        editStatus = true;
        editId = id;
        noteElem.classList.add('edit');

        document.querySelectorAll('.note__form_edit').forEach(elem => elem.remove());

        const formEditElem = document.createElement('div');
        formEditElem.classList.add('note__form_edit');
        
        const titleEditElem = document.createElement('div');
        titleEditElem.classList.add('note__form_edit_title');
        if (note.title && note.title.length > 0) titleEditElem.innerHTML = note.title;
        
        const contentEditElem = document.createElement('div');
        contentEditElem.classList.add('note__form_edit_content');
        if (note.content && note.content.length > 0) contentEditElem.innerHTML = note.content;

        const formCloseBtn = document.createElement('button');
        formCloseBtn.innerHTML = '+';

        formEditElem.append(titleEditElem, contentEditElem, formCloseBtn);
        document.body.append(formEditElem);

        titleEditElem.contentEditable = true;
        contentEditElem.contentEditable = true;

        titleEditElem.addEventListener('keyup', (event) => {
            onSave2(event, formEditElem, titleEditElem, contentEditElem);
        });

        contentEditElem.addEventListener('keyup', (event) => {
            onSave2(event, formEditElem, titleEditElem, contentEditElem);
        });

        formCloseBtn.addEventListener('click', () => {
            formEditElem.remove();
            editStatus = true;
            editId = null;

            noteElem.classList.remove('edit');
        });
    }

    const onSave = (event) => {
        if (!editId || !editStatus || event.code != 'Enter' || !event.ctrlKey) return;

        if (!noteTitleInput && !noteContentTextarea) return;
        
        const title = noteTitleInput.value;
        const content = noteContentTextarea.value;

        const note = this.get(editId);

        if (!note) return;

        note.edit({
            title: title,
            content: content
        });

        editStatus = false;
        editId = null;

        update();

        noteTitleInput.value = '';
        noteContentTextarea.value = '';
    }

    const onSave2 = (event, formElem, titleElem, contentElem) => {
        if (!editId || event.code != 'Enter' || !event.ctrlKey) return;

        if (!formElem) return;

        const title = titleElem.innerHTML;
        const content = contentElem.innerHTML;

        const note = this.get(editId);

        if (!note) return;

        note.edit({
            title: title,
            content: content
        });

        formElem.remove();
        editStatus = true;
        editId = null;

        update();
    }

    const onRemove = (event, id) => {
        this.remove(id);
        update();
    }

    const onAdd = (event) => {
        if (editStatus || event.code != 'Enter' || !event.ctrlKey) return;

        if (!noteTitleInput && !noteContentTextarea) return;

        const title = noteTitleInput.value;
        const content = noteContentTextarea.value;

        this.add({
            title: title,
            content: content
        });

        update();

        noteTitleInput.value = '';
        noteContentTextarea.value = '';
    }

    const init = (idElem) => {
        let dataExp = getCookie('dataExp');

        if (!dataExp) localStorage.removeItem('data');

        getStorage();

        if (this.get().length == 0) getData();

        const rootElem = document.querySelector('#' + idElem);

        if (!rootElem) return;

        const notesFormElem = rootElem.querySelector('.notes__form');
        notesListElem = rootElem.querySelector('.notes__list');

        if (!notesFormElem || !notesListElem) return;

        noteTitleInput = document.createElement('input');

        noteTitleInput.type = 'text';
        noteTitleInput.name = 'note_title';
        noteTitleInput.placeholder = 'Title';

        noteContentTextarea = document.createElement('textarea');
        
        noteContentTextarea.name = 'note_content';
        noteContentTextarea.placeholder = 'Content';

        notesFormElem.append(noteTitleInput, noteContentTextarea);

        noteTitleInput.addEventListener('keyup', onAdd);
        noteContentTextarea.addEventListener('keyup', onAdd);

        // noteTitleInput.addEventListener('keyup', onSave);
        // noteContentTextarea.addEventListener('keyup', onSave);

        update();
    };

    init('root');
}

new NotesUI();