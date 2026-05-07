import type { Directive, DirectiveBinding } from "vue";

interface SectionRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

const defaultOptions: SectionRevealOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
  delay: 0,
};

const observerCache = new WeakMap<HTMLElement, IntersectionObserver>();

export const vSectionReveal: Directive<HTMLElement, SectionRevealOptions | string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<SectionRevealOptions | string>) {
    const options: SectionRevealOptions =
      typeof binding.value === "string"
        ? { ...defaultOptions, delay: parseInt(binding.value, 10) }
        : { ...defaultOptions, ...binding.value };

    el.classList.add("section-reveal");
    el.style.setProperty("--reveal-delay", `${options.delay}ms`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add("is-visible");
            }, options.delay);
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: options.threshold,
        rootMargin: options.rootMargin,
      },
    );

    observerCache.set(el, observer);
    observer.observe(el);
  },

  unmounted(el: HTMLElement) {
    const observer = observerCache.get(el);
    if (observer) {
      observer.disconnect();
      observerCache.delete(el);
    }
    el.classList.remove("is-visible", "section-reveal");
  },
};

export default vSectionReveal;