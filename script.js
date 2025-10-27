let stage = 0; // 0=初期, 1=現在カード表示後, 2=完了

const image = document.getElementById('oracleimage');
const video = document.getElementById('oracleritual');
const subtitle = document.getElementById('subtitle');
const lowerScene = document.getElementById('lower-scene'); // カード背景ブロック

// ===== ガイド文の生成 =====
const guide = document.createElement('div');
guide.id = "guide-text";
guide.textContent = "";
guide.style.cssText = `
  position:absolute; bottom:8%; left:50%; transform:translateX(-50%);
  color:#fff; font-size:1.2rem; text-shadow:0 0 10px #000;
  opacity:0; transition:opacity 1.5s ease; z-index:10;
`;
document.body.appendChild(guide);

function showGuide(text) {
  guide.textContent = text;
  guide.style.opacity = 1;
}
function hideGuide() {
  guide.style.opacity = 0;
}

// ===== 仮デッキデータ =====
const DECK = {
  archetypes: Array.from({length:12}, (_,i)=>({
    id:`A${i+1}`, name:`Archetype ${i+1}`, image:`assets/archetype_${i+1}.png`
  })),
  past: Array.from({length:9}, (_,i)=>({
    id:`P${i+1}`, name:`Past ${i+1}`, image:`assets/past_${i+1}.png`
  })),
  future: Array.from({length:9}, (_,i)=>({
    id:`F${i+1}`, name:`Future ${i+1}`, image:`assets/future_${i+1}.png`
  }))
};

function drawRandom(deck) {
  return deck[Math.floor(Math.random() * deck.length)];
}

function renderCard(slotId, cardData, delay = 0) {
  const slot = document.getElementById(slotId);
  slot.style.width = "160px";
  slot.style.height = "260px";
  slot.style.backgroundImage = `url(${cardData.image})`;
  slot.style.backgroundSize = "cover";
  slot.style.backgroundPosition = "center";
  slot.style.borderRadius = "12px";
  slot.style.opacity = "0";
  slot.style.transition = "opacity 1.5s ease";
  slot.style.boxShadow = "0 0 25px rgba(0,0,0,0.4)";

  setTimeout(() => { slot.style.opacity = "1"; }, delay);
}

// ===== クリック1回目：動画再生＋現在カード表示 =====
image.addEventListener('click', () => {
  if(stage !== 0) return;
  stage = 0.5;

  image.style.display = 'none';
  video.style.display = 'block';
  video.currentTime = 0;
  video.play();

  // 字幕フェードイン
  setTimeout(() => {
    subtitle.style.transition = 'opacity 2s ease';
    subtitle.style.opacity = 1;
  }, 2000);

  // 動画終了後：スクロールせず、その場で現在カード表示
  video.onended = () => {
    subtitle.style.opacity = 0;

    // 現在カード表示
    const current = drawRandom(DECK.archetypes);
    renderCard('card-current', current);
    stage = 1;

    // 誘導メッセージ表示
    setTimeout(() => {
      showGuide("── 次のカードを引く準備ができたら、クリックしてください。");
    }, 1200);
  };
});

// ===== クリック2回目：過去・未来カード表示＋下層スクロール =====
document.addEventListener('click', () => {
  if (stage === 1) {
    hideGuide();
    const past = drawRandom(DECK.past);
    const future = drawRandom(DECK.future);

    renderCard('card-past', past);
    renderCard('card-future', future);
    stage = 2;

    // カードが出揃った後に下層へ自動スクロール
    setTimeout(() => {
      lowerScene.scrollIntoView({ behavior: 'smooth' });
    }, 2500);
  }
});
