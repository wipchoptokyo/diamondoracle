// ===== whisper演出 =====
const whispers = [
  "手を離すと、水面に揺らめきながら浮かび上がった。",
  "波が鎮まれば、描かれていたものが読めた。",
  "手を伸ばしたら、たしかにそれは私の手の中にあった。"
];
const rareWhispers = [
  "光が集まり、記憶の奥で形を成す。",
  "すべては、始まりのまま続いている。"
];
const veil = document.getElementById("veil");
const whisper = document.getElementById("whisper");
const isRare = Math.random() < 0.3;
const whisperSet = isRare ? rareWhispers : whispers;
whisper.className = isRare ? "rare-whisper" : "normal-whisper";
let index = 0;
function showNextWhisper() {
  if (index >= whisperSet.length) {
    veil.style.opacity = 0;
    whisper.style.opacity = 0;
    setTimeout(() => { veil.remove(); whisper.remove(); }, 3000);
    return;
  }
  whisper.textContent = whisperSet[index++];
  whisper.style.opacity = 1;
  setTimeout(() => {
    whisper.style.opacity = 0;
    setTimeout(showNextWhisper, 1500);
  }, 3000);
}
window.addEventListener("load", showNextWhisper);

// ===== 儀式クリック制御 =====
let stage = 0;
const image = document.getElementById("oracleimage");
const video = document.getElementById("oracleritual");
const subtitle = document.getElementById("subtitle");
const lowerScene = document.getElementById("lower-scene");

const guide = document.createElement("div");
guide.id = "guide-text";
document.body.appendChild(guide);
function showGuide(text){ guide.textContent = text; guide.style.opacity = 1; }
function hideGuide(){ guide.style.opacity = 0; }

const DECK = {
  archetypes: Array.from({length:12},(_,i)=>({id:`A${i+1}`,image:`assets/archetype_${i+1}.png`})),
  past: Array.from({length:9},(_,i)=>({id:`P${i+1}`,image:`assets/past_${i+1}.png`})),
  future: Array.from({length:9},(_,i)=>({id:`F${i+1}`,image:`assets/future_${i+1}.png`}))
};
function drawRandom(deck){return deck[Math.floor(Math.random()*deck.length)];}
function renderCard(id,data,delay=0){
  const el=document.getElementById(id);
  el.style.backgroundImage=`url(${data.image})`;
  setTimeout(()=>{el.style.opacity="1";el.style.transform="translateY(0)";},delay);
}

// 一回目クリック
image.addEventListener("click",()=>{
  if(stage!==0)return;
  stage=0.5;
  image.style.display="none";
  video.style.display="block";
  video.currentTime=0;
  video.play();
  setTimeout(()=>{subtitle.style.opacity=1;},2000);
  video.onended=()=>{
    subtitle.style.opacity=0;
    const current=drawRandom(DECK.archetypes);
    renderCard("card-current",current);
    stage=1;
    setTimeout(()=>{showGuide("── 次のカードを引く準備ができたら、クリックしてください。");},1200);
  };
});

// 二回目クリック：動画をもう一度再生し、終了後に過去・未来カードを出す
document.addEventListener("click", () => {
  if (stage === 1) {
    hideGuide();
    stage = 1.5; // 中間ステージにして二重実行を防ぐ

    // 上層動画を再表示＆再生
    video.style.display = "block";
    video.currentTime = 0;
    video.play().catch(()=>{}); // モバイル対策

    // 字幕を少しだけ再表示（不要ならこの2行は削除可）
    subtitle.style.transition = "opacity 0.8s ease";
    subtitle.style.opacity = 1;

    // この再生サイクルが終わったらカード表示へ
    video.onended = () => {
      subtitle.style.opacity = 0;

      const past = drawRandom(DECK.past);
      const future = drawRandom(DECK.future);

      renderCard("card-past", past, 0);
      renderCard("card-future", future, 0);

      stage = 2;

      // 少し間を置いてカード背景へスムーズスクロール
      setTimeout(() => {
        lowerScene.scrollIntoView({ behavior: "smooth" });
      }, 2500);
    };
  }
});
