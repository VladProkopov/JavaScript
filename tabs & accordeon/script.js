const accordeon = function() {
    let elems = document.querySelectorAll('.accordeon');

    const showHide = function() {
        let parentElem = this.closest('.accordeon');
        let allItems = parentElem.querySelectorAll('.accordeon__item');
        
        allItems.forEach(function(item) {
            item.classList.remove('active');
        })


        let parentItem = this.closest('.accordeon__item');
        

        parentItem.classList.add('active');
    };

    elems.forEach(function(elem) {
        let titles = elem.querySelectorAll('.accordeon__title');

        titles.forEach(function(title) {
            title.addEventListener('click', showHide);
        });
    });
}

const tabs = function() {
    let tabsElem = document.querySelectorAll('.tabs');

    if(tabsElem.length == 0) return;

    tabsElem.forEach(function(tabElem) {
        let tabsList = tabElem.querySelectorAll('.tabs__list li');
        let contentList = tabElem.querySelectorAll('.tabs__content li');

        if(tabsList.length != contentList.length) return;

        const show = function(id) {
            tabsList = [...tabsList];
            contentList = [...contentList];

            let currentTab = tabsList.find(function(tab) {
                return tab.dataset.id == id;
            })

            let currentContent = contentList.find(function(content) {
                return content.dataset.id == id;
            })

            if(!currentTab || !currentContent) return;

            currentTab.classList.add('active');
            currentContent.classList.add('active');
        }

        const hide = function() {
            tabsList.forEach(function(tab) {
                tab.classList.remove('active');
            })
            contentList.forEach(function(content) {
                content.classList.remove('active');
            })
        }

        tabsList.forEach(function(tab) {
            tab.addEventListener('click', function() {
                let id = this.dataset.id;
                
                if(!id) return;

                hide();
                show(id);
            })
        })
    });
};

window.addEventListener('load', function() {

    accordeon();
    tabs();

});