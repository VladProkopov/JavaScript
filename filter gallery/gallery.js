const gallery = function() {
    const galleryElem = document.querySelector('#gallery');

    const links = galleryElem.querySelectorAll('a');

    const expandImg = document.querySelector('#expandedImg');

    const clsBtn = document.querySelector('.closebtn');

    links.forEach(function(elem) {
        elem.addEventListener('click', function(event) {
            event.preventDefault();

            expandImg.src = this.href;
            expandImg.parentElement.style.display = 'block';
            
            closeBtn();
        });
    });

    const closeBtn = function() {
        clsBtn.addEventListener('click', function() {
            expandImg.parentElement.style.display = 'none';
        })
    }
    
};


window.addEventListener('load', function() {

    gallery('gallery');

});