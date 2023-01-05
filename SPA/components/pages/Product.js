import { getData } from '../App.js';

class Page {
    async create(libs) {
        let id = location.href.split('/').pop();
       
        if (!id || isNaN(id)) return;

        let cart = libs[0];
        let cartWidget = libs[1];

        let product = await getData();
        product = product.find(item => item.id == id);

        this.elem = document.createElement('div');
        this.elem.classList.add('page');

        this.elem.innerHTML = `
            <div class="container">
                <div class="product__content">
                    <div class="product__image"><img src="${product.image}"></div>
                    <div class="product__description">
                        <h1>${product.title}</h1>
                        <div class="price">$${product.price}</div>
                        <div class="description">${product.description}</div>
                    </div>
                </div>
            </div>
        `;

        const btnCart = document.createElement('button');
        btnCart.classList.add('add_cart');
        btnCart.innerHTML = 'Add to cart';

        if (cart.add) btnCart.addEventListener('click', () => {
            cart.add(product.id);
            cart.updateWidget(cartWidget);
        });

        this.elem.querySelector('.product__description').append(btnCart);

        return this.elem;
    }

    async init(libs) {
        await this.create(libs);

        return this.elem;
    }
}

export default new Page();