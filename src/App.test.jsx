import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import StorylineLayoutGenerator from "@/App";
import { createStoryboardSlide } from "@/components/slideModel";
import { FIRST_RUN_GUIDANCE_DISMISSED_KEY } from "@/features/storyboard/utils/getFirstRunGuidanceState";

const STORAGE_KEY = "storyline-layout-app.storyboard.v1";
const BACKUP_STORAGE_KEY = `${STORAGE_KEY}.backup`;

describe("StorylineLayoutGenerator", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("renders the main workspace", () => {
    render(<StorylineLayoutGenerator />);

    expect(screen.getByText("Storyboard Workspace")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Preview" })).toBeInTheDocument();
    expect(screen.getByText("Open Production Brief")).toBeInTheDocument();
  });

  it("opens the production brief workspace from the sidebar action", async () => {
    render(<StorylineLayoutGenerator />);

    fireEvent.click(screen.getAllByRole("button", { name: "Open Production Brief" })[0]);

    expect(await screen.findByText("Storyline Production Brief")).toBeInTheDocument();
  });

  it("recovers from backup storage when the primary save is corrupted", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const recoveredSlide = createStoryboardSlide("title");
    recoveredSlide.title = "Recovered slide";

    window.localStorage.setItem(STORAGE_KEY, "{broken-json");
    window.localStorage.setItem(
      BACKUP_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        savedAt: new Date().toISOString(),
        slides: [recoveredSlide],
        activeSlideId: recoveredSlide.id,
      }),
    );

    render(<StorylineLayoutGenerator />);

    expect(screen.getAllByText("Recovered slide").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Recovered your storyboard from backup/i).length,
    ).toBeGreaterThan(0);

    consoleErrorSpy.mockRestore();
  });

  it("shows local save status in the workspace", () => {
    render(<StorylineLayoutGenerator />);

    expect(screen.getAllByText(/All changes saved locally/i).length).toBeGreaterThan(0);
  });

  it("shows first-run guidance for a brand new storyboard", () => {
    render(<StorylineLayoutGenerator />);

    expect(screen.getByText("Getting started")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start with blank slide/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load sample template/i })).toBeInTheDocument();
  });

  it("persists onboarding dismissal locally", () => {
    const { unmount } = render(<StorylineLayoutGenerator />);

    fireEvent.click(screen.getByRole("button", { name: /^dismiss$/i }));
    expect(window.localStorage.getItem(FIRST_RUN_GUIDANCE_DISMISSED_KEY)).toBe("true");

    unmount();
    render(<StorylineLayoutGenerator />);

    expect(screen.queryByText("Getting started")).not.toBeInTheDocument();
  });

  it("loads the sample storyboard from onboarding", () => {
    render(<StorylineLayoutGenerator />);

    fireEvent.click(screen.getByRole("button", { name: /load sample template/i }));

    expect(screen.getAllByText(/3 slides in storyboard/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/welcome to customer conversations/i).length).toBeGreaterThan(0);
  });

  it("lets the author change templates from the sidebar while preserving core copy and preview", () => {
    render(<StorylineLayoutGenerator />);

    expect(screen.getAllByText(/^Template$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Category:/i)).toBeInTheDocument();
    expect(screen.getByText(/You can switch templates to change structure/i)).toBeInTheDocument();

    const titleInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(titleInput, { target: { value: "Template carryover title" } });

    fireEvent.click(screen.getByRole("button", { name: /change template/i }));
    fireEvent.click(screen.getByRole("option", { name: /key concept cards/i }));

    expect(screen.getAllByText(/Key Concept Cards/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Category:\s*content/i)).toBeInTheDocument();
    expect(screen.getByText(/Best for grouped concepts/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Template updated to Key Concept Cards/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("Template carryover title");
    expect(screen.getByRole("tab", { name: "Preview" })).toBeInTheDocument();
  });

  it("shows a compatible template summary for legacy slides without templateId", () => {
    const legacySlide = createStoryboardSlide("content");
    delete legacySlide.templateId;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        savedAt: new Date().toISOString(),
        slides: [legacySlide],
        activeSlideId: legacySlide.id,
      }),
    );

    render(<StorylineLayoutGenerator />);

    expect(screen.getAllByText(/Content with Image/i).length).toBeGreaterThan(0);
  });

  it("renders template-driven dynamic fields for supported templates", () => {
    render(<StorylineLayoutGenerator />);

    expect(screen.getAllByText(/Core Copy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Body Copy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Content Blocks/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(2);
    expect(screen.getAllByLabelText(/Block Title/i).length).toBeGreaterThan(0);
  });

  it("supports repeater actions in the dynamic template form", () => {
    render(<StorylineLayoutGenerator />);

    const beforeCount = screen.getAllByLabelText(/Block Title/i).length;
    fireEvent.click(screen.getByRole("button", { name: /add block/i }));

    expect(screen.getAllByLabelText(/Block Title/i).length).toBe(beforeCount + 1);
  });

  it("keeps the preview in sync after editing dynamic template fields", () => {
    render(<StorylineLayoutGenerator />);

    fireEvent.change(screen.getAllByLabelText(/Block Title/i)[0], {
      target: { value: "Dynamic Insight" },
    });

    expect(screen.getAllByText(/Dynamic Insight/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: "Preview" })).toBeInTheDocument();
  });

  it("shows workflow guidance for the active slide", () => {
    render(<StorylineLayoutGenerator />);

    expect(screen.getAllByText("Workflow Status").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ready for handoff/i).length).toBeGreaterThan(0);
  });

  it("opens the inline template list on demand from the sidebar", () => {
    const { container } = render(<StorylineLayoutGenerator />);

    expect(
      screen.queryByRole("listbox", { name: /storyboard templates/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /change template/i }));

    expect(screen.getByRole("listbox", { name: /storyboard templates/i })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="template-thumbnail"]').length).toBeGreaterThan(0);
  });

  it("shows an in-app confirmation dialog before deleting a slide", async () => {
    render(<StorylineLayoutGenerator />);

    fireEvent.click(screen.getAllByRole("button", { name: "Add Slide" })[0]);
    expect(screen.getAllByText("2 slides in storyboard").length).toBeGreaterThan(0);

    const deleteButton = screen
      .getAllByRole("button", { name: "Delete" })
      .find((button) => !button.hasAttribute("disabled"));

    fireEvent.click(deleteButton);

    expect(screen.getByRole("dialog", { name: /delete slide/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByRole("dialog", { name: /delete slide/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/2 slides in storyboard/i).length).toBeGreaterThan(0);
  });

  it("closes the confirmation dialog on Escape without deleting the slide", async () => {
    render(<StorylineLayoutGenerator />);

    fireEvent.click(screen.getAllByRole("button", { name: "Add Slide" })[0]);

    const deleteButton = screen
      .getAllByRole("button", { name: "Delete" })
      .find((button) => !button.hasAttribute("disabled"));

    fireEvent.click(deleteButton);
    expect(screen.getByRole("dialog", { name: /delete slide/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: /delete slide/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/2 slides in storyboard/i).length).toBeGreaterThan(0);
  });

  it("removes the slide after confirming in the dialog", async () => {
    render(<StorylineLayoutGenerator />);

    fireEvent.click(screen.getAllByRole("button", { name: "Add Slide" })[0]);
    expect(screen.getAllByText(/2 slides in storyboard/i).length).toBeGreaterThan(0);

    const deleteButton = screen
      .getAllByRole("button", { name: "Delete" })
      .find((button) => !button.hasAttribute("disabled"));

    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByRole("button", { name: /delete slide/i }));

    expect(screen.queryByRole("dialog", { name: /delete slide/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/1 slide in storyboard/i).length).toBeGreaterThan(0);
  });
});
