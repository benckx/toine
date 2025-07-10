function htmlCollectionToArray(htmlCollection) {
    const array = [];
    for (let i = 0; i < htmlCollection.length; i++) {
        array.push(htmlCollection[i]);
    }
    return array;
}

function getElementsByClassNameArray(className) {
    return htmlCollectionToArray(document.getElementsByClassName(className));
}

function renderSlide(slideId) {
    const slide = document.getElementById(slideId);
    if (slide) {
        getElementsByClassNameArray('slides').forEach(slide => {
            slide.classList.remove('visible-slides');
        });
        slide.classList.add('visible-slides');
        if (sounds.has(slideId)) {
            sounds.get(slideId).play();
        }
    }
}

window.onload = () => {
    getElementsByClassNameArray('step-link')
        .forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const slideId = event.target.getAttribute('href').substring(1);
                renderSlide(slideId);
            });
        });

    // show the first slide by default
    renderSlide(getElementsByClassNameArray('slides')[0].id);
};
