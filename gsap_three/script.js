const CONFIG = {
  totalCards: 20,
  gridColors: [
    ["#ff7ab6", "#ff9f8f"],
    ["#8de7ff", "#86b7ff"],
    ["#ffd56a", "#ff9d6c"],
    ["#a9f5c8", "#76d8ff"],
    ["#d0a7ff", "#ff93cf"]
  ],
  finalMain: "生日快乐 🎂",
  
};

const puzzleStage = document.getElementById("puzzleStage");
const revealStage = document.getElementById("revealStage");
const giftGrid = document.getElementById("giftGrid");
const hintText = document.getElementById("hintText");
const musicBtn = document.getElementById("musicBtn");
const replayBtn = document.getElementById("replayBtn");
const messageCard = document.getElementById("messageCard");
const messageMain = messageCard.querySelector(".message-main");
const messageSub = messageCard.querySelector(".message-sub");

messageMain.textContent = CONFIG.finalMain;

let secretIndex = -1;
let hintPulseTween = null;
let unlocked = false;
let sceneStarted = false;
let renderer;
let scene;
let camera;
let cakes = [];
let confetti = [];
let animationFrame = null;
let mouse = { x: 0, y: 0 };
let audioCtx = null;
let songTimer = null;
let isSongPlaying = false;
let currentMusicGain = null;

function buildGrid() {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.totalCards; i += 1) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gift-card";
    btn.dataset.index = String(i);

    const [boxA, boxB] = CONFIG.gridColors[i % CONFIG.gridColors.length];
    btn.style.setProperty("--box-a", boxA);
    btn.style.setProperty("--box-b", boxB);

    btn.innerHTML = `
      <div class="gift-inner">
        <div class="secret-halo"></div>
        <div class="gift-core">
          <div class="candle"></div>
          <div class="flame"></div>
          <div class="gift-lid">
            <span class="ribbon-loop"></span>
            <span class="ribbon-loop right"></span>
          </div>
          <div class="gift-box"></div>
        </div>
        <span class="tiny-label">demo ${String(i + 1).padStart(2, "0")}</span>
      </div>
    `;

    btn.addEventListener("mouseenter", handleHover);
    btn.addEventListener("mouseleave", handleLeave);
    btn.addEventListener("click", handleCardClick);
    fragment.appendChild(btn);
  }

  giftGrid.appendChild(fragment);
}

function pickSecret() {
  const cards = [...document.querySelectorAll(".gift-card")];
  cards.forEach((card) => card.classList.remove("active-secret"));
  secretIndex = Math.floor(Math.random() * cards.length);
  const secretCard = cards[secretIndex];
  secretCard.classList.add("active-secret");

  if (hintPulseTween) {
    hintPulseTween.kill();
  }

  const halo = secretCard.querySelector(".secret-halo");
  hintPulseTween = gsap.timeline({ repeat: -1, yoyo: true });
  hintPulseTween
    .to(halo, { opacity: 0.45, scale: 1.03, duration: 0.9, ease: "sine.inOut" })
    .to(secretCard.querySelector(".flame"), { scaleY: 1.18, scaleX: 0.94, duration: 0.45, ease: "sine.inOut" }, 0)
    .to(secretCard.querySelector(".gift-core"), { y: -2, duration: 0.9, ease: "sine.inOut" }, 0);
}

function introAnimation() {
  gsap.from(".hero > *", {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: "power3.out"
  });

  gsap.from(".gift-card", {
    y: 40,
    opacity: 0,
    duration: 0.7,
    ease: "back.out(1.8)",
    stagger: {
      amount: 0.45,
      from: "random"
    },
    delay: 0.25
  });

  gsap.to(".orb-a", { x: 20, y: -18, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".orb-b", { x: -24, y: 12, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".spark-a", { scale: 1.8, opacity: 0.3, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".spark-b", { scale: 1.5, opacity: 0.2, duration: 1.1, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.2 });
}

function handleHover(event) {
  if (unlocked) return;
  const card = event.currentTarget;
  const lid = card.querySelector(".gift-lid");
  const core = card.querySelector(".gift-core");
  const flame = card.querySelector(".flame");

  gsap.killTweensOf([lid, core, flame]);
  gsap.to(core, { y: -8, duration: 0.35, ease: "back.out(2.2)" });
  gsap.to(lid, { rotation: card.classList.contains("active-secret") ? -16 : -10, y: -8, duration: 0.35, ease: "back.out(2.2)" });
  gsap.to(flame, { scaleY: 1.35, scaleX: 0.9, duration: 0.22, repeat: 1, yoyo: true, ease: "sine.inOut" });
}

function handleLeave(event) {
  if (unlocked) return;
  const card = event.currentTarget;
  const lid = card.querySelector(".gift-lid");
  const core = card.querySelector(".gift-core");

  gsap.to(core, { y: 0, duration: 0.28, ease: "power2.out" });
  gsap.to(lid, { rotation: 0, y: 0, duration: 0.28, ease: "power2.out" });
}



function handleCardClick(event) {
  if (unlocked) return;
  const card = event.currentTarget;
  const index = Number(card.dataset.index);

  if (index === secretIndex) {
    unlocked = true;
    revealBirthdayScene(card);
  } else {
    wrongHint(card);
  }
}

function revealBirthdayScene(targetCard) {
  if (hintPulseTween) {
    hintPulseTween.kill();
  }

  const flash = document.createElement("div");
  flash.className = "flash-layer";
  document.body.appendChild(flash);

  const cards = [...document.querySelectorAll(".gift-card")];
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to(targetCard.querySelector(".gift-lid"), { rotation: -24, y: -14, duration: 0.4 })
    .to(targetCard.querySelector(".gift-core"), { y: -10, duration: 0.3 }, 0)
    .to(targetCard.querySelector(".secret-halo"), { opacity: 1, scale: 1.35, duration: 0.35 }, 0)
    .to(flash, { opacity: 1, duration: 0.25 }, 0.18)
    .to(cards.filter((item) => item !== targetCard), {
      y: 80,
      opacity: 0,
      duration: 0.45,
      stagger: { amount: 0.25, from: "random" }
    }, 0.08)
    .to(targetCard, { scale: 1.12, duration: 0.3 }, 0.12)
    .to(puzzleStage, { opacity: 0, duration: 0.45 }, 0.45)
    .add(() => {
      puzzleStage.style.display = "none";
      revealStage.classList.add("active");
      revealStage.setAttribute("aria-hidden", "false");
      gsap.fromTo(revealStage, { opacity: 0 }, { opacity: 1, duration: 0.6 });
      if (!sceneStarted) {
        initThreeScene();
        sceneStarted = true;
      }
      playBirthdaySong();
      musicBtn.textContent = "❚❚ 暂停生日歌";
      runRevealIntro();
    })
    .to(flash, { opacity: 0, duration: 0.6 }, ">-0.1")
    .add(() => flash.remove());
}

function runRevealIntro() {
  gsap.fromTo(
    ".overlay-panel > *",
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }
  );

  gsap.fromTo(
    messageCard,
    { y: 20, scale: 0.96, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 0.8, delay: 0.25, ease: "back.out(1.7)" }
  );
}

function initThreeScene() {
  const mount = document.getElementById("threeCanvas");
  const width = mount.clientWidth || window.innerWidth;
  const height = mount.clientHeight || window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1.7, 14);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  mount.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xfff4ea, 1.35);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xffd79c, 1.8, 60);
  keyLight.position.set(2, 8, 8);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x8de7ff, 1.25, 60);
  rimLight.position.set(-8, 4, 10);
  scene.add(rimLight);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(11, 64),
    new THREE.MeshStandardMaterial({
      color: 0x20152f,
      transparent: true,
      opacity: 0.6,
      roughness: 0.95,
      metalness: 0.05
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.8;
  scene.add(floor);

  const cakePalette = [
    [0xffa4cb, 0xfff4d7, 0xffd56a],
    [0x9ee7ff, 0xe9fbff, 0xa9f5c8],
    [0xd8b0ff, 0xffeef8, 0xff9f8f]
  ];

  cakes = [
    createCake(cakePalette[0], -4.2),
    createCake(cakePalette[1], 0),
    createCake(cakePalette[2], 4.2)
  ];

  cakes.forEach((cake) => scene.add(cake.group));
  createConfetti();

  animateThree();
  window.addEventListener("resize", handleResize);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
}

function createCake(palette, x) {
  const group = new THREE.Group();
  group.position.set(x, -0.8, 0);

  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(1.95, 2.2, 0.28, 48),
    new THREE.MeshStandardMaterial({ color: 0xf5edf6, roughness: 0.65, metalness: 0.12 })
  );
  stand.position.y = -1.45;
  group.add(stand);

  const tiers = [
    { r: 1.55, h: 0.88, y: -0.85, color: palette[0] },
    { r: 1.15, h: 0.75, y: -0.02, color: palette[1] },
    { r: 0.78, h: 0.58, y: 0.68, color: palette[0] }
  ];

  tiers.forEach((tier) => {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 48),
      new THREE.MeshStandardMaterial({ color: tier.color, roughness: 0.82, metalness: 0.05 })
    );
    body.position.y = tier.y;
    group.add(body);

    const icing = new THREE.Mesh(
      new THREE.TorusGeometry(tier.r * 0.98, 0.12, 18, 48),
      new THREE.MeshStandardMaterial({ color: palette[2], roughness: 0.55, metalness: 0.02 })
    );
    icing.rotation.x = Math.PI / 2;
    icing.position.y = tier.y + tier.h / 2 - 0.03;
    group.add(icing);
  });

  for (let i = 0; i < 5; i += 1) {
    const candleGroup = new THREE.Group();
    const angle = (Math.PI * 2 * i) / 5;
    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.56, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28, metalness: 0.02 })
    );
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 18, 18),
      new THREE.MeshBasicMaterial({ color: 0xffb84d, transparent: true, opacity: 0.95 })
    );
    candle.position.y = 1.32;
    flame.position.y = 1.67;
    flame.scale.set(0.8, 1.3, 0.8);
    candleGroup.position.set(Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4);
    candleGroup.add(candle, flame);
    group.add(candleGroup);
  }

  const sprinkles = new THREE.Group();
  for (let i = 0; i < 18; i += 1) {
    const sprinkle = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.05, 0.05),
      new THREE.MeshStandardMaterial({
        color: [0xffffff, palette[2], 0xff7ab6, 0x8de7ff][i % 4],
        roughness: 0.45,
        metalness: 0.08
      })
    );
    sprinkle.position.set((Math.random() - 0.5) * 1.8, -0.32 + Math.random() * 1.65, (Math.random() - 0.5) * 1.8);
    sprinkle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    sprinkles.add(sprinkle);
  }
  group.add(sprinkles);

  return {
    group,
    floatOffset: Math.random() * Math.PI * 2,
    spinSpeed: 0.006 + Math.random() * 0.004
  };
}

function createConfetti() {
  const geometry = new THREE.BoxGeometry(0.12, 0.18, 0.02);
  const colors = [0xff7ab6, 0x8de7ff, 0xffd56a, 0xa9f5c8, 0xffffff];

  for (let i = 0; i < 120; i += 1) {
    const material = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
    const piece = new THREE.Mesh(geometry, material);
    piece.position.set((Math.random() - 0.5) * 18, Math.random() * 16 - 1, (Math.random() - 0.5) * 8);
    piece.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    piece.userData = {
      fallSpeed: 0.015 + Math.random() * 0.03,
      drift: (Math.random() - 0.5) * 0.01,
      spinX: 0.02 + Math.random() * 0.04,
      spinY: 0.01 + Math.random() * 0.03
    };
    confetti.push(piece);
    scene.add(piece);
  }
}

function animateThree() {
  animationFrame = requestAnimationFrame(animateThree);
  const time = performance.now() * 0.001;

  cakes.forEach((cake, index) => {
    cake.group.rotation.y += cake.spinSpeed;
    cake.group.position.y = -0.8 + Math.sin(time * 1.6 + cake.floatOffset) * 0.18;
    cake.group.rotation.z = Math.sin(time * 1.2 + index) * 0.02;

    cake.group.children.forEach((child) => {
      if (child.type === "Group") {
        child.children.forEach((inner) => {
          if (inner.material && inner.material.color && inner.geometry && inner.geometry.type === "SphereGeometry") {
            const pulse = 0.85 + Math.sin(time * 8 + index) * 0.18;
            inner.scale.set(0.8 * pulse, 1.3 * pulse, 0.8 * pulse);
          }
        });
      }
    });
  });

  confetti.forEach((piece) => {
    piece.position.y -= piece.userData.fallSpeed;
    piece.position.x += piece.userData.drift;
    piece.rotation.x += piece.userData.spinX;
    piece.rotation.y += piece.userData.spinY;

    if (piece.position.y < -3.4) {
      piece.position.y = 12 + Math.random() * 4;
      piece.position.x = (Math.random() - 0.5) * 18;
      piece.position.z = (Math.random() - 0.5) * 8;
    }
  });

  camera.position.x += ((mouse.x * 1.1) - camera.position.x) * 0.04;
  camera.position.y += ((1.7 + mouse.y * 0.65) - camera.position.y) * 0.04;
  camera.lookAt(0, -0.2, 0);
  renderer.render(scene, camera);
}

function handleResize() {
  if (!renderer || !camera) return;
  const mount = document.getElementById("threeCanvas");
  const width = mount.clientWidth || window.innerWidth;
  const height = mount.clientHeight || window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function handlePointerMove(event) {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = (event.clientY / window.innerHeight) * 2 - 1;
  mouse.x = x * 1.4;
  mouse.y = -y * 0.8;
}

function ensureAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function noteFrequency(note) {
  const map = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.0,
    A4: 440.0,
    Bb4: 466.16,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    F5: 698.46,
    G5: 783.99,
    REST: 0
  };
  return map[note] || 0;
}

function scheduleTone(startTime, duration, note, volume = 0.04) {
  if (note === "REST" || !audioCtx || !currentMusicGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(noteFrequency(note), startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration - 0.03);
  osc.connect(gain);
  gain.connect(currentMusicGain);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playBirthdaySong() {
  const ctx = ensureAudio();
  if (!ctx) return;

  stopBirthdaySong();
  isSongPlaying = true;

  currentMusicGain = ctx.createGain();
  currentMusicGain.gain.value = 1;
  currentMusicGain.connect(ctx.destination);

  const melody = [
    ["G4", 0.36], ["G4", 0.18], ["A4", 0.5], ["G4", 0.5], ["C5", 0.5], ["Bb4", 0.9],
    ["G4", 0.36], ["G4", 0.18], ["A4", 0.5], ["G4", 0.5], ["D5", 0.5], ["C5", 0.9],
    ["G4", 0.36], ["G4", 0.18], ["G5", 0.5], ["E5", 0.5], ["C5", 0.5], ["Bb4", 0.5], ["A4", 0.9],
    ["F5", 0.36], ["F5", 0.18], ["E5", 0.5], ["C5", 0.5], ["D5", 0.5], ["C5", 1.1]
  ];

  let cursor = ctx.currentTime + 0.06;
  melody.forEach(([note, duration]) => {
    scheduleTone(cursor, duration, note, 0.045);
    cursor += duration;
  });

  songTimer = window.setTimeout(() => {
    if (isSongPlaying) playBirthdaySong();
  }, (cursor - ctx.currentTime) * 1000 + 200);
}

function stopBirthdaySong() {
  if (songTimer) {
    clearTimeout(songTimer);
    songTimer = null;
  }
  isSongPlaying = false;
  if (currentMusicGain && audioCtx) {
    const now = audioCtx.currentTime;
    try {
      currentMusicGain.gain.cancelScheduledValues(now);
      currentMusicGain.gain.setValueAtTime(currentMusicGain.gain.value || 1, now);
      currentMusicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      setTimeout(() => {
        try {
          currentMusicGain.disconnect();
        } catch (error) {
          // ignore
        }
        currentMusicGain = null;
      }, 90);
    } catch (error) {
      currentMusicGain = null;
    }
  }
}

musicBtn.addEventListener("click", () => {
  if (!isSongPlaying) {
    playBirthdaySong();
    musicBtn.textContent = "❚❚ 暂停生日歌";
  } else {
    stopBirthdaySong();
    musicBtn.textContent = "▶ 播放生日歌";
  }
});



buildGrid();
pickSecret();
introAnimation();
