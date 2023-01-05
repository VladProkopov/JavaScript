const filter = function() {
    const portfolioFilters = document.querySelectorAll('.portfolio__filter li');

    const portfolioLists = document.querySelectorAll('.portfolio__list li');

    portfolioFilters.forEach(function(elems) {
        elems.addEventListener('click', function() {

            let filter = elems.dataset.filter;
            console.log(filter)
            portfolioFilters.forEach(function(elem) {
                elem.classList.remove('active');
            });

            this.classList.add('active');

            portfolioLists.forEach(function(elems) {
                switch(filter) {
                    case 'all':
                        elems.style.display = 'flex';
                    break;
                    case 'sites':
                        elems.style.display = 'flex';
                        if(elems.dataset.filter !== 'sites') elems.style.display = 'none';
                    break;
                    case 'design':
                        elems.style.display = 'flex';
                        if(elems.dataset.filter !== 'design') elems.style.display = 'none';
                    break;
                    case 'logo':
                        elems.style.display = 'flex';
                        if(elems.dataset.filter !== 'logo') elems.style.display = 'none';
                    break;
                }
            })
        })
    })

    

};

window.addEventListener('load', function() {
    filter('portfolio');
}) 