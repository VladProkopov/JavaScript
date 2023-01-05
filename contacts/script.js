class Contacts {
    lastId = 0;
    data = [];

    add(userData) {
        const user = new User(userData);
        if(!user || !user.get()) return;

        const userKeys = Object.keys(user.get());

        if(userKeys.length == 0) return;

        this.lastId++;
        user.id = this.lastId;

        this.data.push(user);
    }

    edit(id, dataUp) {
        if(!id) return;

        const user = this.data.find(item => item.id == id);

        if(!user) return;

        user.edit(dataUp);
    }

    remove(id) {
        if(!id) return;

        const newUser = this.data.filter(item => item.id != id);

        this.data = newUser;
    }

    get(id, print = false) {
        if(id> 0){
            const user = this.data.find(item => item.id== id);

            if(user) return print? user.get(): user;
        } else if(!id && print){

            this.data.forEach(item => console.log(item.get()));
            return;

        }
        return this.data;
    }

}

class User {
    dataNew = {};

    constructor(data) {
        if(!data) return;
        if(!data.name && !data.phone) return
        
        this.dataNew = data;
    }

    edit(dataUp) {
        if(!dataUp) return;
        if(!dataUp.name && !dataUp.phone) return

        this.dataNew = {...this.dataNew, ...dataUp};
    }

    get() {
        return this.dataNew;
    } 
}

class ContactsApp extends Contacts {
    titleH2 = null;
    inputName = null;
    inputPhone = null;
    inputEmail = null; 
    btnAdd = null;

    contactsForm = null;
    contactsList = null;


    editStatus = false;
    idUser  = null;

    constructor() {
        super();

        this.data = [];
        
        this.app('root');
    }

    app(id) {
        let dataExp = this.getCookie('dataExp');

        if(!dataExp) localStorage.removeItem('data');

        this.getStorage();
        if(this.get().length == 0) this.getData();

        const rootElem = document.querySelector('#' + id);
        rootElem.classList.add('contacts');

        if(!rootElem) return;

        this.contactsForm = rootElem.querySelector('.contacts__form');
        this.contactsList = rootElem.querySelector('.added__contacts');

        if(!this.contactsForm || !this.contactsList) return;

        this.titleH2 = document.createElement('h2');
        this.titleH2.innerHTML = 'Add contact';

        this.inputName = document.createElement('input');
        this.inputName.type = 'text';
        this.inputName.name = 'contact_name';
        this.inputName.placeholder = 'Name*';

        this.inputPhone = document.createElement('input');
        this.inputPhone.type = 'text';
        this.inputPhone.name = 'contact_phone';
        this.inputPhone.placeholder = 'Phone*';

        this.inputEmail = document.createElement('input');
        this.inputEmail.type = 'text';
        this.inputEmail.name = 'contact_email';
        this.inputEmail.placeholder = 'Email';

        this.btnAdd = document.createElement('button');
        this.btnAdd.innerHTML = 'Add';

        this.contactsForm.append(this.titleH2, this.inputName, this.inputPhone, this.inputEmail, this.btnAdd);

        this.btnAdd.addEventListener('click', () => {
            this.onAdd();
        })

        this.btnAdd.addEventListener('click', () => {
            this.onSave(event);
        })

        this.update();
    }

    update() {
        this.data = this.get();

        this.contactsList.innerHTML = '';
        
        this.data.forEach(user => {
            let id = user.id;
            user = user.get();

            const userElem = document.createElement('li');

            const contactEdit = document.createElement('button');
            contactEdit.innerHTML = 'Edit';

            const contactRemove = document.createElement('button');
            contactRemove.innerHTML = 'Remove';


            if(user.name) userElem.innerHTML += `<h3>Name: ${user.name}</h2>`;
            if(user.phone) userElem.innerHTML += `<span>Phone: ${user.phone}</span><br>`;
            if(user.email) userElem.innerHTML += `<span>Email: ${user.email}</span>`;

            userElem.append(contactEdit, contactRemove);
            this.contactsList.append(userElem);

            contactRemove.addEventListener('click', (event) => {
                this.onRemove(event, id);
            })

            contactEdit.addEventListener('click', () => {
                this.onEdit(id);
            })
        })

        this.setStorage();
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    setCookie(name, value, options = {}) {
        options = {
            path: '/',
            ...options 
        };
    
        if (options.expires instanceof Date) { 
            options.expires = options.expires.toUTCString();
        }
         
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
        for (let optionKey in options) { updatedCookie += "; " + optionKey;
         
        let optionValue = options[optionKey];
    
        if (optionValue !== true) { 
            updatedCookie += "=" + optionValue; 
        }
    }
        document.cookie = updatedCookie; 
    }

    setStorage() {
        const dataTmp = this.data.map(item => {
            return {...{id: item.id}, ...item.get()}
        });

        const dataJson = JSON.stringify(dataTmp)

        if(!dataJson) return;

        localStorage.setItem('data', dataJson);

        if(dataJson && dataJson != '[]') this.setCookie('dataExp', '1', {"max-age": 864000});
    }

    getStorage() {
        let tmpData = localStorage.getItem('data');

        tmpData = JSON.parse(tmpData);

        if(!tmpData) return;

        tmpData.forEach(item => {
            delete item.id;

            this.add(item);
        })
    }

    getData () {

        fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            if(response.status == 200) return response.json();
        })
        .then(body => {
            if(body && body.length > 0) {
                let dataTmp = body.map(item => {
                    return {
                        name: item.name,
                        phone: item.phone,
                        email: item.email
                    };
                })

                dataTmp.forEach(item => {
                    this.add(item);
                });

                this.update();
            }
        });
    }

    onAdd() {
        if(!this.inputName && !this.inputPhone) return;
        if(this.editStatus) return;

        this.name = this.inputName.value;
        this.phone = this.inputPhone.value;
        this.email = this.inputEmail.value;

        this.add({
            name: this.name,
            phone: this.phone,
            email: this.email
        })

        this.update();

        this.inputName.value = '';
        this.inputPhone.value = '';
        this.inputEmail.value = '';
    }

    onSave(event) {
        if(!this.idUser || !this.editStatus) return;
        if(!this.inputName && !this.inputPhone) return;

        this.name = this.inputName.value;
        this.phone = this.inputPhone.value;
        this.email = this.inputEmail.value;
        
        this.user = this.get(this.idUser);

        if(!this.user) return;

        this.user.edit({
            name: this.name,
            phone: this.phone,
            email: this.email
        })

        this.editStatus= false;
        this.editId= null;

        this.update();

        this.inputName.value = '';
        this.inputPhone.value = '';
        this.inputEmail.value = '';
    }

    onEdit(id) {
        this.user = this.get(id, true);

        if(!this.user) return;

        this.editStatus = true;
        this.idUser = id;

        this.inputName.value = '';
        this.inputPhone.value = '';
        this.inputEmail.value = '';

        if (this.user.name && this.user.name.length > 0)this.inputName.value = this.user.name;
        if (this.user.phone && this.user.phone.length > 0)this.inputPhone.value = this.user.phone;
        if (this.user.email && this.user.email.length > 0)this.inputEmail.value = this.user.email;
    }

    onRemove(event, id) {
        this.remove(id);
        this.update();
    }

}

new ContactsApp();