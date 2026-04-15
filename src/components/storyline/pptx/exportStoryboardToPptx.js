import PptxGenJS from "pptxgenjs";
import { buildPptxExportModel } from "@/components/storyline/pptx/pptxExportModel";
import { renderStoryboardSlide } from "@/components/storyline/pptx/slideRenderer";

function getStoryboardBaseSize(models) {
  const first = models[0];

  return {
    widthIn: first.slideSize.widthIn,
    heightIn: first.slideSize.heightIn,
  };
}

export async function exportStoryboardToPptx(storyboardSlides, options = {}) {
  if (!Array.isArray(storyboardSlides) || storyboardSlides.length === 0) {
    throw new Error("No storyboard slides available for PPTX export.");
  }

  const models = storyboardSlides.map((slide) => buildPptxExportModel(slide));
  const targetSize = getStoryboardBaseSize(models);
  const pptx = new PptxGenJS();
  const layoutName = "STORYBOARD_CUSTOM";

  pptx.defineLayout({
    name: layoutName,
    width: targetSize.widthIn,
    height: targetSize.heightIn,
  });
  pptx.layout = layoutName;
  pptx.author = "Storyline Layout App";
  pptx.subject = "Storyboard export scaffold for Storyline build";
  pptx.title = options.title || "Storyboard Export";

  models.forEach((model, index) => {
    const slide = pptx.addSlide();
    renderStoryboardSlide({
      slide,
      pptx,
      model,
      slideIndex: index,
      totalSlides: models.length,
      targetSize,
    });
  });

  const fileName = options.fileName || "storyboard-export.pptx";
  await pptx.writeFile({ fileName });
}
