/* =========================================================
   CONFIGURACIÓN — editá estos valores
   ========================================================= */

// Número de WhatsApp con código de país, sin "+", espacios ni guiones.
// Ejemplo Argentina: 549 + característica sin 0 + número sin 15 → "5493534123456"
const WHATSAPP_NUMBER = "+5493472432823";

// Publicaciones y reels de Instagram que se muestran en el carrusel de Multimedia.
// Para agregar uno: abrí el post en Instagram, copiá el link y pegalo en esta lista.
const IG_POSTS = [
  "https://www.instagram.com/p/DXWtL8iDvqt/",
  "https://www.instagram.com/p/DXWsf2sjiuI/",
  "https://www.instagram.com/p/DXWsTrPjsfY/",
  "https://www.instagram.com/reel/DbI-dIHKXrk/",
  "https://www.instagram.com/reel/DbI-DS0qWt1/",
  "https://www.instagram.com/reel/DbI9wa7qA4o/",
  "https://www.instagram.com/reel/DYewbYEq0jt/",
  "https://www.instagram.com/reel/DYev91YqCL0/",
  "https://www.instagram.com/reel/DYevoUWqN__/",
  "https://www.instagram.com/reel/DYevKGdKMJA/",
  "https://www.instagram.com/reel/DXIDtqfiseT/",
  "https://www.instagram.com/reel/DXICxbfCu_e/",
];

/* ========================================================= */

const whatsappUrl = (text = "") => {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}${query}`;
};

if (!WHATSAPP_NUMBER) {
  console.warn("Falta configurar WHATSAPP_NUMBER en js/main.js");
}

// ---------- Links de WhatsApp ----------
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = whatsappUrl("¡Hola Emanuel! Quiero hacerte una consulta.");
});

// ---------- Año del footer ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Header: estado al hacer scroll ----------
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Menú móvil ----------
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

const setMenu = (open) => {
  mobileMenu.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
menuToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));
mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// ---------- Link activo según la sección visible ----------
const navLinks = document.querySelectorAll(".nav a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Animaciones de entrada ----------
const revealTargets = document.querySelectorAll(
  ".section-head, .about-copy, .credentials, .plans-grid, .media-cta, .consult-copy, .consult-form"
);
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// ---------- Lightbox de planes ----------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
let lastFocused = null;

const openLightbox = (trigger) => {
  const img = trigger.querySelector("img");
  lastFocused = trigger;
  lightboxImg.src = trigger.dataset.lightbox;
  lightboxImg.alt = img ? img.alt : "";
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
};
const closeLightbox = () => {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
};

document.querySelectorAll("[data-lightbox]").forEach((btn) => {
  btn.addEventListener("click", () => openLightbox(btn));
});
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});

// ---------- Carrusel de Instagram ----------
const carousel = document.getElementById("igCarousel");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

const igIcon =
  '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg>';

IG_POSTS.forEach((url, i) => {
  const isReel = url.includes("/reel/");
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.setAttribute("role", "group");
  slide.setAttribute("aria-label", `${i + 1} de ${IG_POSTS.length}`);
  slide.innerHTML = `
    <blockquote class="instagram-media" data-instgrm-permalink="${url}?utm_source=ig_embed" data-instgrm-version="14">
      <a class="ig-fallback" href="${url}" target="_blank" rel="noopener">
        ${igIcon}
        Ver ${isReel ? "reel" : "publicación"} en Instagram
      </a>
    </blockquote>`;
  carousel.appendChild(slide);
});

// El script de Instagram se carga recién cuando la sección está por aparecer
const loadInstagram = () => {
  if (document.getElementById("ig-embed-script")) return;
  const script = document.createElement("script");
  script.id = "ig-embed-script";
  script.async = true;
  script.src = "https://www.instagram.com/embed.js";
  script.onload = () => window.instgrm && window.instgrm.Embeds.process();
  document.body.appendChild(script);
};
new IntersectionObserver(
  (entries, obs) => {
    if (entries.some((e) => e.isIntersecting)) {
      loadInstagram();
      obs.disconnect();
    }
  },
  { rootMargin: "600px 0px" }
).observe(carousel);

const slideStep = () => {
  const slide = carousel.querySelector(".slide");
  const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
  return slide ? slide.offsetWidth + gap : carousel.clientWidth;
};
const updateArrows = () => {
  const max = carousel.scrollWidth - carousel.clientWidth - 2;
  prevBtn.disabled = carousel.scrollLeft <= 2;
  nextBtn.disabled = carousel.scrollLeft >= max;
};

prevBtn.addEventListener("click", () => carousel.scrollBy({ left: -slideStep(), behavior: "smooth" }));
nextBtn.addEventListener("click", () => carousel.scrollBy({ left: slideStep(), behavior: "smooth" }));
carousel.addEventListener("scroll", updateArrows, { passive: true });
window.addEventListener("resize", updateArrows);
carousel.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { e.preventDefault(); nextBtn.click(); }
  if (e.key === "ArrowLeft") { e.preventDefault(); prevBtn.click(); }
});
updateArrows();

// ---------- Botones "Quiero este plan" ----------
const aclaraciones = document.getElementById("aclaraciones");
document.querySelectorAll("[data-plan]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const line = `Me interesa el ${btn.dataset.plan}.`;
    const current = aclaraciones.value.replace(/^Me interesa el Pack [^.]*\.\s*/, "");
    aclaraciones.value = current ? `${line}\n${current}` : line;
  });
});

// ---------- Formulario de primera consulta ----------
const form = document.getElementById("consultForm");

const messages = {
  nombre: "Ingresá tu nombre.",
  edad: "Ingresá una edad válida.",
  peso: "Ingresá tu peso en kilogramos.",
  altura: "Ingresá tu altura en metros (por ejemplo 1,75).",
  objetivo: "Elegí tu objetivo.",
};

const validateField = (input) => {
  const field = input.closest(".field");
  const error = field.querySelector(".field-error");
  const valid = input.checkValidity() && input.value.trim() !== "";
  field.classList.toggle("has-error", !valid);
  input.setAttribute("aria-invalid", String(!valid));
  if (error) error.textContent = valid ? "" : messages[input.name];
  return valid;
};

const requiredInputs = form.querySelectorAll("[required]");
requiredInputs.forEach((input) => {
  input.addEventListener("blur", () => input.value && validateField(input));
  input.addEventListener("input", () => {
    if (input.closest(".field").classList.contains("has-error")) validateField(input);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const invalid = [...requiredInputs].filter((input) => !validateField(input));
  if (invalid.length) {
    invalid[0].focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const lines = [
    "¡Hola Emanuel! Quiero hacer mi primera consulta.",
    "",
    `*Nombre:* ${data.nombre.trim()}`,
    `*Edad:* ${data.edad} años`,
    `*Peso:* ${data.peso} kg`,
    `*Altura:* ${data.altura.trim().replace(".", ",")} m`,
    `*Objetivo:* ${data.objetivo}`,
  ];
  if (data.aclaraciones.trim()) lines.push(`*Aclaraciones:* ${data.aclaraciones.trim()}`);

  window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener");
});
