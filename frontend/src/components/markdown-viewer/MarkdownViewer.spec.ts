import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MarkdownViewer from "./MarkdownViewer.vue";

// Mock ionic-extra-components — CardCode and CardAlert are external
vi.mock("ionic-extra-components", () => ({
  CardCode: { template: "<div class='card-code'><slot /></div>" },
  CardAlert: { template: "<div class='card-alert'><slot /></div>" },
}));

describe("MarkdownViewer", () => {
  it("sanitizes script tags from HTML output", () => {
    const wrapper = mount(MarkdownViewer, {
      props: { content: 'Hello\n\n<script>alert("xss")</script>' },
    });
    const html = wrapper.html();
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("alert");
  });

  it("sanitizes onerror handlers from raw HTML img tags", () => {
    const wrapper = mount(MarkdownViewer, {
      props: { content: '<img src=x onerror=alert(1)>' },
    });
    const html = wrapper.html();
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("alert");
  });

  it("allows safe HTML tags like <p> and <strong>", () => {
    const wrapper = mount(MarkdownViewer, {
      props: { content: "Hello **world**" },
    });
    const html = wrapper.html();
    expect(html).toContain("<strong>");
  });
});
