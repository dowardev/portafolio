import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MarkdownViewer from "./MarkdownViewer.vue";

// Mock ionic-extra-components — CardCode and CardAlert are external
vi.mock("ionic-extra-components", () => ({
  CardCode: { name: "CardCode", template: "<div class='card-code'><slot /></div>" },
  CardAlert: {
    name: "CardAlert",
    template: "<div class='card-alert'><slot /></div>",
    props: ["title", "content", "border", "icon", "color"],
  },
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

describe("blockquote handling", () => {
  it("strips Nota prefix from blockquote body", () => {
    const wrapper = mount(MarkdownViewer, {
      props: { content: "> Nota\n> This is a note" },
    });
    const alert = wrapper.findComponent({ name: "CardAlert" });
    expect(alert.exists()).toBe(true);
    expect(alert.props("title")).toBe("Nota");
    expect(alert.props("content")).not.toContain("Nota");
  });

  it("converts inline code to bold inside blockquotes", () => {
    const wrapper = mount(MarkdownViewer, {
      props: { content: "> Use `npm install` to install" },
    });
    const alert = wrapper.findComponent({ name: "CardAlert" });
    expect(alert.props("content")).toContain("<b>npm install</b>");
    expect(alert.props("content")).not.toContain("<code>npm install</code>");
  });

  it("renders plain blockquotes without Nota prefix", () => {
    const wrapper = mount(MarkdownViewer, {
      props: { content: "> This is a quote" },
    });
    const alert = wrapper.findComponent({ name: "CardAlert" });
    expect(alert.exists()).toBe(true);
    expect(alert.props("content")).toContain("This is a quote");
  });

  it("sanitizes raw HTML inside blockquotes before passing to CardAlert", () => {
    const wrapper = mount(MarkdownViewer, {
      props: { content: '> <img src=x onerror=alert("xss")>' },
    });
    const alert = wrapper.findComponent({ name: "CardAlert" });
    expect(alert.exists()).toBe(true);
    // DOMPurify escapes < > so raw HTML tags are neutralized
    expect(alert.props("content")).not.toContain("<img");
    expect(alert.props("content")).not.toContain("<script");
  });
});
