
const EffectService = {
    triggerGodMode() {
        // Create style element for the animation
        const style = document.createElement('style');
        style.id = 'god-mode-style';

        // //version 1.0.0
        // style.innerHTML = `
        //     @keyframes godModeGlitch {
        //         0% { transform: translate(0) scale(1); filter: invert(0); }
        //         10% { transform: translate(-5px, 5px) skew(5deg); filter: invert(1); }
        //         20% { transform: translate(5px, -5px) skew(-5deg); filter: hue-rotate(90deg); }
        //         30% { transform: translate(-5px, 5px) scale(1.1); filter: invert(0); }
        //         40% { transform: translate(5px, -5px) skew(2deg); filter: contrast(200%); }
        //         50% { transform: translate(0) scale(1.05); filter: hue-rotate(180deg); }
        //         60% { transform: translate(-2px, 2px) skew(-2deg); filter: invert(1); }
        //         100% { transform: translate(0) scale(1); filter: invert(0); }
        //     }
        //     .god-mode-active {
        //         animation: godModeGlitch 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        //         pointer-events: none;
        //         overflow: hidden; /* Prevent scrollbars during shake */
        //     }
        // `;

        //version - 2.0.0
        // style.innerHTML = `
        //     @keyframes godModeGlitch {
        //         0% {
        //             transform: translate(0) scale(1);
        //             filter: none;
        //         }
        //         5% {
        //             transform: translate(-6px, 4px) skew(4deg);
        //             filter: invert(1) hue-rotate(40deg);
        //         }
        //         10% {
        //             transform: translate(6px, -4px) skew(-4deg);
        //             filter: hue-rotate(120deg) contrast(200%);
        //         }
        //         20% {
        //             transform: translate(-4px, 4px) scale(1.08);
        //             filter: invert(0);
        //         }
        //         30% {
        //             transform: translate(4px, -4px) skew(2deg);
        //             filter: saturate(3);
        //         }
        //         45% {
        //             transform: translate(0) scale(1.12);
        //             filter: brightness(2);
        //         }
        //         60% {
        //             transform: translate(-2px, 2px) skew(-2deg);
        //             filter: invert(1) hue-rotate(260deg);
        //         }
        //         100% {
        //             transform: translate(0) scale(1);
        //             filter: none;
        //         }
        //     }

        //     @keyframes scanlines {
        //         0% { background-position: 0 0; }
        //         100% { background-position: 0 100%; }
        //     }

        //     @keyframes rgbSplit {
        //         0% { transform: translate(0); opacity: 0; }
        //         20% { transform: translate(-3px, 0); opacity: 0.6; }
        //         40% { transform: translate(3px, 0); opacity: 0.6; }
        //         100% { transform: translate(0); opacity: 0; }
        //     }

        //     .god-mode-active {
        //         position: relative;
        //         animation: godModeGlitch 0.9s cubic-bezier(.25,.46,.45,.94) both;
        //         pointer-events: none;
        //         overflow: hidden;
        //     }

        //     /* Scanlines */
        //     .god-mode-active::before {
        //         content: "";
        //         position: fixed;
        //         inset: 0;
        //         background: repeating-linear-gradient(
        //             to bottom,
        //             rgba(255,255,255,0.03) 0px,
        //             rgba(255,255,255,0.03) 1px,
        //             transparent 2px,
        //             transparent 4px
        //         );
        //         animation: scanlines 0.4s linear infinite;
        //         mix-blend-mode: overlay;
        //         pointer-events: none;
        //         z-index: 9998;
        //     }

        //     /* RGB Glitch */
        //     .god-mode-active::after {
        //         content: "";
        //         position: fixed;
        //         inset: 0;
        //         background: inherit;
        //         animation: rgbSplit 0.25s steps(2) infinite;
        //         filter:
        //             drop-shadow(-3px 0 red)
        //             drop-shadow(3px 0 cyan);
        //         mix-blend-mode: screen;
        //         pointer-events: none;
        //         z-index: 9999;
        //     }
        // `;

        //version 3.0.0
        style.innerHTML = `
            @keyframes darkGlitch {
                0% {
                    transform: scale(1);
                    filter: brightness(1) contrast(1);
                }

                8% {
                    transform: translate(-4px, 3px);
                    filter: contrast(3) brightness(0.7);
                }

                15% {
                    transform: translate(4px, -3px);
                    filter: invert(1);
                }

                25% {
                    transform: scale(1.05);
                    filter: brightness(0.4) contrast(2);
                }

                40% {
                    transform: translate(-2px, 2px) skew(1deg);
                    filter: grayscale(1);
                }

                /* DARK TOTAL */
                60% {
                    transform: scale(1.02);
                    filter: brightness(0.25);
                }

                /* COMEÇA A RESPIRAR */
                75% {
                    transform: scale(1.01);
                    filter: brightness(0.5);
                }

                /* VOLTA LENTA */
                90% {
                    transform: scale(1);
                    filter: brightness(0.8);
                }

                /* NORMAL */
                100% {
                    transform: scale(1);
                    filter: brightness(1) contrast(1);
                }
            }

            @keyframes vignetteFade {
                0% {
                    opacity: 1;
                }
                60% {
                    opacity: 1;
                }
                85% {
                    opacity: 0.6;
                }
                100% {
                    opacity: 0;
                }
            }

            @keyframes darkScan {
                0% { background-position: 0 0; }
                100% { background-position: 0 100%; }
            }

            @keyframes darkNoise {
                0% { transform: translate(0); }
                25% { transform: translate(-1px, 1px); }
                50% { transform: translate(1px, -1px); }
                100% { transform: translate(0); }
            }

            .god-mode-active {
                position: relative;
                animation: darkGlitch 1.1s cubic-bezier(.2,.8,.2,1) both;
                pointer-events: none;
                overflow: hidden;
            }

            /* Vinheta agora abre devagar */
            .god-mode-active::before {
                content: "";
                position: fixed;
                inset: 0;
                background:
                    radial-gradient(
                        circle at center,
                        rgba(0,0,0,0) 40%,
                        rgba(0,0,0,0.85) 100%
                    );
                animation: vignetteFade 1.1s ease-out forwards;
                z-index: 9998;
                pointer-events: none;
            }

            /* Ruído + scan continuam agressivos */
            .god-mode-active::after {
                content: "";
                position: fixed;
                inset: 0;
                background:
                    repeating-linear-gradient(
                        to bottom,
                        rgba(255,255,255,0.02) 0px,
                        rgba(255,255,255,0.02) 1px,
                        transparent 2px,
                        transparent 4px
                    );
                animation:
                    darkScan 0.4s linear infinite,
                    darkNoise 0.15s steps(2) infinite;
                mix-blend-mode: overlay;
                z-index: 9999;
                pointer-events: none;
            }
        `;
        
        if (!document.getElementById('god-mode-style')) {
            document.head.appendChild(style);
        }

        document.body.classList.add('god-mode-active');
        
        setTimeout(() => {
            document.body.classList.remove('god-mode-active');
            style.remove();
        }, 800);
    },
    
    triggerScanLine() {
        if (document.getElementById('scan-line-style')) return;

        const style = document.createElement('style');
        style.id = 'scan-line-style';
        style.innerHTML = `
            @keyframes scanLine {
                0% { top: -10%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 110%; opacity: 0; }
            }
            
            @keyframes scanFade {
                0% { background: rgba(142, 68, 173, 0); }
                50% { background: rgba(142, 68, 173, 0.05); }
                100% { background: rgba(142, 68, 173, 0); }
            }

            .scan-line-element {
                position: fixed;
                left: 0;
                width: 100%;
                height: 5px;
                background: linear-gradient(to bottom, transparent, #8e44ad, transparent);
                box-shadow: 0 0 15px rgba(142, 68, 173, 0.8), 0 0 30px rgba(142, 68, 173, 0.4);
                z-index: 10000;
                pointer-events: none;
                animation: scanLine 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            }

            .scan-screen-flash {
                position: fixed;
                inset: 0;
                z-index: 9999;
                pointer-events: none;
                animation: scanFade 1.5s ease-in-out forwards;
            }
        `;
        document.head.appendChild(style);

        const line = document.createElement('div');
        line.className = 'scan-line-element';
        
        const flash = document.createElement('div');
        flash.className = 'scan-screen-flash';

        document.body.appendChild(line);
        document.body.appendChild(flash);

        setTimeout(() => {
            line.remove();
            flash.remove();
            style.remove();
        }, 1600);
    }
};

export { EffectService };
