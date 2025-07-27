// noinspection JSIgnoredPromiseFromCall

function hidePostSoundElements() {
    getElementsByClassNameArray('appear-post-sound-visible')
        .forEach(element => {
            element.classList.remove('appear-post-sound-visible');
        });
}

function showPostSoundElements(slideDiv) {
    htmlCollectionToArray(slideDiv.getElementsByClassName('appear-post-sound'))
        .forEach(element => {
            element.classList.add('appear-post-sound-visible');
        });
}

/**
 * @param slideId {string}
 * @param initial {boolean}
 */
function renderSlide(slideId, initial = false) {
    const slideDiv = document.getElementById(slideId);
    if (slideDiv !== null) {
        // hide all appear-post-sound
        hidePostSoundElements();

        const emojiElements = [];
        emojiElements.push(...htmlCollectionToArray(slideDiv.getElementsByClassName('turningemoji')));
        emojiElements.push(...htmlCollectionToArray(slideDiv.getElementsByClassName('tete')));
        emojiElements.forEach(element => {
            element.style.display = 'inline-block';
        });

        const maxDelayInSec = Math.max(
            ...emojiElements.map(el => parseFloat(window.getComputedStyle(el).animationDelay) || 0)
        );

        const effectiveDelayInSec = maxDelayInSec + 8;

        console.log(`[${slideId}] - effective delay: ${effectiveDelayInSec} sec.`);

        setTimeout(() => {
            emojiElements.forEach(el => {
                el.style.display = 'none';
            });
        }, effectiveDelayInSec * 1_000);

        // show only selected slide
        getElementsByClassNameArray('slides').forEach(slide => {
            slide.classList.remove('visible-slides');
        });
        slideDiv.classList.add('visible-slides');

        // play sound
        if (!initial) {
            if (sounds.has(slideId)) {
                sounds.get(slideId).play();
            }
        } else {
            showPostSoundElements(slideDiv);
        }

        // apply other slide options
        try {
            const options = slideOptions.find(option => option.id === slideId);
            if (options !== null && typeof options.title !== 'undefined') {
                document.getElementsByTagName('title').item(0).innerText = options.title;
            }
        } catch (e) {
            console.log(`Error applying options for slide ${slideId}:`, e);
        }

        // Push state to history
        history.pushState({slideId}, '', `#${slideId}`);
    } else {
        console.error(`slide with id ${slideId} not found`);
    }
}

window.onload = () => {
    // create step-link event listeners
    getElementsByClassNameArray('step-link')
        .forEach(stepLink => {
            stepLink.addEventListener('click', (event) => {
                event.preventDefault();
                const slideId = event.target.getAttribute('href').substring(1);
                renderSlide(slideId);
            });
        });

    // create post sound event listeners
    sounds.forEach((audio, slideId) => {
        audio.addEventListener('ended', () => {
            const slideDiv = document.getElementById(slideId);
            if (slideDiv != null) {
                showPostSoundElements(slideDiv);
            }
        })
    });

    // Listen for back/forward navigation
    window.onpopstate = (event) => {
        const slideId = event.state?.slideId || FIRST_SLIDE;
        renderSlide(slideId, true);
    };

    renderSlide(FIRST_SLIDE, true);
};
