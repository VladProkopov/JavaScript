class Main {
    create() {
        this.elem = document.createElement('main');
        this.elem.classList.add('main');

        return this.elem;
    }

    routing() {
        const route = () => {
            let hash = location.hash;
            hash = hash.slice(1);

            let filename = '404';

            if (hash.length == 0 &&
            (location.pathname == '/' || location.pathname == '/index.html')) {
                    filename = 'home';
            } else if (hash.length > 0) {
                filename = hash;

                if (hash.includes('product')) {
                    filename = '404';

                    hash = hash.split('/')[0];

                    if (hash && hash.length > 0) filename = hash;
                }
            }

            import(`./pages/${filename}.js?t=${Date.now()}`)
            .then(module => {
                
                if (!module.default) return;

                this.elem.innerHTML = '';

                if (module.default.init) {
                    let moduleElem = module.default.init([this.cart, this.cartWidget]);

                    if (moduleElem.then) {
                        moduleElem
                        .then(elem => {
                            this.elem.append(elem);
                        });
    
                        return;
                    }
                }

                if (module.default.then) {
                    module.default
                    .then(elem => {
                        this.elem.append(elem);
                    });

                    return;
                }
                
                this.elem.append(module.default);

            });
        }

        window.addEventListener('hashchange', route);
        route();
        
        const aHomeElems = document.querySelectorAll('a[href="/"]');

        aHomeElems.forEach(a => {
            a.addEventListener('click', (event) => {
                event.preventDefault();
                history.pushState(null, null, '/');
                route();
            });
        });
    }

    init(libs) {
        this.cart = libs[0];
        this.cartWidget = libs[1];

        this.routing();
        this.create();

        return this.elem;
    }
}

export default new Main();