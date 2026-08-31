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

  const introCanvas = document.querySelector(".intro-canvas");
  const introLogo = document.querySelector(".intro-logo");
  if (introCanvas && introLogo) {
    const context = introCanvas.getContext("2d");
    const particleCanvas = document.createElement("canvas");
    const particleContext = particleCanvas.getContext("2d");
    const particles = [];
    const logoBounds = introLogo.getBoundingClientRect();
    const canvasBounds = introCanvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    introCanvas.width = canvasBounds.width * scale;
    introCanvas.height = canvasBounds.height * scale;
    particleCanvas.width = canvasBounds.width * scale;
    particleCanvas.height = canvasBounds.height * scale;
    particleContext.scale(scale, scale);
    particleContext.font = getComputedStyle(introLogo).font;
    particleContext.textAlign = "center";
    particleContext.textBaseline = "middle";
    particleContext.fillStyle = "white";
    particleContext.fillText(
      introLogo.textContent,
      canvasBounds.width / 2,
      canvasBounds.height / 2
    );

    const pixels = particleContext.getImageData(0, 0, particleCanvas.width, particleCanvas.height).data;
    const stride = Math.max(3, Math.round(scale * 2));
    for (let y = 0; y < particleCanvas.height; y += stride) {
      for (let x = 0; x < particleCanvas.width; x += stride) {
        const alpha = pixels[(y * particleCanvas.width + x) * 4 + 3];
        if (alpha > 120) {
          particles.push({
            x: x / scale,
            y: y / scale,
            originX: x / scale,
            originY: y / scale,
            velocityX: (Math.random() - 0.5) * 4.8,
            velocityY: (Math.random() - 0.5) * 0.35,
            size: Math.random() * 2.4 + 1.1,
            opacity: 0.95,
          });
        }
      }
    }

    if (particles.length > 120) {
      const selectedParticles = [];
      const selectionStep = particles.length / 120;
      for (let index = 0; index < 120; index += 1) {
        selectedParticles.push(particles[Math.floor(index * selectionStep)]);
      }
      particles.splice(0, particles.length, ...selectedParticles);
    }

    const drawLetterParticles = (dispersing) => {
      context.clearRect(0, 0, introCanvas.width, introCanvas.height);
      context.save();
      context.scale(scale, scale);
      particles.forEach((particle) => {
        if (dispersing) {
          particle.x += particle.velocityX;
          particle.y += particle.velocityY;
          particle.velocityX *= 0.994;
          particle.velocityY += 0.001;
          particle.opacity -= 0.003;
        }

        context.globalAlpha = Math.max(0, particle.opacity);
        context.fillStyle = "white";
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });
      context.restore();
    };

    drawLetterParticles(false);
    const startIntroDissolve = () => {
      introLogo.classList.add("particle-dissolve");
      introCanvas.classList.add("particle-canvas-visible");
      const dissolveStart = performance.now();
      const animateDissolve = (now) => {
        drawLetterParticles(true);
        if (now - dissolveStart < 1900) {
          requestAnimationFrame(animateDissolve);
        }
      };
      requestAnimationFrame(animateDissolve);
    };

    introLogo.dataset.startDissolve = "ready";
    introLogo.startDissolve = startIntroDissolve;
  }

  const introOverlay = document.querySelector(".intro-overlay");
  if (introOverlay) {
    introOverlay.style.opacity = "1";
    introOverlay.style.visibility = "visible";

    const enterButton = introOverlay.querySelector(".intro-enter");
    enterButton.addEventListener("click", () => {
      if (introLogo && introLogo.startDissolve) {
        introLogo.startDissolve();
      }
      enterButton.disabled = true;
      setTimeout(() => {
        introOverlay.classList.add("hidden");
        introOverlay.setAttribute("aria-hidden", "true");
      }, 1900);
    });
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

  const assistant = document.querySelector(".assistant");
  if (assistant) {
    const toggle = assistant.querySelector(".assistant-toggle");
    const close = assistant.querySelector(".assistant-close");
    const panel = assistant.querySelector(".assistant-panel");
    const assistantForm = assistant.querySelector(".assistant-form");
    const input = assistant.querySelector(".assistant-form input");
    const messages = assistant.querySelector(".assistant-messages");
    const discordUrl = "https://discord.gg/SrnEHgnnfY";

    const answerQuestion = (question) => {
      const normalizedQuestion = question.toLowerCase();
      if (normalizedQuestion.includes("dueño") || normalizedQuestion.includes("creador") || normalizedQuestion.includes("owner")) {
        return "El dueño de Syntax Studio es Emiliano Figueredo.";
      }
      if (normalizedQuestion.includes("compr") || normalizedQuestion.includes("contrat") || normalizedQuestion.includes("precio")) {
        return `Para comprar o pedir un presupuesto, entra a nuestro Discord: ${discordUrl}`;
      }
      if (normalizedQuestion.includes("servicio") || normalizedQuestion.includes("hacen") || normalizedQuestion.includes("ofrecen")) {
        return "Ofrecemos desarrollo web, scripts para FiveM, ciberseguridad, automatización y soluciones a medida.";
      }
      if (normalizedQuestion.includes("discord") || normalizedQuestion.includes("contact")) {
        return `Puedes contactarnos directamente aquí: ${discordUrl}`;
      }
      return "Puedo ayudarte con información del dueño, servicios, precios y compras. Prueba una de esas preguntas.";
    };

    const ask = (question) => {
      const cleanQuestion = question.trim();
      if (!cleanQuestion) return;

      const userMessage = document.createElement("div");
      userMessage.className = "assistant-message assistant-message-user";
      userMessage.textContent = cleanQuestion;
      messages.appendChild(userMessage);

      const botMessage = document.createElement("div");
      botMessage.className = "assistant-message assistant-message-bot";
      botMessage.textContent = answerQuestion(cleanQuestion);
      messages.appendChild(botMessage);
      messages.scrollTop = messages.scrollHeight;
      input.value = "";
    };

    toggle.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen.toString());
      panel.setAttribute("aria-hidden", (!isOpen).toString());
      if (isOpen) input.focus();
    });

    close.addEventListener("click", () => {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    });

    assistantForm.addEventListener("submit", (event) => {
      event.preventDefault();
      ask(input.value);
    });

    assistant.querySelectorAll("[data-question]").forEach((button) => {
      button.addEventListener("click", () => ask(button.dataset.question));
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
