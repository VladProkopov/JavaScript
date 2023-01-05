import { getData } from '../App.js'; 

class Cart {
    add(id) {
        let dataCart = this.get();

        if (dataCart.includes(id)) return;

        dataCart.push(id);

        this.setLocal(dataCart);
    }

    remove(id, cartWidget) {
        if(isNaN(id) || !id) return;

        let dataCart = this.get();
        dataCart = dataCart.filter(item => +item != +id);

        this.setLocal(dataCart);
    }

    setLocal(dataCart) {
        if (!dataCart) dataCart = '';

        dataCart = JSON.stringify(dataCart);
        
        if (!dataCart) return;

        localStorage.setItem('dataCart', dataCart);
    }

    get() {
        let dataCart = localStorage.getItem('dataCart');
        if (dataCart && dataCart.length > 0) dataCart = JSON.parse(dataCart);
        
        if (dataCart && dataCart.length > 0) return dataCart;

        return [];
    }
    
    async updateWidget(widget) {
        let data = await getData();

        let dataCart = this.get();

        data = data.filter(item => dataCart.includes(item.id));

        let totalPrice = 0;

        data.forEach(item => {
            totalPrice += +item.price;
        });

        totalPrice = totalPrice.toFixed(2);

        let countElem = widget.querySelector('.header__cart_count');
        countElem.innerHTML = dataCart.length;

        let amountElem = widget.querySelector('.header__cart_amount');
        amountElem.innerHTML = '$' + totalPrice;
    }

    widget() {
        const elem = document.createElement('div');
        elem.classList.add('header__cart');

        elem.innerHTML = `
            <a href="/#cart"><img src="./img/carts.png" /></a>
            <span class="header__cart_count">0</span>
            <span class="header__cart_amount">$0</span>
        `;

        return elem;
    }

    async updateProducts(libs) {
       if(!this.data) this.data = await getData();

        let dataCart = this.get();

        this.data = this.data.filter(item => {
            if(!item.quantity) item.quantity = 1;
            return dataCart.includes(item.id)});

        const listElem = this.elem.querySelector('.cart__list');

        if (!listElem) return;

        listElem.innerHTML = '';

        let cartWidget = libs[1];

        const totalElem = document.createElement('div');
        totalElem.classList.add('cart__total');

        let totalPrice = 0;

        this.data.forEach(product => {
            let price = +product.price * +product.quantity;
            totalPrice += +price;

            const liElem = document.createElement('li');
            liElem.classList.add('cart__item');

            liElem.innerHTML = `
                <a class="image" href="/#product/${product.id}">
                    <img width="50" src="${product.image}">
                </a>
                <span class="title"><a href="/#product/${product.id}">${product.title}</a></span>
                <span class="price">$${product.price}</span>
            `;

            const quantityInput = document.createElement('input');
            quantityInput.setAttribute('type', 'number');
            quantityInput.setAttribute('min', '1');
            quantityInput.setAttribute('max', '100');
            quantityInput.value = product.quantity;

            const btnRemove = document.createElement('button');
            btnRemove.classList.add('remove');
            btnRemove.innerHTML = 'X';

            btnRemove.addEventListener('click', () => {
                totalElem.remove();
                this.remove(product.id);

                this.updateProducts(libs);
                this.updateWidget(cartWidget); 
            });

            quantityInput.addEventListener('change', (event) => {
                const value = +event.target.value;
                if(!value || isNaN(value)) return;

                product.quantity = value;

                totalElem.remove();
                this.updateProducts(libs);
            })

            liElem.append(quantityInput, btnRemove);
            listElem.append(liElem);
        });

        totalPrice = totalPrice.toFixed(2);
        totalElem.innerHTML = `Total $${totalPrice}`;

        listElem.after(totalElem);
    }
}

class Page extends Cart {
    create() {
        this.elem = document.createElement('div');
        this.elem.classList.add('page');

        this.elem.innerHTML = `
            <div class="container">

                <h1>Cart</h1>
                <ul class="cart__list"></ul>

            </div>
        `;

        return this.elem;
    }

    async init(libs) {
        this.create();

        this.updateProducts(libs);

        return this.elem;
    }
}

const cart = new Page();

export { cart };
export default cart;

