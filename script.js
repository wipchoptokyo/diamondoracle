const whispers = [
  "── どうして、まだ眠っているの？",
  "── 君の記憶に、私の影は残っていないの？",
  "── 世界はもう、答えを手放している。",
  "── 見つけて。私は、君の中にいる。"
];

let whisperIndex = 0;

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

  setTimeout(() => {
    whisper.style.opacity = 0;
    setTimeout(showNextWhisper, 2000); // 次のささやきまでの間
  }, 3000); // 表示時間
}

window.onload = function() {
  showNextWhisper();
  // 他の初期処理がある場合、ここに統合
};

window.onload = () => {
  const image = document.getElementById('oracleimage');
  const video = document.getElementById('oracleritual');
  const subtitle = document.getElementById('subtitle');
  const cards = [
    document.getElementById('card1'),
    document.getElementById('card2'),
    document.getElementById('card3')
  ];

  image.addEventListener('click', () => {
    image.style.display = 'none';
    video.style.display = 'block';
    video.play();

    // 字幕表示とカード召喚
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
