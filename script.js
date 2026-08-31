document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.querySelector("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

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

// Estilos de aparición para elementos animados
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
