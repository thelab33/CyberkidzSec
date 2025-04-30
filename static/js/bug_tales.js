// static/js/bug_tales.js

document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('bt-play');
  const stopBtn = document.getElementById('bt-stop');
  const sfx     = document.getElementById('bt-sfx');
  let utterance;

  function buildStoryText() {
    // You’d dynamically pull in your report’s details here.
    return `
      It was 3 AM. The C O R S headers were misconfigured—
      and so was their fate. Our attacker slipped through the cracks,
      exfiltrating secrets in silence. This… is the Bug Tale.
    `;
  }

  playBtn.addEventListener('click', () => {
    // start background SFX
    sfx.volume = 0.3;
    sfx.play().catch(console.warn);

    // prepare TTS
    const text = buildStoryText();
    utterance  = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.voice = speechSynthesis.getVoices().find(v => /en-US/.test(v.lang)) || null;

    // play TTS
    speechSynthesis.speak(utterance);

    playBtn.disabled = true;
    stopBtn.disabled = false;
  });

  stopBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    sfx.pause();
    sfx.currentTime = 0;
    playBtn.disabled = false;
    stopBtn.disabled = true;
  });
});

