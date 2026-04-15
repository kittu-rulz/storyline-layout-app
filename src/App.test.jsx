import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import StorylineLayoutGenerator from "@/App";
import { createStoryboardSlide } from "@/components/slideModel";

const STORAGE_KEY = "storyline-layout-app.storyboard.v1";
const BACKUP_STORAGE_KEY = `${STORAGE_KEY}.backup`;

describe("StorylineLayoutGenerator", () => {
  beforeEach(() => {
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

  it("shows workflow guidance for the active slide", () => {
    render(<StorylineLayoutGenerator />);

    expect(screen.getAllByText("Workflow Status").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ready for handoff/i).length).toBeGreaterThan(0);
  });

  it("asks for confirmation before deleting a slide", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<StorylineLayoutGenerator />);

    fireEvent.click(screen.getAllByRole("button", { name: "Add Slide" })[0]);
    expect(screen.getAllByText("2 slides in storyboard").length).toBeGreaterThan(0);

    const deleteButton = screen
      .getAllByRole("button", { name: "Delete" })
      .find((button) => !button.hasAttribute("disabled"));

    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText("2 slides in storyboard").length).toBeGreaterThan(0);
    confirmSpy.mockRestore();
  });
});
