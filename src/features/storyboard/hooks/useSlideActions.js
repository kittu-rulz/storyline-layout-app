import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createFormActions,
  createInitialFormState,
} from "@/components/storylineFormState";
import {
  cloneSlideForDuplicate,
  createStoryboardSlide,
} from "@/components/slideModel";
import { createSampleStoryboard } from "@/features/storyboard/sampleStoryboard";

export function useSlideActions({
  initialSlides,
  initialActiveSlideId,
  onPersist,
  pushNotice,
}) {
  const [slides, setSlides] = useState(() => initialSlides);
  const [activeSlideId, setActiveSlideId] = useState(() => initialActiveSlideId);
  const [pendingDeleteSlideId, setPendingDeleteSlideId] = useState(null);

  const form =
    slides.find((slide) => slide.id === activeSlideId) ??
    slides[0] ??
    createInitialFormState();
  const pendingDeleteSlide =
    slides.find((slide) => slide.id === pendingDeleteSlideId) ?? null;

  const setActiveSlideForm = useCallback(
    (nextValueOrUpdater) => {
      setSlides((prevSlides) =>
        prevSlides.map((slide) => {
          if (slide.id !== activeSlideId) return slide;

          const nextSlide =
            typeof nextValueOrUpdater === "function"
              ? nextValueOrUpdater(slide)
              : nextValueOrUpdater;

          return {
            ...nextSlide,
            id: slide.id,
          };
        }),
      );
    },
    [activeSlideId],
  );

  const formActions = useMemo(
    () => createFormActions(setActiveSlideForm),
    [setActiveSlideForm],
  );

  const replaceStoryboard = useCallback(({ slides, activeSlideId }) => {
    setSlides(slides);
    setActiveSlideId(activeSlideId);
  }, []);

  const handleCreateSlide = useCallback(() => {
    const newSlide = createStoryboardSlide(form.screenType);
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideId(newSlide.id);
    pushNotice?.("success", "New slide added to the storyboard.");
  }, [form.screenType, pushNotice]);

  const handleStartBlankStoryboard = useCallback(() => {
    const blankSlide = createStoryboardSlide(form.screenType);
    setSlides([blankSlide]);
    setActiveSlideId(blankSlide.id);
    pushNotice?.("info", "Blank storyboard ready.");
  }, [form.screenType, pushNotice]);

  const handleLoadSampleStoryboard = useCallback(() => {
    const sample = createSampleStoryboard();
    setSlides(sample.slides);
    setActiveSlideId(sample.activeSlideId);
    pushNotice?.("success", "Sample storyboard loaded.");
  }, [pushNotice]);

  const handleSelectSlide = useCallback((slideId) => {
    setActiveSlideId(slideId);
  }, []);

  const handleDuplicateSlide = useCallback((slideId) => {
    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === slideId);
      if (index < 0) return prev;

      const duplicated = cloneSlideForDuplicate(prev[index]);
      const next = [...prev];
      next.splice(index + 1, 0, duplicated);
      setActiveSlideId(duplicated.id);
      return next;
    });
    pushNotice?.("success", "Slide duplicated.");
  }, [pushNotice]);

  const handleDeleteSlide = useCallback((slideId) => {
    if (slides.length <= 1) {
      return;
    }

    setPendingDeleteSlideId(slideId);
  }, [slides.length]);

  const handleCancelDeleteSlide = useCallback(() => {
    if (pendingDeleteSlideId) {
      pushNotice?.("info", "Slide deletion canceled.");
    }
    setPendingDeleteSlideId(null);
  }, [pendingDeleteSlideId, pushNotice]);

  const handleConfirmDeleteSlide = useCallback(() => {
    if (!pendingDeleteSlideId) {
      return;
    }

    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === pendingDeleteSlideId);
      if (index < 0) return prev;

      const next = prev.filter((slide) => slide.id !== pendingDeleteSlideId);
      if (pendingDeleteSlideId === activeSlideId) {
        const fallbackIndex = Math.max(0, index - 1);
        const nextActive = next[fallbackIndex] || next[0];
        if (nextActive) {
          setActiveSlideId(nextActive.id);
        }
      }

      return next;
    });

    setPendingDeleteSlideId(null);
    pushNotice?.("success", "Slide removed from the storyboard.");
  }, [activeSlideId, pendingDeleteSlideId, pushNotice]);

  const handleMoveSlideUp = useCallback((slideId) => {
    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === slideId);
      if (index <= 0) return prev;

      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const handleMoveSlideDown = useCallback((slideId) => {
    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === slideId);
      if (index < 0 || index >= prev.length - 1) return prev;

      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  useEffect(() => {
    onPersist?.(slides, activeSlideId);
  }, [activeSlideId, onPersist, slides]);

  return {
    slides,
    activeSlideId,
    form,
    formActions,
    replaceStoryboard,
    deleteDialog: {
      open: Boolean(pendingDeleteSlideId),
      title: "Delete slide",
      description: `Delete "${pendingDeleteSlide?.title?.trim() || "Untitled slide"}" from the storyboard?`,
      confirmLabel: "Delete slide",
      cancelLabel: "Cancel",
      confirmTone: "destructive",
    },
    handleCreateSlide,
    handleStartBlankStoryboard,
    handleLoadSampleStoryboard,
    handleSelectSlide,
    handleDuplicateSlide,
    handleDeleteSlide,
    handleCancelDeleteSlide,
    handleConfirmDeleteSlide,
    handleMoveSlideUp,
    handleMoveSlideDown,
  };
}
