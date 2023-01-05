import { getData } from '../App.js';

class Page {
    create() {
        this.elem = document.createElement('div');
        this.elem.classList.add('page');

        this.elem.innerHTML = `
            <div class="container">

                <h1>Shop</h1>
                <ul class="catalog__list"></ul>

            </div>
        `;

        return this.elem;
    }

    async init(libs) {
        this.create();

        let cart = libs[0];
        let cartWidget = libs[1];

        const listElem = this.elem.querySelector('.catalog__list');

        let data = await getData();
        
        data.forEach(product => {
            const liElem = document.createElement('li');
            liElem.classList.add('catalog__item');

            liElem.innerHTML = `
                <a class="image" href="/#product/${product.id}"><img src="${product.image}"></a>
                <h3 class="title"><a href="/#product/${product.id}">${product.title}</a></h3>
                <div class="price">$${product.price}</div>
            `;

            const btnCart = document.createElement('button');
            btnCart.classList.add('add_cart');
            btnCart.innerHTML = 'Add to cart';

            if (cart.add) btnCart.addEventListener('click', () => {
                cart.add(product.id);
                cart.updateWidget(cartWidget);
            });

            liElem.append(btnCart);
            listElem.append(liElem);
        });

        return this.elem;
    }
}

export default new Page();