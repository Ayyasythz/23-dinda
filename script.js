const wishes = [
  "Dummy wish #1: May your day be full of pink skies, soft smiles, and sweet surprises.",
  "Dummy wish #2: Replace this with a personal birthday hope that sounds exactly like you.",
  "Dummy wish #3: Add a line about your future together, your memories, or a cute inside joke.",
  "Dummy wish #4: Write something short, warm, and special for her to remember."
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

document.addEventListener("click", (event) => {
  if (event.target.closest(".pixel-button")) {
    return;
  }

  createSparkle(event.clientX, event.clientY);
});

setupReveal();
setupGalleryReveal();
startAmbientHearts();
setupPlayer();
setupIntroScreen();
