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
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((target) => revealObserver.observe(target));

// Nav-brand click: confetti burst, plus a full replay of the homepage motion
const navBrand = document.getElementById("navBrand");
const burstColors = ["#8e0a1e", "#2e6f40", "#0c1540", "#6e0816", "#1a2456", "#add8e6"];

function burstConfetti(origin) {
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
}

if (navBrand) {
  navBrand.addEventListener("click", (e) => {
    burstConfetti(navBrand);

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
