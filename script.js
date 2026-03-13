const wishes = [
  "Semogaa kamuu makin cantikk, lucuu, kerennn, baikk, sholehah",
  "Semoga kamu suksessssss",
  "Semogaa kamuu sayanggg aku terusssss",
];

const wishText = document.getElementById("wish-text");
const wishButton = document.getElementById("wish-button");
const magicButton = document.getElementById("magic-button");
const decorLayer = document.getElementById("floating-decor");
const toast = document.getElementById("toast");
const revealItems = document.querySelectorAll(".reveal");
const audio = document.getElementById("birthday-audio");
const playerToggle = document.getElementById("player-toggle");
const progress = document.getElementById("player-progress");
const progressFill = document.getElementById("progress-fill");
const currentTimeLabel = document.getElementById("current-time");
const durationLabel = document.getElementById("duration");
const introScreen = document.getElementById("intro-screen");
const enterSiteButton = document.getElementById("enter-site-button");
const introMagicButton = document.getElementById("intro-magic-button");

let wishIndex = 0;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function createHeart(x, y, size = 14, duration = 2200) {
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.animationDuration = `${duration}ms`;
  decorLayer.appendChild(heart);

  window.setTimeout(() => {
    heart.remove();
  }, duration);
}

function createSparkle(x, y) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  decorLayer.appendChild(sparkle);

  window.setTimeout(() => {
    sparkle.remove();
  }, 900);
}

function burstMagic(target) {
  const rect = target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 12; i += 1) {
    const offsetX = (Math.random() - 0.5) * 140;
    const offsetY = (Math.random() - 0.5) * 70;
    createHeart(centerX + offsetX, centerY + offsetY, 12 + Math.random() * 10, 1600 + Math.random() * 1200);
    createSparkle(centerX + offsetX * 0.7, centerY + offsetY * 0.7);
  }
}

function getElementCenter(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

function cycleWish(showMessage = true) {
  wishIndex = (wishIndex + 1) % wishes.length;
  wishText.textContent = wishes[wishIndex];
  if (showMessage) {
    showToast("Wish updated!");
  }
  burstMagic(wishButton);
}

function formatTime(timeInSeconds) {
  if (!Number.isFinite(timeInSeconds)) {
    return "0:00";
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updatePlayerProgress() {
  if (!audio || !progress || !progressFill || !currentTimeLabel) {
    return;
  }

  const duration = audio.duration || 0;
  const currentTime = audio.currentTime || 0;
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  progress.value = String(percent);
  progressFill.style.width = `${percent}%`;
  currentTimeLabel.textContent = formatTime(currentTime);
}

function syncDuration() {
  if (!audio || !durationLabel) {
    return;
  }

  durationLabel.textContent = formatTime(audio.duration);
  updatePlayerProgress();
}

function syncPlayState() {
  if (!audio || !playerToggle) {
    return;
  }

  playerToggle.textContent = audio.paused ? "Play" : "Pause";
  playerToggle.setAttribute("aria-label", audio.paused ? "Play song" : "Pause song");
}

function setupPlayer() {
  if (!audio || !playerToggle || !progress) {
    return;
  }

  syncPlayState();
  syncDuration();

  playerToggle.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
      burstMagic(playerToggle);
    } catch (error) {
      showToast("Audio could not start.");
    }
  });

  progress.addEventListener("input", () => {
    const duration = audio.duration || 0;
    const nextTime = duration * (Number(progress.value) / 100);
    audio.currentTime = nextTime;
    updatePlayerProgress();
  });

  audio.addEventListener("loadedmetadata", syncDuration);
  audio.addEventListener("durationchange", syncDuration);
  audio.addEventListener("timeupdate", updatePlayerProgress);
  audio.addEventListener("play", syncPlayState);
  audio.addEventListener("pause", syncPlayState);
  audio.addEventListener("ended", () => {
    syncPlayState();
    updatePlayerProgress();
    showToast("Song finished!");
  });
}

function burstAtPoint(x, y, count = 12) {
  for (let i = 0; i < count; i += 1) {
    const offsetX = (Math.random() - 0.5) * 180;
    const offsetY = (Math.random() - 0.5) * 120;
    createHeart(x + offsetX, y + offsetY, 10 + Math.random() * 10, 1600 + Math.random() * 1200);
    createSparkle(x + offsetX * 0.8, y + offsetY * 0.8);
  }
}

function burstAtElement(element, count = 12) {
  const { x, y } = getElementCenter(element);
  burstAtPoint(x, y, count);
}

function unlockExperience() {
  if (!introScreen) {
    return;
  }

  document.body.classList.remove("intro-active");
  introScreen.classList.add("hidden");
  showToast("Welcome to the birthday surprise!");
  burstAtPoint(window.innerWidth / 2, window.innerHeight / 2, 16);
}

function setupIntroScreen() {
  if (!enterSiteButton || !introMagicButton) {
    return;
  }

  enterSiteButton.addEventListener("click", () => {
    unlockExperience();
  });

  introMagicButton.addEventListener("click", () => {
    burstAtElement(introMagicButton, 20);
    showToast("Hearts sent!");
  });
}

function startAmbientHearts() {
  window.setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight - 20 - Math.random() * 100;
    const size = 8 + Math.random() * 12;
    const duration = 2200 + Math.random() * 1800;
    createHeart(x, y, size, duration);
  }, 700);
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
}

// Re-trigger gallery card entrance animations when section scrolls into view
function setupGalleryReveal() {
  const gallerySection = document.querySelector(".gallery-grid");
  if (!gallerySection) return;

  const cards = gallerySection.querySelectorAll(".gallery-card");

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cards.forEach((card) => {
          card.style.animation = "none";
          card.offsetHeight; // reflow
          card.style.animation = "";
        });
      }
    });
  }, { threshold: 0.2 });

  obs.observe(gallerySection);
}

// 3-D perspective tilt + heart-burst on click for gallery cards
function setupGalleryInteractions() {
  const cards = document.querySelectorAll(".gallery-card");

  cards.forEach((card) => {
    // 3D tilt on mousemove
    card.addEventListener("mousemove", (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = -(dy * 14).toFixed(2);
      const tiltY =  (dx * 14).toFixed(2);
      card.style.transform =
        `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
      card.style.boxShadow =
        `${-dx * 12}px ${-dy * 12}px 40px rgba(255,105,180,0.55)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });

    // heart / sparkle burst on click
    card.addEventListener("click", (e) => {
      const EMOJIS = ["💖", "✨", "🌸", "💕", "⭐", "🎀"];
      for (let i = 0; i < 10; i++) {
        const el  = document.createElement("span");
        el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const angle  = Math.random() * 2 * Math.PI;
        const dist   = 60 + Math.random() * 90;
        el.style.cssText = `
          position:fixed;
          left:${e.clientX}px;
          top:${e.clientY}px;
          font-size:${14 + Math.random() * 14}px;
          pointer-events:none;
          z-index:9999;
          transition: transform ${0.6 + Math.random() * 0.5}s cubic-bezier(.22,1,.36,1),
                      opacity   ${0.6 + Math.random() * 0.4}s ease;
          transform:translate(-50%,-50%);
          opacity:1;
        `;
        document.body.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transform =
            `translate(calc(-50% + ${Math.cos(angle) * dist}px),
                       calc(-50% + ${Math.sin(angle) * dist}px)) scale(1.4)`;
          el.style.opacity = "0";
        });
        setTimeout(() => el.remove(), 1200);
      }
    });
  });
}

wishButton.addEventListener("click", cycleWish);

magicButton.addEventListener("click", () => {
  burstAtElement(magicButton, 24);
  cycleWish(false);
  showToast("Birthday magic started!");

  if (audio && audio.paused) {
    audio.play().catch(() => {
      showToast("Birthday magic started, but audio needs a valid file.");
    });
  }
});

// Kiss button — shower of kisses from button position
const kissButton = document.getElementById("kiss-button");
if (kissButton) {
  kissButton.addEventListener("click", () => {
    const KISS = ["💋", "💕", "💖", "😘", "🌸", "💗"];
    const rect = kissButton.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    for (let i = 0; i < 18; i++) {
      const el = document.createElement("span");
      el.textContent = KISS[Math.floor(Math.random() * KISS.length)];
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
      const dist  = 80 + Math.random() * 140;
      const dur   = 0.8 + Math.random() * 0.6;
      el.style.cssText = `
        position:fixed; left:${cx}px; top:${cy}px;
        font-size:${16 + Math.random() * 18}px;
        pointer-events:none; z-index:9999;
        transition: transform ${dur}s cubic-bezier(.22,1,.36,1), opacity ${dur}s ease;
        transform: translate(-50%,-50%); opacity:1;
      `;
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(1.5)`;
        el.style.opacity   = "0";
      });
      setTimeout(() => el.remove(), (dur + 0.1) * 1000);
    }
    showToast("Sending kisses! 💋");
  });
}

// Love meter — click the heart tap button to fill it up
(function setupLoveMeter() {
  const tapBtn   = document.getElementById("love-tap");
  const fill     = document.getElementById("love-fill");
  const count    = document.getElementById("love-count");
  if (!tapBtn || !fill || !count) return;

  let level = 0; // 0–100

  function addLove() {
    level = Math.min(100, level + 7);
    fill.style.width  = level + "%";
    count.textContent = level + "%";

    // burst hearts from the tap button
    const rect = tapBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    for (let i = 0; i < 5; i++) {
      const h = document.createElement("span");
      h.textContent = ["💖","💗","💕","❤️"][Math.floor(Math.random()*4)];
      const angle = -Math.PI/2 + (Math.random()-0.5)*Math.PI;
      const dist  = 40 + Math.random()*60;
      h.style.cssText = `
        position:fixed; left:${cx}px; top:${cy}px;
        font-size:${12+Math.random()*12}px;
        pointer-events:none; z-index:9999;
        transition: transform 0.7s cubic-bezier(.22,1,.36,1), opacity 0.7s ease;
        transform:translate(-50%,-50%); opacity:1;
      `;
      document.body.appendChild(h);
      requestAnimationFrame(() => {
        h.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(1.3)`;
        h.style.opacity   = "0";
      });
      setTimeout(() => h.remove(), 800);
    }

    if (level >= 100) {
      showToast("Love meter FULL! 💖💖💖");
      // reset after a moment
      setTimeout(() => { level = 0; fill.style.width = "0%"; count.textContent = "0%"; }, 2200);
    }
  }

  tapBtn.addEventListener("click", addLove);
  document.getElementById("love-meter")?.addEventListener("click", addLove);
})();

document.addEventListener("click", (event) => {
  if (event.target.closest(".pixel-button")) {
    return;
  }

  createSparkle(event.clientX, event.clientY);
});

setupReveal();
setupGalleryReveal();
setupGalleryInteractions();
startAmbientHearts();
setupPlayer();
setupIntroScreen();
