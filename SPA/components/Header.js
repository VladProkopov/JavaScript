class Header {
    create() {
        this.elem = document.createElement('header');
        this.elem.classList.add('header');

        this.elem.innerHTML = `
            <div class="container">

                <div class="header__logo">
                    <a href="/"><img src="/img/rhombus.png"></a>
                </div>

                <nav class="header__nav">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/#shop">Shop</a></li>
                        <li><a href="/#contact">Contact</a></li>
                    </ul>
                </nav>

            </div>
        `;

        return this.elem;
    }

    init() {
        this.create();

        return this.elem;
    }
}

export default new Header().init();