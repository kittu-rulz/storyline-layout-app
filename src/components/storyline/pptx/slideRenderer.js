function makeScaler(model, targetSize) {
  const scaleX = targetSize.widthIn / model.slideSize.widthIn;
  const scaleY = targetSize.heightIn / model.slideSize.heightIn;
  const textScale = (scaleX + scaleY) / 2;

  return {
    x: (value) => value * scaleX,
    y: (value) => value * scaleY,
    w: (value) => value * scaleX,
    h: (value) => value * scaleY,
    pt: (value) => Math.max(0.75, value * textScale),
  };
}

function addGuideLines(slide, pptx, model, scale) {
  if (!model.showSafeGrid) return;

  const safeTop = scale.y(model.safeMarginsIn.top);
  const safeBottomY = scale.y(model.slideSize.heightIn - model.safeMarginsIn.bottom);
  const safeLeft = scale.x(model.safeMarginsIn.left);
  const safeRightX = scale.x(model.slideSize.widthIn - model.safeMarginsIn.right);

  slide.addShape(pptx.ShapeType.line, {
    x: 0,
    y: safeTop,
    w: scale.w(model.slideSize.widthIn),
    h: 0,
    line: { color: model.themeColors.guide, pt: scale.pt(1), dash: "dash" },
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0,
    y: safeBottomY,
    w: scale.w(model.slideSize.widthIn),
    h: 0,
    line: { color: model.themeColors.guide, pt: scale.pt(1), dash: "dash" },
  });
  slide.addShape(pptx.ShapeType.line, {
    x: safeLeft,
    y: 0,
    w: 0,
    h: scale.h(model.slideSize.heightIn),
    line: { color: model.themeColors.guide, pt: scale.pt(0.75), dash: "dash" },
  });
  slide.addShape(pptx.ShapeType.line, {
    x: safeRightX,
    y: 0,
    w: 0,
    h: scale.h(model.slideSize.heightIn),
    line: { color: model.themeColors.guide, pt: scale.pt(0.75), dash: "dash" },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: scale.x(model.safeFrameIn.x),
    y: scale.y(model.safeFrameIn.y),
    w: scale.w(model.safeFrameIn.w),
    h: scale.h(model.safeFrameIn.h),
    fill: { color: "FFFFFF", transparency: 100 },
    line: { color: model.themeColors.safe, pt: scale.pt(1), dash: "dash" },
  });
}

function addCard(slide, pptx, scale, geometry, options = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: scale.x(geometry.x),
    y: scale.y(geometry.y),
    w: scale.w(geometry.w),
    h: scale.h(geometry.h),
    rectRadius: options.rectRadius ?? 0.06,
    fill: {
      color: options.fillColor || "FFFFFF",
      transparency: options.transparency ?? 0,
    },
    line: {
      color: options.lineColor || "CBD5E1",
      pt: scale.pt(options.linePt ?? 1),
    },
  });
}

function addTextBlock(slide, scale, text, geometry, options = {}) {
  if (typeof text !== "string" || text.trim().length === 0) return;

  slide.addText(text, {
    x: scale.x(geometry.x),
    y: scale.y(geometry.y),
    w: scale.w(geometry.w),
    h: scale.h(geometry.h),
    fontFace: options.fontFace || "Arial",
    fontSize: scale.pt(options.fontSize ?? 12),
    color: options.color || "0F172A",
    bold: options.bold === true,
    italic: options.italic === true,
    align: options.align || "left",
    valign: options.valign || "top",
    fit: options.fit || "shrink",
    margin: options.margin ?? 0.06,
    breakLine: options.breakLine ?? false,
  });
}

function formatList(items, maxItems = 6) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  if (safeItems.length === 0) return "No additional supporting content captured.";

  const visibleItems = safeItems.slice(0, maxItems);
  const lines = visibleItems.map((item, index) => `${index + 1}. ${item}`);

  if (safeItems.length > maxItems) {
    lines.push(`+ ${safeItems.length - maxItems} more item(s) in the storyboard`);
  }

  return lines.join("\n\n");
}

function addSlideMeta(slide, model, slideIndex, totalSlides, targetSize, scale) {
  addTextBlock(
    slide,
    scale,
    `Slide ${slideIndex + 1} of ${totalSlides}`,
    { x: 0.2, y: 0.05, w: 1.4, h: 0.2 },
    {
      fontSize: 9,
      color: model.themeColors.textMuted,
    },
  );

  addTextBlock(
    slide,
    scale,
    `${model.screenTypeName} | ${model.layoutLabel}`,
    {
      x: 1.7,
      y: 0.05,
      w: Math.max(1.5, targetSize.widthIn - 1.9),
      h: 0.2,
    },
    {
      fontSize: 9,
      color: model.themeColors.textBody,
    },
  );
}

function addPrimaryContent(slide, pptx, model, scale) {
  const frame = model.safeFrameIn;
  const gap = Math.max(0.18, frame.w * 0.022);
  const railWidth = Math.max(1.8, frame.w * 0.3);
  const mainWidth = Math.max(2.4, frame.w - railWidth - gap);
  const titleHeight = Math.min(1.25, frame.h * 0.2);
  const bodyHeight = Math.min(1.05, frame.h * 0.17);
  const footerHeight = 0.7;
  const contentHeight = Math.max(1.35, frame.h - titleHeight - bodyHeight - footerHeight - gap * 2);

  const mainX = frame.x;
  const railX = frame.x + mainWidth + gap;
  const titleY = frame.y;
  const bodyY = titleY + titleHeight + 0.08;
  const contentY = bodyY + bodyHeight + gap;
  const footerY = frame.y + frame.h - footerHeight;

  addCard(slide, pptx, scale, frame, {
    fillColor: model.themeColors.surface,
    lineColor: model.themeColors.border,
    linePt: 1.1,
    rectRadius: 0.08,
  });

  addCard(
    slide,
    pptx,
    scale,
    { x: mainX, y: titleY, w: mainWidth, h: titleHeight },
    {
      fillColor: model.themeColors.accentSoft,
      lineColor: model.themeColors.accentSoft,
      rectRadius: 0.08,
    },
  );

  addTextBlock(
    slide,
    scale,
    model.screenTypeName.toUpperCase(),
    { x: mainX + 0.18, y: titleY + 0.12, w: mainWidth - 0.36, h: 0.18 },
    {
      fontSize: 8.5,
      color: model.themeColors.accentText,
      bold: true,
    },
  );

  addTextBlock(
    slide,
    scale,
    model.title,
    { x: mainX + 0.18, y: titleY + 0.34, w: mainWidth - 0.36, h: titleHeight - 0.42 },
    {
      fontSize: 24,
      color: model.themeColors.textStrong,
      bold: true,
    },
  );

  addTextBlock(
    slide,
    scale,
    model.body,
    { x: mainX, y: bodyY, w: mainWidth, h: bodyHeight },
    {
      fontSize: 12.5,
      color: model.themeColors.textBody,
      margin: 0.1,
    },
  );

  addCard(
    slide,
    pptx,
    scale,
    { x: mainX, y: contentY, w: mainWidth, h: contentHeight },
    {
      fillColor: model.themeColors.surfaceMuted,
      lineColor: model.themeColors.border,
      rectRadius: 0.06,
    },
  );

  addTextBlock(
    slide,
    scale,
    model.contentLabel,
    { x: mainX + 0.16, y: contentY + 0.12, w: mainWidth - 0.32, h: 0.22 },
    {
      fontSize: 10.5,
      color: model.themeColors.accentText,
      bold: true,
    },
  );

  addTextBlock(
    slide,
    scale,
    formatList(model.contentItems),
    { x: mainX + 0.16, y: contentY + 0.38, w: mainWidth - 0.32, h: contentHeight - 0.5 },
    {
      fontSize: 11,
      color: model.themeColors.textBody,
      margin: 0.08,
    },
  );

  addCard(
    slide,
    pptx,
    scale,
    { x: railX, y: titleY, w: railWidth, h: 1.3 },
    {
      fillColor: model.themeColors.surfaceMuted,
      lineColor: model.themeColors.border,
      rectRadius: 0.06,
    },
  );

  addTextBlock(
    slide,
    scale,
    "Build Settings",
    { x: railX + 0.14, y: titleY + 0.12, w: railWidth - 0.28, h: 0.2 },
    {
      fontSize: 10,
      color: model.themeColors.accentText,
      bold: true,
    },
  );

  addTextBlock(
    slide,
    scale,
    `Layout: ${model.layoutLabel}\nTheme: ${model.themeName}\nCanvas: ${model.slideSize.label}`,
    { x: railX + 0.14, y: titleY + 0.38, w: railWidth - 0.28, h: 0.76 },
    {
      fontSize: 10,
      color: model.themeColors.textBody,
      margin: 0.06,
    },
  );

  const notesHeight = Math.max(1.2, contentHeight - 0.9);
  addCard(
    slide,
    pptx,
    scale,
    { x: railX, y: titleY + 1.48, w: railWidth, h: notesHeight },
    {
      fillColor: model.themeColors.surface,
      lineColor: model.themeColors.border,
      rectRadius: 0.06,
    },
  );

  addTextBlock(
    slide,
    scale,
    "Production Notes",
    { x: railX + 0.14, y: titleY + 1.6, w: railWidth - 0.28, h: 0.2 },
    {
      fontSize: 10,
      color: model.themeColors.accentText,
      bold: true,
    },
  );

  addTextBlock(
    slide,
    scale,
    model.notes || "No additional notes were captured for this slide.",
    { x: railX + 0.14, y: titleY + 1.86, w: railWidth - 0.28, h: notesHeight - 0.32 },
    {
      fontSize: 10,
      color: model.themeColors.textBody,
      margin: 0.06,
    },
  );

  addCard(
    slide,
    pptx,
    scale,
    { x: mainX, y: footerY, w: Math.min(2.2, mainWidth * 0.42), h: 0.48 },
    {
      fillColor: model.themeColors.accent,
      lineColor: model.themeColors.accent,
      rectRadius: 0.08,
    },
  );

  addTextBlock(
    slide,
    scale,
    model.cta,
    { x: mainX + 0.08, y: footerY + 0.07, w: Math.min(2.04, mainWidth * 0.42) - 0.16, h: 0.28 },
    {
      fontSize: 11,
      color: model.themeColors.buttonText,
      bold: true,
      align: "center",
      valign: "mid",
      fit: "shrink",
    },
  );

  addTextBlock(
    slide,
    scale,
    "Exported from Storyline Layout App",
    {
      x: mainX + Math.min(2.35, mainWidth * 0.46),
      y: footerY + 0.12,
      w: Math.max(1.2, mainWidth - Math.min(2.35, mainWidth * 0.46)),
      h: 0.2,
    },
    {
      fontSize: 9,
      color: model.themeColors.textMuted,
    },
  );
}

export function renderStoryboardSlide({
  slide,
  pptx,
  model,
  slideIndex,
  totalSlides,
  targetSize,
}) {
  const scale = makeScaler(model, targetSize);

  slide.background = { color: model.themeColors.canvas };
  addSlideMeta(slide, model, slideIndex, totalSlides, targetSize, scale);
  addGuideLines(slide, pptx, model, scale);
  addPrimaryContent(slide, pptx, model, scale);
}
