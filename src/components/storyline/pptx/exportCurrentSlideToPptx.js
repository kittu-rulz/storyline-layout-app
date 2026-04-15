import { exportStoryboardToPptx } from "@/components/storyline/pptx/exportStoryboardToPptx";

export async function exportCurrentSlideToPptx(form, options = {}) {
  return exportStoryboardToPptx([form], options);
}
