// noinspection JSIgnoredPromiseFromCall

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

/**
 * @param slideId {string}
 * @param initial {boolean}
 */
function renderSlide(slideId, initial = false) {
    const slide = document.getElementById(slideId);
    if (slide !== null) {
        // show selected slide
        getElementsByClassNameArray('slides').forEach(slide => {
            slide.classList.remove('visible-slides');
        });
        slide.classList.add('visible-slides');

        // play sound
        if (!initial && sounds.has(slideId)) {
            sounds.get(slideId).play();
        }

        // apply other slide options
        const options = slideOptions.find(option => option.id === slideId);
        if (options !== null && options.title !== undefined) {
            document.getElementsByTagName('title').item(0).innerText = options.title;
        }
    } else {
        console.error(`slide with id ${slideId} not found`);
    }
}

window.onload = () => {
    getElementsByClassNameArray('step-link')
        .forEach(stepLink => {
            stepLink.addEventListener('click', (event) => {
                event.preventDefault();
                const slideId = event.target.getAttribute('href').substring(1);
                renderSlide(slideId);
            });
        });

    renderSlide(FIRST_SLIDE, true);
};
