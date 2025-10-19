// ===== Oracle: staging & safety enhanced =====

// 30%で Dark Oracle。ただしセッション内は固定（リロードでブレない）
const CORRUPT_KEY = 'oracle.isCorrupted';
let isCorrupted = sessionStorage.getItem(CORRUPT_KEY);
if (isCorrupted === null) {
  isCorrupted = Math.random() < 0.3 ? '1' : '0';
  sessionStorage.setItem(CORRUPT_KEY, isCorrupted);
}
isCorrupted = isCorrupted === '1';

// ささやき文面
const whispers = isCorrupted
  ? ["──お前の声など、もう届かない。","──誰もお前を選ばない。","──この世界に、意味はなかった。"]
  : ["── どうして、まだ眠っているの？","── 君の記憶に、私の影は残っていないの？","── 見つけて。私は、君の中にいる。"];

// ユーティリティ
const $id = (id) => document.getElementById(id);
const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

// 要素取得（存在チェックは各所で）
const veil      = $id('veil');
const whisperEl = $id('whisper');
const whisperAudio = $id('whisperSound');
const noise = $id('noiseLoop');
const image = $id('oracleimage');
const video = $id('oracleritual');
const subtitle = $id('subtitle');
const cards = [$id('card1'), $id('card2'), $id('card3')];

let whisperIndex = 0;
let whisperTimers = [];

// ===== オーディオ系 =====
function safePlay(audioEl) {
  if (!audioEl) return Promise.resolve();
  try {
    const p = audioEl.play();
    if (p && typeof p.catch === 'function') {
      return p.catch(() => Promise.reject());
    }
    return Promise.resolve();
  } catch { return Promise.reject(); }
}

function playWhisperSound() {
  if (!whisperAudio) return;
  try {
    whisperAudio.currentTime = 0;
    safePlay(whisperAudio).catch(() => {/* ブロックされたら黙る */});
  } catch {}
}

// ノイズは音量控えめ、失敗したら初回ユーザー操作で再試行
function initNoise() {
  if (!noise) return;
  noise.volume = 0.1;
  safePlay(noise).catch(() => {
    const resume = () => {
      safePlay(noise).finally(() => {
        document.removeEventListener('click', resume, { capture: true });
      });
    };
    document.addEventListener('click', resume, { capture: true, once: true });
  });

  // タブ非表示時の配慮：ミュート/復帰
  document.addEventListener('visibilitychange', () => {
    if (!noise) return;
    noise.muted = document.hidden;
  });
}

// ===== ささやき演出 =====
function clearWhisperTimers() {
  whisperTimers.forEach(t => clearTimeout(t));
  whisperTimers = [];
}

function hideVeilAndWhisper() {
  if (veil) {
    veil.style.opacity = 0;
    // クリック透過（CSSのpointer-events:noneと連動）
    veil.setAttribute('aria-hidden', 'true');

    const cleanup = () => {
      try { veil.remove(); } catch {}
      try { whisperEl?.remove(); } catch {}
    };

    // transitionend か、保険のタイムアウトで片付け
    const onEnd = (e) => {
      if (e.target !== veil || e.propertyName !== 'opacity') return;
      veil.removeEventListener('transitionend', onEnd);
      cleanup();
    };
    veil.addEventListener('transitionend', onEnd);
    whisperTimers.push(setTimeout(cleanup, 3200));
  } else {
    whisperEl?.remove();
  }
}

function showNextWhisper() {
  if (!whisperEl) { hideVeilAndWhisper(); return; }

  // 終了条件
  if (whisperIndex >= whispers.length) {
    hideVeilAndWhisper();
    return;
  }

  // Dark/Light モードのクラス切替
  if (isCorrupted) {
    whisperEl.classList.add('dark-whisper');
    whisperEl.classList.remove('flicker-whisper');
  } else {
    whisperEl.classList.add('flicker-whisper');
    whisperEl.classList.remove('dark-whisper');
  }

  whisperEl.textContent = whispers[whisperIndex++];
  whisperEl.style.display = 'block';
  // 透明からフェードイン
  whisperEl.style.opacity = '1';
  playWhisperSound();

  // 時間設計（reduce時は短縮）
  const visibleMs = prefersReduced ? 1200 : 3000;
  const gapMs = prefersReduced ? 400 : 2000;

  whisperTimers.push(setTimeout(() => {
    whisperEl.style.opacity = '0';
    whisperTimers.push(setTimeout(showNextWhisper, gapMs));
  }, visibleMs));
}

// ===== クリックで背景を起動 =====
function startBackgroundSequence() {
  if (!image || !video) return;

  // 画像→動画
  image.style.display = 'none';
  video.style.display = 'block';
  try { video.muted = true; } catch {}
  safePlay(video).catch(() => { /* 自動再生失敗は無音でOK */ });

  // サブタイトル出現
  const showSubtitle = () => { if (subtitle) subtitle.style.opacity = '1'; };
  const revealCards = () => {
    const list = cards.filter(Boolean);
    list.forEach((card, idx) => {
      const delay = idx * (prefersReduced ? 150 : 800);
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, delay);
    });
  };

  setTimeout(showSubtitle, prefersReduced ? 400 : 2000);
  setTimeout(revealCards, prefersReduced ? 800 : 3500);
}

// ===== 起動 =====
window.addEventListener('load', () => {
  // 囁きスタート
  showNextWhisper();
  initNoise();

  // 背景起動（画像クリックで一度だけ）
  if (image) {
    image.addEventListener('click', startBackgroundSequence, { once: true });
  }

  // ページ離脱時にタイマー掃除（SPAで再入を想定）
  window.addEventListener('beforeunload', clearWhisperTimers, { once: true });
});
