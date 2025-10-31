// ==== Whisper演出スクリプト（音声なし・30%レアセリフ仕様） ====

// --- セリフデータ ---

// 通常セリフ（通常観測）
const normalWhispers = [
  "── 手を離すと、水面に揺らめきながら浮かび上がった。",
  "── 波が鎮まれば、描かれていたものが読めた。",
  "── 手を伸ばしたら、たしかにそれは私の手の中にあった。"
];

// レアセリフ（構造の反転）
const rareWhispers = [
  "── 水面の下で、あの手が私を離していた。",
  "── 波がひとりでに鎮まり、私の輪郭を描き始めた。",
  "── 光の中で、手も私も、区別がつかなくなっていた。"
];

// --- 30%の確率でレアを選択 ---
const isRare = Math.random() < 0.3;
const whispers = isRare ? rareWhispers : normalWhispers;

// --- 再生制御変数 ---
let whisperIndex = 0;

// --- フェードイン・アウト付きでテキスト表示 ---
function showNextWhisper() {
  if (whisperIndex >= whispers.length) {
    // フェードアウトして削除
    document.getElementById("veil").style.opacity = 0;
    setTimeout(() => {
      document.getElementById("veil").remove();
      document.getElementById("whisper").remove();
    }, 3000);
    return;
  }

  const whisper = document.getElementById("whisper");

  // クラス変更（レアか通常かで色味を変える）
  if (isRare) {
    whisper.classList.add("rare-whisper");
    whisper.classList.remove("normal-whisper");
  } else {
    whisper.classList.add("normal-whisper");
    whisper.classList.remove("rare-whisper");
  }

  // テキスト設定とフェード
  whisper.textContent = whispers[whisperIndex++];
  whisper.style.opacity = 1;
  whisper.style.display = "block";

  setTimeout(() => {
    whisper.style.opacity = 0;
    setTimeout(showNextWhisper, 2000); // 次の囁きまでの間
  }, 3000); // 表示時間
}

// --- ページロード時に開始 ---
window.onload = function () {
  showNextWhisper();

  // 背景関連要素
  const image = document.getElementById("oracleimage");
  const video = document.getElementById("oracleritual");
  const subtitle = document.getElementById("subtitle");
  const cards = [
    document.getElementById("card1"),
    document.getElementById("card2"),
    document.getElementById("card3")
  ];

  // 背景クリックイベント
  image.addEventListener("click", () => {
    image.style.display = "none";
    video.style.display = "block";
    video.play();

    setTimeout(() => {
      subtitle.style.opacity = 1;
    }, 2000);

    // カードが順に浮かび上がる
    setTimeout(() => {
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = 1;
          card.style.transform = "translateY(0)";
        }, index * 800);
      });
    }, 3500);
  });
};
