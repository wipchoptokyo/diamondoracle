const whispers = [
  "── どうして、まだ眠っているの？",
  "── 君の記憶に、私の影は残っていないの？",
  "── 見つけて。私は、君の中にいる。"
];

let whisperIndex = 0;

function playWhisperSound() {
  const whisperAudio = document.getElementById('whisperSound');
  if (whisperAudio) {
    whisperAudio.currentTime = 0;
    whisperAudio.play();
  }
}

function showNextWhisper() {
  if (whisperIndex >= whispers.length) {
    document.getElementById('veil').style.opacity = 0;
    setTimeout(() => {
      document.getElementById('veil').remove();
      document.getElementById('whisper').remove();
    }, 3000);
    return;
  }

  const whisper = document.getElementById('whisper');
  whisper.textContent = whispers[whisperIndex++];
  whisper.style.opacity = 1;
  whisper.style.display = 'block';
  playWhisperSound(); // 音を鳴らす

  setTimeout(() => {
    whisper.style.opacity = 0;
    setTimeout(showNextWhisper, 2000); // 次のささやきまでの間
  }, 3000); // 表示時間
}

window.onload = function () {
  showNextWhisper();

  const image = document.getElementById('oracleimage');
  const video = document.getElementById('oracleritual');
  const subtitle = document.getElementById('subtitle');
  const cards = [
    document.getElementById('card1'),
    document.getElementById('card2'),
    document.getElementById('card3')
  ];

  // ノイズ再生
  const noise = document.getElementById('noiseLoop');
  if (noise) {
    noise.volume = 0.1;
    noise.play().catch(e => console.warn("ノイズ再生失敗:", e));
  }

  image.addEventListener('click', () => {
    image.style.display = 'none';
    video.style.display = 'block';
    video.play();

    setTimeout(() => {
      subtitle.style.opacity = 1;
    }, 2000);

    setTimeout(() => {
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = 1;
          card.style.transform = 'translateY(0)';
        }, index * 800);
      });
    }, 3500);
  });
};
