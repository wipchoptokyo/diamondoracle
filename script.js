console.log("✅ JS読み込まれた");

image.addEventListener('click', () => {
  console.log("✅ 画像クリックされた");

  video.style.display = 'block';
  video.play().then(() => {
    console.log("✅ 動画再生開始");
  }).catch((e) => {
    console.error("❌ 動画再生失敗", e);
  });
});

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
