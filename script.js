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

const happyMessages = [
  "そこそこ〜♡ マロちゃんうっとり",
  "ぴよっ♪ 気持ちいい〜",
  "もっとカキカキして〜♡",
  "マロちゃん、ごきげん！",
  "ほっぺ最高〜♡",
  "おでこカキカキ、だいすき！"
];

const badMessages = [
  "そこはイヤ〜！",
  "羽はやめて〜！",
  "お腹はイヤみたい…",
  "マロちゃん、ぷいっ",
  "ギャッ！って言われた…"
];

const maybeMessages = [
  "足はちょっと微妙…",
  "ん？って顔してる",
  "足は今日は気分じゃないかも",
  "ちょっとだけなら…？"
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function updateFriend(delta) {
  friend = clamp(friend + delta, 0, 100);
  friendFill.style.width = friend + "%";
  friendValue.textContent = friend;
}

function showText(text) {
  reactionText.textContent = text;
  reactionText.classList.add("show");
  clearTimeout(showText.timer);
  showText.timer = setTimeout(() => reactionText.classList.remove("show"), 1300);
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
  maroImg.classList.remove("happyMove", "badMove", "maybeMove");
  void maroImg.offsetWidth;
  maroImg.classList.add(type);
}

function react(type, event) {
  const now = Date.now();
  if (now - lastTime < 170) return;
  lastTime = now;

  const rect = game.getBoundingClientRect();
  const x = (event.clientX || rect.left + rect.width / 2) - rect.left;
  const y = (event.clientY || rect.top + rect.height / 2) - rect.top;

  if (type === "happy") {
    showText(pick(happyMessages));
    move("happyMove");
    happySound();
    updateFriend(3);
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
    updateFriend(Math.random() < 0.5 ? -1 : 1);
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
  updateFriend(0);
  showText("マロちゃん、なでてほしそう…");
  move("happyMove");
});
