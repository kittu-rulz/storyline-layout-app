import { useCallback, useMemo, useState } from "react";
import {
  createStoryboardSlide,
  sanitizeSavedSlide,
  STORYBOARD_SCHEMA_VERSION,
} from "@/components/slideModel";

const STORYBOARD_STORAGE_KEY = "storyline-layout-app.storyboard.v1";
const STORYBOARD_BACKUP_STORAGE_KEY = `${STORYBOARD_STORAGE_KEY}.backup`;

function createDefaultStoryboardState() {
  const firstSlide = createStoryboardSlide();
  return {
    slides: [firstSlide],
    activeSlideId: firstSlide.id,
    saveStatus: "All changes saved locally",
    notice: null,
  };
}

function createPersistedStoryboardPayload(slides, activeSlideId) {
  return {
    schemaVersion: STORYBOARD_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    slides,
    activeSlideId,
  };
}

function getLoadedStoryboardState(parsed, options = {}) {
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
    return createDefaultStoryboardState();
  }

  const slides = parsed.slides.map((slide) => sanitizeSavedSlide(slide));
  const activeSlideId =
    typeof parsed.activeSlideId === "string" &&
    slides.some((slide) => slide.id === parsed.activeSlideId)
      ? parsed.activeSlideId
      : slides[0].id;

  return {
    slides,
    activeSlideId,
    saveStatus: options.recoveredFromBackup
      ? "Recovered your storyboard from backup"
      : "All changes saved locally",
    notice: options.recoveredFromBackup
      ? {
          tone: "info",
          message: "Recovered your storyboard from backup after a save issue.",
        }
      : null,
  };
}

function loadStoryboardState() {
  if (typeof window === "undefined") {
    return createDefaultStoryboardState();
  }

  try {
    const raw = window.localStorage.getItem(STORYBOARD_STORAGE_KEY);
    if (!raw) {
      return createDefaultStoryboardState();
    }

    const parsed = JSON.parse(raw);
    return getLoadedStoryboardState(parsed);
  } catch (error) {
    console.error("Failed to load storyboard from localStorage", error);

    try {
      // Fall back to the last good payload if the primary save is corrupted.
      const backupRaw = window.localStorage.getItem(STORYBOARD_BACKUP_STORAGE_KEY);
      if (!backupRaw) {
        return createDefaultStoryboardState();
      }

      const backupParsed = JSON.parse(backupRaw);
      return getLoadedStoryboardState(backupParsed, { recoveredFromBackup: true });
    } catch (backupError) {
      console.error("Failed to load storyboard backup from localStorage", backupError);
      return {
        ...createDefaultStoryboardState(),
        notice: {
          tone: "error",
          message: "Saved storyboard data could not be restored. Starting with a fresh workspace.",
        },
      };
    }
  }
}

export function useStoryboardPersistence() {
  const initialStoryboardState = useMemo(() => loadStoryboardState(), []);
  const [saveStatus, setSaveStatus] = useState(
    () => initialStoryboardState.saveStatus || "All changes saved locally",
  );
  const [persistenceNotice, setPersistenceNotice] = useState(null);

  const saveStoryboardState = useCallback((slides, activeSlideId) => {
    if (typeof window === "undefined") return;

    try {
      const payload = JSON.stringify(
        createPersistedStoryboardPayload(slides, activeSlideId),
      );
      window.localStorage.setItem(STORYBOARD_STORAGE_KEY, payload);
      window.localStorage.setItem(STORYBOARD_BACKUP_STORAGE_KEY, payload);
      setSaveStatus("All changes saved locally");
    } catch (error) {
      console.error("Failed to save storyboard to localStorage", error);
      setSaveStatus("Local save unavailable");
      setPersistenceNotice({
        id: `persistence-error-${Date.now()}`,
        tone: "error",
        message:
          "Autosave failed in this browser session. Continue working, then export your storyboard manually.",
      });
    }
  }, []);

  return {
    initialSlides: initialStoryboardState.slides,
    initialActiveSlideId: initialStoryboardState.activeSlideId,
    saveStatus,
    initialNotice: initialStoryboardState.notice,
    persistenceNotice,
    saveStoryboardState,
  };
}
