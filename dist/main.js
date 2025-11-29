const safeTextContent = (element, text) => {
    element.textContent = text;
};
window.addEventListener("load", () => {
    const getElement = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id '${id}' was not found in the DOM.`);
        }
        return element;
    };
    const coverScreen = getElement("cover-screen");
    const mainContent = getElement("main-content");
    const confettiContainer = getElement("confetti-container");
    const balloonContainer = getElement("balloon-container");
    const surpriseButton = getElement("surpriseButton");
    const reasonsList = getElement("reasonsList");
    const tuneButton = getElement("tuneButton");
    const poemButton = getElement("poemButton");
    const poemContainer = getElement("poemContainer");
    const birthdayImage = getElement("birthday-image-container");
    const birthdayTitle = getElement("birthday-title");
    const birthdayMessage = getElement("birthday-message");
    const birthdayButtons = getElement("birthday-buttons");
    const hiddenAnimationClasses = ["opacity-0", "-translate-y-4", "scale-95"];
    const visibleAnimationClasses = ["opacity-100", "translate-y-0", "scale-100"];
    const animationDurationMs = 500;
    const revealElement = (element) => {
        if (!element) {
            return;
        }
        element.classList.remove("hidden");
        setTimeout(() => {
            element.classList.remove("opacity-0", "-translate-y-4");
        }, 50);
    };
    const showAnimatedSection = (element) => {
        element.classList.remove("hidden");
        element.classList.add(...hiddenAnimationClasses);
        element.classList.remove(...visibleAnimationClasses);
        requestAnimationFrame(() => {
            element.classList.remove(...hiddenAnimationClasses);
            element.classList.add(...visibleAnimationClasses);
        });
    };
    const hideAnimatedSection = (element) => {
        element.classList.remove(...visibleAnimationClasses);
        element.classList.add(...hiddenAnimationClasses);
        window.setTimeout(() => {
            if (hiddenAnimationClasses.every((cls) => element.classList.contains(cls))) {
                element.classList.add("hidden");
            }
        }, animationDurationMs);
    };
    const toggleButtonVisualState = (button, isActive) => {
        const activeClasses = [
            "ring-4",
            "ring-offset-2",
            "ring-pink-200",
            "shadow-2xl",
            "scale-105",
        ];
        activeClasses.forEach((className) => {
            button.classList.toggle(className, isActive);
        });
    };
    const confettiCount = 100;
    const createConfetti = () => {
        for (let i = 0; i < confettiCount; i += 1) {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDelay = `${Math.random() * 10}s`;
            const size = Math.random() * 5 + 5;
            if (!confetti.style.width) {
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
            }
            confettiContainer.appendChild(confetti);
        }
    };
    const balloonColors = [
        "balloon-pink",
        "balloon-gold",
        "balloon-red",
        "balloon-purple",
    ];
    const balloonCount = 15;
    let popSynth = null;
    const popBalloon = (event) => {
        const balloon = event.currentTarget;
        if (!balloon || balloon.classList.contains("popped")) {
            return;
        }
        balloon.classList.add("popped");
        if (typeof Tone !== "undefined" && popSynth) {
            popSynth.triggerAttackRelease("8n", Tone.now());
        }
        setTimeout(() => {
            balloon.remove();
            createSingleBalloon();
        }, 100);
    };
    const createSingleBalloon = () => {
        const balloon = document.createElement("div");
        const colorClass = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.className = `balloon ${colorClass}`;
        const size = Math.random() * 80 + 70;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.2}px`;
        balloon.style.left = `${Math.random() * 90}vw`;
        balloon.style.animationDuration = `${Math.random() * 5 + 7}s`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        balloon.addEventListener("click", popBalloon);
        balloon.addEventListener("touchstart", popBalloon, { passive: true });
        balloonContainer.appendChild(balloon);
    };
    const createBalloons = () => {
        for (let i = 0; i < balloonCount; i += 1) {
            createSingleBalloon();
        }
    };
    let playBirthdayTune = () => { };
    let musicPlaying = false;
    let autoStopTimeout = null;
    coverScreen.addEventListener("click", async () => {
        if (typeof Tone !== "undefined" && Tone.context.state !== "running") {
            await Tone.start();
        }
        coverScreen.classList.add("transition-opacity", "duration-1000", "ease-in-out", "opacity-0");
        setTimeout(() => {
            coverScreen.style.display = "none";
            mainContent.classList.remove("hidden");
            document.title = "Happy Birthday!";
            setTimeout(() => {
                mainContent.classList.remove("opacity-0");
                setTimeout(() => {
                    createBalloons();
                    revealElement(birthdayImage);
                    setTimeout(() => {
                        revealElement(birthdayTitle);
                        createConfetti();
                        if (typeof Tone !== "undefined") {
                            playBirthdayTune();
                        }
                        setTimeout(() => {
                            revealElement(birthdayMessage);
                            setTimeout(() => {
                                revealElement(birthdayButtons);
                            }, 800);
                        }, 800);
                    }, 500);
                }, 500);
            }, 100);
        }, 1000);
    }, { once: true });
    let surpriseVisible = false;
    surpriseButton.addEventListener("click", () => {
        surpriseVisible = !surpriseVisible;
        if (surpriseVisible) {
            showAnimatedSection(reasonsList);
            safeTextContent(surpriseButton, "Hide the surprise ✨");
            reasonsList.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
        else {
            hideAnimatedSection(reasonsList);
            safeTextContent(surpriseButton, "Click for a surprise!");
        }
        toggleButtonVisualState(surpriseButton, surpriseVisible);
    });
    let poemVisible = false;
    poemButton.addEventListener("click", () => {
        poemVisible = !poemVisible;
        if (poemVisible) {
            showAnimatedSection(poemContainer);
            safeTextContent(poemButton, "💌 Hide the Poem 💌");
            poemContainer.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
        else {
            hideAnimatedSection(poemContainer);
            safeTextContent(poemButton, "💌 Reveal the Poem 💌");
        }
        toggleButtonVisualState(poemButton, poemVisible);
    });
    if (typeof Tone === "undefined") {
        console.error("Tone.js library failed to load.");
        tuneButton.disabled = true;
        safeTextContent(tuneButton, "🎵 Music Unavailable");
        tuneButton.classList.add("opacity-50", "cursor-not-allowed");
    }
    else {
        const synth = new Tone.Synth().toDestination();
        popSynth = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
        }).toDestination();
        const melody = [
            ["G4", "8n"],
            ["G4", "8n"],
            ["A4", "4n"],
            ["G4", "4n"],
            ["C5", "4n"],
            ["B4", "4n"],
            ["G4", "8n"],
            ["G4", "8n"],
            ["A4", "4n"],
            ["G4", "4n"],
            ["D5", "4n"],
            ["C5", "4n"],
            ["G4", "8n"],
            ["G4", "8n"],
            ["G5", "4n"],
            ["E5", "4n"],
            ["C5", "4n"],
            ["B4", "4n"],
            ["A4", "4n"],
            ["F5", "8n"],
            ["F5", "8n"],
            ["E5", "4n"],
            ["C5", "4n"],
            ["D5", "4n"],
            ["C5", "4n"],
        ];
        let elapsedTime = 0;
        const melodyEvents = melody.map(([note, duration]) => {
            const event = { time: elapsedTime, note, duration };
            elapsedTime += Tone.Time(duration).toSeconds();
            return event;
        });
        const melodyPart = new Tone.Part((eventTime, event) => {
            synth.triggerAttackRelease(event.note, event.duration, eventTime);
        }, melodyEvents);
        melodyPart.loop = true;
        melodyPart.loopEnd = elapsedTime;
        melodyPart.start(0);
        const maxLoops = 5;
        const scheduleAutoStop = () => {
            if (autoStopTimeout) {
                window.clearTimeout(autoStopTimeout);
            }
            autoStopTimeout = window.setTimeout(() => {
                stopTune();
            }, elapsedTime * 1000 * maxLoops);
        };
        const updateTuneButton = (playing) => {
            if (playing) {
                safeTextContent(tuneButton, "◼ Stop Tune");
                tuneButton.classList.replace("from-blue-500", "from-red-500");
                tuneButton.classList.replace("to-teal-500", "to-pink-500");
            }
            else {
                safeTextContent(tuneButton, "🎵 Play Birthday Tune 🎵");
                tuneButton.classList.replace("from-red-500", "from-blue-500");
                tuneButton.classList.replace("to-pink-500", "to-teal-500");
            }
        };
        const stopTune = () => {
            Tone.Transport.stop();
            if (autoStopTimeout) {
                window.clearTimeout(autoStopTimeout);
                autoStopTimeout = null;
            }
            musicPlaying = false;
            updateTuneButton(false);
        };
        playBirthdayTune = () => {
            if (musicPlaying) {
                stopTune();
                return;
            }
            musicPlaying = true;
            updateTuneButton(true);
            Tone.Transport.start();
            scheduleAutoStop();
        };
        tuneButton.addEventListener("click", playBirthdayTune);
    }
});
export {};
//# sourceMappingURL=main.js.map