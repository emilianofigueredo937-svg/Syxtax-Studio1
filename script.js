document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.querySelector("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const particlesContainer = document.querySelector(".page-particles");
  if (particlesContainer) {
    const particleCount = 180;

    for (let i = 0; i < particleCount; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";

      const size = Math.random() * 2.8 + 1.4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${16 + Math.random() * 18}s`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.opacity = (Math.random() * 0.5 + 0.12).toString();

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
    const stride = Math.max(2, Math.round(scale * 1.5));
    for (let y = 0; y < particleCanvas.height; y += stride) {
      for (let x = 0; x < particleCanvas.width; x += stride) {
        const alpha = pixels[(y * particleCanvas.width + x) * 4 + 3];
        if (alpha > 120) {
          particles.push({
            x: x / scale,
            y: y / scale,
            originX: x / scale,
            originY: y / scale,
            velocityX: (Math.random() - 0.5) * 7.2,
            velocityY: Math.random() * 4.2 - 3.1,
            size: Math.random() * 0.95 + 0.55,
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
    setTimeout(() => {
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
    }, 1250);
  }

  const introOverlay = document.querySelector(".intro-overlay");
  if (introOverlay) {
    introOverlay.style.opacity = "1";
    introOverlay.style.visibility = "visible";

    setTimeout(() => {
      introOverlay.classList.add("hidden");
    }, 4100);
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

    const STORE_INFO = {
      owner: "Kaly",
      brand: "Syntax Studio",
      services: [
        "desarrollo web",
        "scripts para FiveM",
        "automatización",
        "ciberseguridad",
        "soluciones a medida"
      ],
      plans: {
        starter: "$19/mes",
        pro: "$49/mes",
        premium: "$89/mes"
      }
    };

    const normalizeText = (value) => value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const detectIntent = (question) => {
      const q = normalizeText(question);

      if (/(emiliano|figueredo|quien|due[nñ]o|dueno|propietario|owner|creador|kaly|kali)/.test(q)) return "owner";
      if (/(comprar|compras|precio|presupuesto|costo|pagar|orden|solicitar|contratar|plan|budget|cotizar|factura)/.test(q)) return "buy";
      if (/(servicio|servicios|haces|ofreces|que hacen|que venden|store|productos|trabajos|web|fivem|automatizacion|scripts|seguridad)/.test(q)) return "services";
      if (/(discord|link|enlace|contacto|contactar|mensaje|hablar|ayuda|soporte|whatsapp)/.test(q)) return "contact";
      if (/(cuanto|precio|cuesta|costar|monta)/.test(q)) return "pricing";
      if (/(hola|buenas|buenos|hey|hi|todo bien|como estas|como va|que tal|como andas|como estas)/.test(q)) return "greeting";
      if (/(gracias|thank you|muchas gracias|te lo agradezco)/.test(q)) return "thanks";
      if (/(adios|chau|bye|hasta luego|nos vemos)/.test(q)) return "bye";
      if (/(quien eres|eres una ia|que eres|bot|asistente|ayuda)/.test(q)) return "general";

      return "general";
    };

    const answerQuestion = (question) => {
      const intent = detectIntent(question);
      const q = normalizeText(question);

      switch (intent) {
        case "owner":
          return `El dueño de ${STORE_INFO.brand} es ${STORE_INFO.owner}.`;
        case "buy":
          return `Para comprar, pedir un proyecto o consultar presupuesto, puedes entrar a nuestro Discord: ${discordUrl}`;
        case "services":
          return `Ofrecemos ${STORE_INFO.services.join(", ")} y soluciones personalizadas para tu proyecto.`;
        case "contact":
          return `Puedes hablar con nosotros directamente en Discord: ${discordUrl}`;
        case "pricing":
          return `Nuestros planes son: Starter ${STORE_INFO.plans.starter}, Pro ${STORE_INFO.plans.pro} y Premium ${STORE_INFO.plans.premium}.`;
        case "greeting":
          if (/(todo bien|como estas|como va|que tal|como andas)/.test(q)) {
            return "¡Hola! Sí, todo bien. ¿En qué puedo ayudarte con Syntax Studio?";
          }
          return `Hola, ¿en qué puedo ayudarte con ${STORE_INFO.brand}?`;
        case "thanks":
          return "¡Con gusto! Si quieres, también puedo ayudarte a pedir un proyecto o entrar al Discord.";
        case "bye":
          return "¡Hasta luego! Si necesitas ayuda con Syntax Studio, aquí estoy.";
        default:
          return "¡Claro! Soy el asistente de Syntax Studio y puedo ayudarte con servicios, precios, compras, contacto y preguntas generales sobre la store. También puedes pedirme un presupuesto o decirme si quieres entrar al Discord.";
      }
    };

    const addAnimatedMessage = (element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(14px) scale(0.96)";
      requestAnimationFrame(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0) scale(1)";
      });
    };

    const ask = (question) => {
      const cleanQuestion = question.trim();
      if (!cleanQuestion) return;

      const userMessage = document.createElement("div");
      userMessage.className = "assistant-message assistant-message-user";
      userMessage.textContent = cleanQuestion;
      addAnimatedMessage(userMessage);
      messages.appendChild(userMessage);

      const thinkingMessage = document.createElement("div");
      thinkingMessage.className = "assistant-message assistant-message-bot assistant-message-thinking";
      thinkingMessage.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
      addAnimatedMessage(thinkingMessage);
      messages.appendChild(thinkingMessage);
      messages.scrollTop = messages.scrollHeight;
      input.value = "";

      setTimeout(() => {
        thinkingMessage.remove();

        const botMessage = document.createElement("div");
        botMessage.className = "assistant-message assistant-message-bot";
        botMessage.textContent = answerQuestion(cleanQuestion);
        addAnimatedMessage(botMessage);
        messages.appendChild(botMessage);
        messages.scrollTop = messages.scrollHeight;
      }, 3000);
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
