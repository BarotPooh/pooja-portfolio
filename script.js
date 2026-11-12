document.documentElement.classList.add("js");

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}

navToggle.addEventListener("click", () => {
  setMenu(!navLinks.classList.contains("is-open"));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

// Close the overlay on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
    setMenu(false);
    navToggle.focus();
  }
});

const revealTargets = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

// Count headline numbers up from zero when they scroll into view
const COUNT_UP_MS = 900;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countUp(el, target) {
  const { prefix, suffix } = el.dataset;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / COUNT_UP_MS, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (!prefersReducedMotion) {
  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target, Number(entry.target.dataset.count));
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".stat dd, .proof-figure").forEach((figure) => {
    const match = figure.textContent.trim().match(/^(\D*)(\d+)(\D*)$/);
    if (!match) return;
    [, figure.dataset.prefix, figure.dataset.count, figure.dataset.suffix] = match;
    countObserver.observe(figure);
  });
}

// Confetti burst at a screen position
const burstColors = ["#8e0a1e", "#2e6f40", "#0c1540", "#6e0816", "#1a2456", "#add8e6"];

function burstConfettiAt(x, y) {
  const origin = document.createElement("div");
  origin.className = "confetti-origin";
  origin.style.left = `${x}px`;
  origin.style.top = `${y}px`;
  document.body.appendChild(origin);
  for (let i = 0; i < 10; i++) {
    const dot = document.createElement("span");
    dot.className = "brand-confetti";
    const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
    const distance = 36 + Math.random() * 28;
    dot.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    dot.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
    dot.style.background = burstColors[i % burstColors.length];
    origin.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  }
  setTimeout(() => origin.remove(), 800);
}

// Nav-brand click: confetti burst, plus a replay of the homepage hero motion
const navBrand = document.querySelector(".nav-brand");
if (navBrand) {
  navBrand.addEventListener("click", (e) => {
    burstConfettiAt(e.clientX, e.clientY);
    if (document.body.classList.contains("is-home")) {
      e.preventDefault();
      document.body.classList.remove("animate-replay");
      // eslint-disable-next-line no-unused-expressions
      void document.body.offsetWidth; // restart animation
      document.body.classList.add("animate-replay");
      setTimeout(() => document.body.classList.remove("animate-replay"), 1200);
    }
  });
}
