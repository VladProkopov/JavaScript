const Lang = function() {

    let data = [
        { word: 'стол', translate: 'table' },
        { word: 'собака', translate: 'dog' },
        { word: 'школа', translate: 'school' },
        { word: 'автомобиль', translate: 'car' }
    ];

    let wordInput = null;
    let translateInput = null;
    let listElem = null;

    let formEditFlag = false;

    this.init = (selectorId) => {
        const mainElem = document.querySelector(`#${selectorId}`);

        if (!mainElem) return;

        const formElem = document.createElement('div');
        formElem.classList.add('lang__form');

        wordInput = document.createElement('input');
        wordInput.placeholder = 'Word';

        translateInput = document.createElement('input');
        translateInput.placeholder = 'Translate';

        const addBtn = document.createElement('button');
        addBtn.innerHTML = '+';
        
        listElem = document.createElement('ul');
        listElem.classList.add('lang__list');

        formElem.append(wordInput, translateInput, addBtn);
        mainElem.append(formElem, listElem);

        addBtn.addEventListener('click', add);

        update();
    };

    const add = () => {
        if (!wordInput || 
            !translateInput ||
            wordInput.value.length == 0 ||
            translateInput.value.length == 0) return;
            
        const wordData = {
            word: wordInput.value,
            translate: translateInput.value
        };

        data.push(wordData);

        wordInput.value = '';
        translateInput.value = '';

        update();
    };

    const remove = (index = null) => {
        const item = get(index);

        if (!item) return;

        data.splice(index, 1);

        update();
    };

    const update = () => {
        listElem.innerHTML = '';
        formEditFlag = false;

        data.forEach((item, index) => {
            const liElem = document.createElement('li');
            liElem.classList.add('lang__item');
            
            const wordElem = document.createElement('span');
            wordElem.classList.add('lang__word');

            wordElem.innerHTML = item.word;
            
            const translateElem = document.createElement('span');
            translateElem.classList.add('lang__translate');

            translateElem.innerHTML = item.translate;

            const listenBtn = document.createElement('button');
            listenBtn.innerHTML = 'Listen';

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = 'X';

            liElem.append(wordElem, translateElem, listenBtn, removeBtn);
            listElem.append(liElem);

            listenBtn.addEventListener('click', () => {
                listen(index);
            });

            removeBtn.addEventListener('click', () => {
                remove(index);
            });

            liElem.addEventListener('click', () => {
                if (formEditFlag) return;
                
                edit(index, liElem);

                formEditFlag = true;
            }, {once: true});
            
        });
    };

    const get = (index = null) => {
        if (!data || data.length == 0) return [];

        if (index >= 0) {
            return data[index];
        }

        return data;
    };

    const listen = (index = null) => {
        const item = get(index);

        if (!item) return;

        let speech = new SpeechSynthesisUtterance(item.translate);
		speech.voice = window.speechSynthesis.getVoices()[2];
		window.speechSynthesis.speak(speech);
    }

    const edit = (index = null, elem = null) => {
        let item = get(index);

        if (!item || !elem) return;

        listElem.querySelectorAll('.lang__form_edit').forEach(item => item.remove());
        listElem.querySelectorAll('li').forEach(item => item.classList.remove('active'));

        const editFormElem = document.createElement('div');
        editFormElem.classList.add('lang__form_edit');

        const wordInput = document.createElement('input');
        wordInput.value = item.word;

        const translateInput = document.createElement('input');
        translateInput.value = item.translate;

        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = 'Save';

        elem.classList.add('active');

        editFormElem.append(wordInput, translateInput, saveBtn);
        elem.append(editFormElem);

        saveBtn.addEventListener('click', () => {
            if (wordInput.value.length == 0 ||
                translateInput.value.length == 0) return;

            let wordData = {
                word: wordInput.value,
                translate: translateInput.value
            };

            data[index] = {...item, ...wordData};

            update();
        });
    };

    this.init('root');

}

window.addEventListener('load', () => { new Lang(); });