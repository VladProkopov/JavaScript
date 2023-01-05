import { cart } from './pages/Cart.js';

function App() {

    const metaUtfElem = document.createElement('meta');
    metaUtfElem.setAttribute('charset', 'UTF-8');

    const metaViewportElem = document.createElement('meta');
    metaViewportElem.setAttribute('name', 'viewport');
    metaViewportElem.setAttribute('content', 'width=device-width, initial-scale=1.0');

    const titleElem = document.createElement('title');
    titleElem.innerText = 'Store';

    const cssElem = document.createElement('link');
    cssElem.setAttribute('rel', 'stylesheet');
    cssElem.href = '/css/style.css';

    document.head.append(metaUtfElem, metaViewportElem, titleElem, cssElem);
    
    const create = function() {
        let elem = document.createElement('div');
        elem.classList.add('app');

        return elem;
    }

    const render = async function() {
        const elem = create();

        const Header = await import('./Header.js')
        .then(module => module.default);

        let cartWidget = cart.widget();
        Header.querySelector('.header__nav').after(cartWidget);

        elem.append(Header);
        cart.updateWidget(cartWidget);

        const Footer = await import('./Footer.js')
        .then(module => module.default);

        elem.append(Footer);

        document.querySelector('#root').append(elem);

        const Main = await import('./Main.js')
        .then(module => {
            return module.default.init([cart, cartWidget]);
        });
        
        Footer.before(Main);
    }();

    getData();
}

const getData = async function() {
    let localData = localStorage.getItem('data');
    if (localData) localData = JSON.parse(localData);
    
    if (localData && localData.length > 0) {
        return localData;
    }

    localData = await fetch('https://fakestoreapi.com/products/')
    .then(response => response.text())
    .then(data => {
        localStorage.setItem('data', data);
        location.reload();
    });
};

export { getData };
export default new App();