document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.querySelector("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const particlesContainer = document.querySelector(".page-particles");
  if (particlesContainer) {
    const particleCount = 70;

    for (let i = 0; i < particleCount; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";

      const size = Math.random() * 5 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${10 + Math.random() * 14}s`;
      particle.style.animationDelay = `${Math.random() * 4}s`;
      particle.style.opacity = (Math.random() * 0.7 + 0.3).toString();

      particlesContainer.appendChild(particle);
    }
  }

  const introOverlay = document.querySelector(".intro-overlay");
  if (introOverlay) {
    introOverlay.style.opacity = "1";
    introOverlay.style.visibility = "visible";

    setTimeout(() => {
      introOverlay.classList.add("hidden");
    }, 2600);
  }

  document.body.classList.add("loaded");

  const revealItems = document.querySelectorAll(".reveal, .service-card, .price-card, .cta-panel, .contact-card, .feature-card, .benefit-card, .step-card, .quote-card");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    revealObserver.observe(item);
  });

  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const submitButton = form.querySelector("button[type='submit']");
      const originalText = submitButton.textContent;

      submitButton.textContent = "Mensaje enviado";
      submitButton.disabled = true;

      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        form.reset();
      }, 1800);
    });
  }
});

const style = document.createElement("style");
style.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }

  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
