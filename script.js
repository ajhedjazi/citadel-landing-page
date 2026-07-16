const header = document.querySelector(".site-header");
const year = document.querySelector("#copyright-year");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(
  '.nav-links > a:not(.button)[href^="#"]',
);
const mobileMenu = document.querySelector(".mobile-menu");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const updateHeader = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }
};

if (header) {
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (mobileMenu) {
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.open = false;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      mobileMenu.open = false;
    }
  });
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const navTargets = Array.from(
  new Set(
    Array.from(navLinks)
      .map((link) => link.getAttribute("href"))
      .filter(Boolean),
  ),
)
  .map((href) => ({ href, target: document.querySelector(href) }))
  .filter(({ target }) => target);

if (navTargets.length && "IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      const activeTarget = navTargets.find(
        ({ target }) => target === visible.target,
      );

      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          activeTarget?.href === link.getAttribute("href"),
        );
      });
    },
    {
      rootMargin: "-24% 0px -62% 0px",
      threshold: [0.08, 0.2, 0.4],
    },
  );

  navTargets.forEach(({ target }) => navObserver.observe(target));
}

const gallery = document.querySelector("[data-results-gallery]");

if (gallery) {
  const track = gallery.querySelector("[data-results-track]");
  const cards = Array.from(gallery.querySelectorAll("[data-result-card]"));
  const previousButton = gallery.querySelector("[data-gallery-prev]");
  const nextButton = gallery.querySelector("[data-gallery-next]");
  const dots = Array.from(gallery.querySelectorAll("[data-gallery-dot]"));
  let activeIndex = 0;
  let scrollFrame = 0;

  const getTrackPadding = () =>
    Number.parseFloat(window.getComputedStyle(track).paddingLeft) || 0;

  const getCardLeft = (card) => {
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    return cardRect.left - trackRect.left + track.scrollLeft;
  };

  const getNearestIndex = () => {
    const targetLeft = track.scrollLeft + getTrackPadding();
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(getCardLeft(card) - targetLeft);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  const updateGallery = () => {
    activeIndex = getNearestIndex();

    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === cards.length - 1;
  };

  const scheduleUpdate = () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(updateGallery);
  };

  const scrollToCard = (index) => {
    const nextIndex = Math.max(0, Math.min(index, cards.length - 1));

    track.scrollTo({
      left: getCardLeft(cards[nextIndex]) - getTrackPadding(),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  previousButton.addEventListener("click", () => {
    scrollToCard(activeIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    scrollToCard(activeIndex + 1);
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      scrollToCard(Number(dot.dataset.galleryDot));
    });
  });

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToCard(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToCard(activeIndex + 1);
    }
  });

  track.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  updateGallery();
}
