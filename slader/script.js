const slider = function(opt) {

    if(!opt.name || !opt.btns.left || !opt.btns.right) return;

    const listElem = document.querySelector('#' + opt.name);

    if(!listElem || listElem.children.length <= 1) return;

    const btnLeft = document.querySelector('#' + opt.btns.left);
    const btnRight = document.querySelector('#' + opt.btns.right);
    let btnsBootom = document.querySelectorAll('.btn__circle');
    
    if (!btnLeft || !btnRight || !btnsBootom) return;

    btnsBootom.forEach(function(elems) {
        elems.addEventListener('click', function() {

            let activ = elems.dataset.id;

            btnsBootom.forEach(function(elems) {
                elems.classList.remove('active');
            })
            this.classList.add('active');

            switch(activ) {
                case 'item 1':
                    listElem.style.transform = `translateX(-${0}%)`;
                break;
                case 'item 2':
                    listElem.style.transform = `translateX(-${100}%)`;
                break;
                case 'item 3':
                    listElem.style.transform = `translateX(-${220.5}%)`;
                break;
            }
        })
    })


    const prevNext = function() {
        let x = listElem.style.transform;

        if (!x) {
            x = 0;
        } else {
            x = x.replace('translateX(', '');
            x = x.replace('%)', '');
            x = Math.abs(x);
        }
        
        const dir = (this == btnLeft) ? 'prev' : 'next';

        x += 20 * (dir == 'prev' ? -1 : 1);

        const stopPoint = (listElem.children.length - 1) * 14.7;

        if (x <= stopPoint) listElem.style.transform = `translateX(-${x}%)`;
        else if (x > stopPoint) listElem.style.transform = `translateX(0%)`;
        
        if (dir == 'prev' && x < 0) listElem.style.transform = `translateX(-${stopPoint}%)`; 
    }

    let autoPlay = setInterval(prevNext, 3000);
    
    let pause = function() {
        clearInterval(autoPlay);
    }

    let startPause = function() {
        clearInterval(autoPlay) 
        return autoPlay = setInterval(prevNext, 3000);
        
    }

    btnLeft.addEventListener('click', prevNext);
    btnRight.addEventListener('click', prevNext);

    
    btnLeft.addEventListener('mouseover', pause);
    btnRight.addEventListener('mouseover', pause);

    btnLeft.addEventListener('mouseleave', startPause);
    btnRight.addEventListener('mouseleave', startPause);
}

window.addEventListener('load', function() {
    const sliderOptions = {
        name: 'slider1',
        btns: {
            left: 'slider1_btn_left',
            right: 'slider1_btn_right'
        }
    };

    slider(sliderOptions);
});