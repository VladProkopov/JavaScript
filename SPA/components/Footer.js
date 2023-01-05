class Footer {
    create() {
        this.elem = document.createElement('footer');
        this.elem.classList.add('footer');

        this.elem.innerHTML = `
            <div class="container">

                <div class="footer__logo">
                    <a href="/"><img src="/img/rhombus.png" /></a>
                </div>

                <div class="footer__contacts">
                    My Company<br>
                    Libknehta 68 str., Minsk<br>
                    +375296370080
                </div>

            </div>
        `;

        return this.elem;
    }

    init() {
        this.create();

        return this.elem;
    }
}

export default new Footer().init();