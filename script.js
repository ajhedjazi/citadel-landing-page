const header = document.querySelector(".site-header");
const year = document.querySelector("#copyright-year");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(
  '.nav-links > a:not(.button)[href^="#"]',
);
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuSummary = mobileMenu?.querySelector("summary");
const floatingActions = document.querySelector("[data-floating-actions]");
const backToTopButton = document.querySelector("[data-back-to-top]");
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
    if (event.key === "Escape" && mobileMenu.open) {
      mobileMenu.open = false;
      mobileMenuSummary?.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!mobileMenu.contains(event.target)) {
      mobileMenu.open = false;
    }
  });
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  document.documentElement.classList.add("reveal-ready");
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

if (backToTopButton) {
  const updateBackToTop = () => {
    const isVisible = window.scrollY >= 600;
    backToTopButton.classList.toggle("is-visible", isVisible);
    backToTopButton.setAttribute("aria-hidden", String(!isVisible));
    backToTopButton.tabIndex = isVisible ? 0 : -1;
  };

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    const heroTitle = document.querySelector("#hero-title");

    if (heroTitle) {
      heroTitle.tabIndex = -1;
      heroTitle.focus({ preventScroll: true });
    }
  });

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
}

if (floatingActions) {
  const floatingCollisionTargets = document.querySelectorAll(
    ".hero, .benefit-item, .intro-heading, .intro-copy, .method-step, .service-copy, .contact-heading, .contact-method, .results-heading, .result-card, .gallery-controls, .founder-copy, .consultation-shell, .site-footer",
  );
  let floatingFrame = 0;

  const updateFloatingActions = () => {
    window.cancelAnimationFrame(floatingFrame);
    floatingFrame = window.requestAnimationFrame(() => {
      const floatingRect = floatingActions.getBoundingClientRect();
      const clearance = 12;
      const isBlocked = Array.from(floatingCollisionTargets).some((target) => {
        const targetRect = target.getBoundingClientRect();

        if (targetRect.width === 0 || targetRect.height === 0) {
          return false;
        }

        return (
          targetRect.bottom > floatingRect.top - clearance &&
          targetRect.top < floatingRect.bottom + clearance &&
          targetRect.right > floatingRect.left - clearance &&
          targetRect.left < floatingRect.right + clearance
        );
      });

      floatingActions.classList.toggle("is-suppressed", isBlocked);
    });
  };

  window.addEventListener("scroll", updateFloatingActions, { passive: true });
  window.addEventListener("resize", updateFloatingActions, { passive: true });
  window.addEventListener("load", updateFloatingActions, { once: true });
  updateFloatingActions();
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
  let maxStartIndex = cards.length - 1;
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

    return Math.min(nearestIndex, maxStartIndex);
  };

  const updateVisibleCards = () => {
    const firstCard = cards[0];

    if (!firstCard) {
      maxStartIndex = 0;
      return;
    }

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap) || 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const visibleCards = Math.max(
      1,
      Math.floor((track.clientWidth + gap) / (cardWidth + gap)),
    );

    maxStartIndex = Math.max(0, cards.length - visibleCards);
    dots.forEach((dot, index) => {
      dot.hidden = index > maxStartIndex;
    });
  };

  const updateGallery = () => {
    updateVisibleCards();
    activeIndex = getNearestIndex();

    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === maxStartIndex;
  };

  const scheduleUpdate = () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(updateGallery);
  };

  const scrollToCard = (index) => {
    updateVisibleCards();
    const nextIndex = Math.max(0, Math.min(index, maxStartIndex));

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
