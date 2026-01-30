
const EffectService = {
    triggerGodMode() {
        // Create style element for the animation
        const style = document.createElement('style');
        style.id = 'god-mode-style';
        style.innerHTML = `
            @keyframes godModeGlitch {
                0% { transform: translate(0) scale(1); filter: invert(0); }
                10% { transform: translate(-5px, 5px) skew(5deg); filter: invert(1); }
                20% { transform: translate(5px, -5px) skew(-5deg); filter: hue-rotate(90deg); }
                30% { transform: translate(-5px, 5px) scale(1.1); filter: invert(0); }
                40% { transform: translate(5px, -5px) skew(2deg); filter: contrast(200%); }
                50% { transform: translate(0) scale(1.05); filter: hue-rotate(180deg); }
                60% { transform: translate(-2px, 2px) skew(-2deg); filter: invert(1); }
                100% { transform: translate(0) scale(1); filter: invert(0); }
            }
            .god-mode-active {
                animation: godModeGlitch 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                pointer-events: none;
                overflow: hidden; /* Prevent scrollbars during shake */
            }
        `;
        
        // Append style if not already present (though we remove it after)
        if (!document.getElementById('god-mode-style')) {
            document.head.appendChild(style);
        }

        document.body.classList.add('god-mode-active');
        
        // Dispatch custom event if needed or just handle cleanup
        setTimeout(() => {
            document.body.classList.remove('god-mode-active');
            style.remove();
        }, 800);
    }
};

export { EffectService };
