const game = document.querySelector(".game");
const maroImg = document.getElementById("maroImg");
const reactionText = document.getElementById("reactionText");
const effect = document.getElementById("effect");
const zones = document.querySelectorAll(".zone");
const soundBtn = document.getElementById("soundBtn");
const resetBtn = document.getElementById("resetBtn");
const friendFill = document.getElementById("friendFill");
const friendValue = document.getElementById("friendValue");

let soundOn = true;
let audioCtx = null;
let lastTime = 0;
let friend = 50;
let celebrated = false;
let sleeping = false;

const foreheadMessages = [
  "そこそこ！おでこ最高〜♡",
  "おでこだいすきーー♡",
  "そこ神ポイント♡",
  "マロちゃん、とろけてる…♡",
  "オレンジのおでこ、気持ちいい〜♡"
];

const happyMessages = [
  "そこそこ〜♡ マロちゃんうっとり",
  "ぴよっ♪ 気持ちいい〜",
  "もっとカキカキして〜♡",
  "マロちゃん、ごきげん！",
  "右ほっぺ最高〜♡"
];

const badMessages = [
  "そこはイヤ〜！",
  "羽はやめて〜！",
  "お腹はイヤみたい…",
  "マロちゃん、ぷいっ",
  "ギャッ！って言われた…"
];

const maybeMessages = [
  "そこはちょっと微妙…",
  "ん？って顔してる",
  "今日は気分じゃないかも",
  "ちょっとだけなら…？"
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function showText(text, duration = 1300, keep = false) {
  reactionText.textContent = text;
  reactionText.classList.add("show");
  clearTimeout(showText.timer);
  if (!keep) {
    showText.timer = setTimeout(() => reactionText.classList.remove("show"), duration);
  }
}

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function tone(freq, delay, dur, type, vol) {
  if (!soundOn || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
  osc.frequency.exponentialRampToValueAtTime(freq * (0.9 + Math.random() * 0.28), audioCtx.currentTime + delay + dur);
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(vol, audioCtx.currentTime + delay + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + dur + 0.03);
}

function happySound() {
  initAudio();
  const base = 1200 + Math.random() * 500;
  tone(base, 0, .07, "sine", .11);
  tone(base * 1.25, .08, .08, "sine", .10);
  tone(base * 1.05, .17, .10, "triangle", .08);
}

function foreheadSound() {
  initAudio();
  const base = 1350 + Math.random() * 350;
  tone(base, 0, .07, "sine", .12);
  tone(base * 1.18, .08, .08, "sine", .11);
  tone(base * 1.35, .17, .09, "triangle", .10);
}

function bigHappySound() {
  initAudio();
  const base = 1250;
  tone(base, 0, .08, "sine", .12);
  tone(base * 1.25, .09, .08, "sine", .12);
  tone(base * 1.45, .18, .08, "triangle", .11);
  tone(base * 1.18, .30, .10, "sine", .10);
  tone(base * 1.6, .43, .12, "triangle", .09);
}

function sleepSound() {
  initAudio();
  tone(650, 0, .16, "sine", .06);
  tone(520, .18, .18, "sine", .045);
  tone(430, .42, .25, "triangle", .035);
}

function badSound() {
  initAudio();
  const base = 600 + Math.random() * 260;
  tone(base, 0, .12, "sawtooth", .08);
  tone(base * .75, .09, .12, "square", .05);
}

function maybeSound() {
  initAudio();
  tone(850 + Math.random() * 220, 0, .10, "triangle", .07);
}

function addFloat(symbol, x, y) {
  const span = document.createElement("span");
  span.className = "float";
  span.textContent = symbol;
  span.style.left = x + "px";
  span.style.top = y + "px";
  effect.appendChild(span);
  setTimeout(() => span.remove(), 950);
}

function move(type) {
  maroImg.classList.remove("happyMove", "badMove", "maybeMove", "bigHappyMove", "foreheadHappyMove");
  void maroImg.offsetWidth;
  maroImg.classList.add(type);
}

function bigHappy() {
  showText("だいすきーーー！！！♡♡♡", 2200);
  move("bigHappyMove");
  bigHappySound();

  const rect = game.getBoundingClientRect();
  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const x = 40 + Math.random() * (rect.width - 80);
      const y = 150 + Math.random() * 320;
      addFloat(Math.random() < 0.6 ? "💖" : "✨", x, y);
    }, i * 35);
  }
}

function sleepNow() {
  if (sleeping) return;
  sleeping = true;
  showText("すやぁ…zzz 満足して寝ちゃった♡", 999999, true);
  move("maybeMove");
  sleepSound();

  const rect = game.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const x = 50 + Math.random() * (rect.width - 100);
      const y = 150 + Math.random() * 280;
      addFloat(i % 2 === 0 ? "💤" : "♡", x, y);
    }, i * 70);
  }
}

function updateFriend(delta) {
  const before = friend;
  friend = clamp(friend + delta, 0, 100);
  friendFill.style.width = friend + "%";
  friendValue.textContent = friend;

  if (friend === 100 && before < 100 && !celebrated) {
    celebrated = true;
    bigHappy();
  }
}

function react(type, event) {
  if (sleeping) {
    showText("すやすや寝てるよ…zzz", 1200);
    return;
  }

  // 100%到達後、さらにカキカキされたら寝る
  if (friend === 100 && celebrated) {
    sleepNow();
    return;
  }

  const now = Date.now();
  if (now - lastTime < 170) return;
  lastTime = now;

  const rect = game.getBoundingClientRect();
  const x = (event.clientX || rect.left + rect.width / 2) - rect.left;
  const y = (event.clientY || rect.top + rect.height / 2) - rect.top;

  if (type === "forehead") {
    showText(pick(foreheadMessages));
    move("foreheadHappyMove");
    foreheadSound();
    updateFriend(7);
    addFloat("💖", x, y);
    addFloat("✨", x + 25, y + 10);
    addFloat("♡", x - 25, y + 5);
  } else if (type === "happy") {
    showText(pick(happyMessages));
    move("happyMove");
    happySound();
    updateFriend(4);
    addFloat("♡", x, y);
    addFloat("✨", x + 25, y + 10);
  } else if (type === "bad") {
    showText(pick(badMessages));
    move("badMove");
    badSound();
    updateFriend(-5);
    addFloat("ぷいっ", x - 25, y);
  } else {
    showText(pick(maybeMessages));
    move("maybeMove");
    maybeSound();
    updateFriend(1);
    addFloat("？", x, y);
  }
}

zones.forEach(zone => {
  zone.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    initAudio();
    react(zone.dataset.zone, e);
  });
  zone.addEventListener("pointermove", (e) => {
    e.preventDefault();
    react(zone.dataset.zone, e);
  });
});

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔊 音ON" : "🔇 音OFF";
  if (soundOn) happySound();
});

resetBtn.addEventListener("click", () => {
  friend = 50;
  celebrated = false;
  sleeping = false;
  friendFill.style.width = friend + "%";
  friendValue.textContent = friend;
  reactionText.classList.remove("show");
  showText("マロちゃん、なでてほしそう…");
  move("happyMove");
});
