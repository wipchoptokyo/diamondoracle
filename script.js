window.onload = () => {
  try {
    console.log("✅ JS読み込まれた");

    const image = document.getElementById('oracleimage');
    const video = document.getElementById('oracleritual');
    const subtitle = document.getElementById('subtitle');
    const cards = [
      document.getElementById('card1'),
      document.getElementById('card2'),
      document.getElementById('card3')
    ];

    if (!image || !video || !subtitle || cards.includes(null)) {
      throw new Error("❌ 必要な要素が見つかりません");
    }

    image.addEventListener('click', () => {
      console.log("✅ 画像クリックイベント発火");

      image.style.display = 'none';
      video.style.display = 'block';

      video.play().then(() => {
        console.log("✅ 動画再生開始");
      }).catch((e) => {
        console.error("❌ 動画再生失敗", e);
      });

      setTimeout(() => {
        subtitle.style.opacity = 1;
        console.log("✅ 字幕表示");
      }, 2000);

      setTimeout(() => {
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
            console.log(`✅ カード${index + 1}表示`);
          }, index * 800);
        });
      }, 3500);
    });

  } catch (e) {
    console.error("❌ JS実行中にエラー発生", e);
  }
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
