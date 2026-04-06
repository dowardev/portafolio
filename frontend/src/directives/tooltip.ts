import type { Directive, DirectiveBinding } from "vue";
import tippy, { type Instance, type Props } from "tippy.js";
import "tippy.js/dist/tippy.css";

interface TooltipProps extends Partial<Props> {
  color?: string;
  textColor?: string;
}

/**
 * Detects the Ionic color from the host element by checking:
 * 1. The `color` attribute on the element
 * 2. A CSS class matching `ion-color-<name>` (Ionic adds this internally)
 */
function detectIonicColor(el: HTMLElement): string | null {
  const attr = el.getAttribute("color");
  if (attr) return attr;

  const colorClass = Array.from(el.classList).find(
    (c) => c.startsWith("ion-color-") && c !== "ion-color",
  );
  if (colorClass) return colorClass.replace("ion-color-", "");

  return null;
}

/**
 * Returns true if the color string is a raw CSS color (hex, rgb, hsl, etc.)
 * rather than an Ionic color name like "primary" or "danger".
 */
function isCustomColor(color: string): boolean {
  return (
    color.startsWith("#") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl")
  );
}

/**
 * Applies custom background and text colors directly to the tippy box
 * and its arrow via the onCreate lifecycle hook.
 */
function applyCustomColor(
  props: TooltipProps,
  bgColor: string,
  txtColor: string,
): void {
  const existingOnCreate = props.onCreate;

  props.onCreate = (instance) => {
    const box = instance.popper.querySelector(".tippy-box") as HTMLElement;
    if (box) {
      box.style.backgroundColor = bgColor;
      box.style.color = txtColor;
    }
    const arrow = instance.popper.querySelector(".tippy-arrow") as HTMLElement;
    if (arrow) {
      arrow.style.color = bgColor;
    }
    existingOnCreate?.(instance);
  };
}

export const vTooltip: Directive<HTMLElement, string | TooltipProps> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | TooltipProps>) {
    // Wait one frame so Ionic custom elements have time to reflect
    // their `color` attribute and `ion-color-*` classes onto the DOM.
    requestAnimationFrame(() => {
      const content =
        typeof binding.value === "string"
          ? binding.value
          : binding.value?.content || "";
      const props: TooltipProps =
        typeof binding.value === "object" ? { ...binding.value } : {};

      // Priority: explicit theme > explicit color prop > auto-detected host color > primary
      if (!props.theme) {
        const color = props.color ?? detectIonicColor(el) ?? "primary";
        if (isCustomColor(color)) {
            applyCustomColor(props, color, props.textColor ?? "#ffffff");
          } else {
            props.theme = `ion-${color}`;
        }
      }
      delete props.color;
      delete props.textColor;

      tippy(el, {
        content,
        placement: "top",
        ...props,
      });
    });
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string | TooltipProps>) {
    const content =
      typeof binding.value === "string"
        ? binding.value
        : binding.value?.content || "";
    const instance = (el as HTMLElement & { _tippy?: Instance<Props> })._tippy;
    if (instance) {
      instance.setContent(content);
    }
  },
  unmounted(el: HTMLElement) {
    const instance = (el as HTMLElement & { _tippy?: Instance<Props> })._tippy;
    if (instance) {
      instance.destroy();
    }
  },
};
