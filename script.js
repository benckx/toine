// noinspection JSIgnoredPromiseFromCall

let wakeLock = null;

// Request wake lock when page loads or user interacts
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen wake lock is active');
        }
    } catch (err) {
        console.error('Wake lock request failed:', err);
    }
}

// Release wake lock when leaving page
function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}

// Request wake lock on page load
document.addEventListener('DOMContentLoaded', requestWakeLock);

// Re-request if page becomes visible again
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !wakeLock) {
        requestWakeLock();
    }
});

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
 * @param animateAndPlaySounds {boolean}
 */
function renderSlide(slideId, animateAndPlaySounds) {
    function hideAllEmojiElements(animationElements) {
        animationElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    function showAllEmojiElements(animationElements) {
        animationElements.forEach(element => {
            element.style.display = 'inline-block';
        });
    }

    const slideDiv = document.getElementById(slideId);
    if (slideDiv !== null) {
        // hide all appear-post-sound
        hidePostSoundElements();

        const animationElements = [];
        animationElements.push(...htmlCollectionToArray(slideDiv.getElementsByClassName('turningemoji')));
        animationElements.push(...htmlCollectionToArray(slideDiv.getElementsByClassName('tete')));

        if (animateAndPlaySounds) {
            showAllEmojiElements(animationElements);

            // hide all emoji elements after animation ends
            const maxDelayInSec = Math.max(
                ...animationElements.map(el => parseFloat(window.getComputedStyle(el).animationDelay) || 0)
            );

            const effectiveDelayInSec = maxDelayInSec + 8;
            console.log(`[${slideId}] - effective delay: ${effectiveDelayInSec} sec.`);
            setTimeout(() => hideAllEmojiElements(animationElements), effectiveDelayInSec * 1_000);
        } else {
            hideAllEmojiElements(animationElements);
        }

        // show only selected slide
        getElementsByClassNameArray('slides').forEach(slide => {
            slide.classList.remove('visible-slides');
        });
        slideDiv.classList.add('visible-slides');

        // play sound
        if (animateAndPlaySounds) {
            if (sounds.has(slideId)) {
                sounds.get(slideId).play();
            }
        } else {
            showPostSoundElements(slideDiv);
        }

        // push state to history
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
                renderSlide(slideId, true);
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

        // stop any currently playing sounds
        sounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });

        renderSlide(slideId, false);
    };

    renderSlide(FIRST_SLIDE, false);
    window.addEventListener('beforeunload', releaseWakeLock);
};
