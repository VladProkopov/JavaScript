const toolTips = function() {
    const toolTips = document.querySelectorAll('[data-tooltips]');
    console.log(toolTips)

    let helper = document.querySelector('.helper__hidden');
    console.log(helper);

    let attribute;

    toolTips.forEach(function(elem) {
        elem.addEventListener('mouseover', function(event) {
            attribute = this.getAttribute('title');
            this.removeAttribute('title');
            helper.innerHTML = attribute;
            helper.classList.remove('deactive');
            helper.style.top = (event.y + 40) + 'px';
            helper.style.left = (event.x - 40) + 'px';
        })

        elem.addEventListener('mouseout', function() {
            helper.classList.add('deactive');
           
            this.setAttribute('title' , helper.innerHTML);
            helper.innerHTML = '';
        })
    })

}

window.addEventListener('load', function() {
    toolTips()
})