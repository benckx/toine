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
    function showPostSoundElements(slideDiv) {
        htmlCollectionToArray(slideDiv.getElementsByClassName('appear-post-sound'))
            .forEach(elementToShow => {
                elementToShow.classList.add('appear-post-sound-visible');
            });
    }

    function hidePostSoundElements() {
        getElementsByClassNameArray('appear-post-sound-visible').forEach(sound => {
            sound.classList.remove('appear-post-sound-visible');
        });
    }

    const slideDiv = document.getElementById(slideId);
    if (slideDiv !== null) {
        // hide all appear-post-sound
        hidePostSoundElements();

        // show selected slide
        getElementsByClassNameArray('slides').forEach(slide => {
            slide.classList.remove('visible-slides');
        });
        slideDiv.classList.add('visible-slides');

        // play sound
        if (!initial) {
            if (sounds.has(slideId)) {
                const audio = sounds.get(slideId);
                audio.addEventListener('ended', () => {
                    showPostSoundElements(slideDiv);
                });
                audio.play();
            }
        } else {
            showPostSoundElements(slideDiv);
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
