class Page {
    create() {
        this.elem = document.createElement('div');
        this.elem.classList.add('page');

        this.elem.innerHTML = `
            <div class="container">

                <h1>Contact</h1>
                <p>Contact content</p>

            </div>
        `;

        return this.elem;
    }

    init() {
        this.create();

        return this.elem;
    }
}

export default new Page().init();