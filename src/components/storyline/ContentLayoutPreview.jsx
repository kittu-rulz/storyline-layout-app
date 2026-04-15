import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";
import { Image as ImageIcon } from "lucide-react";

const FALLBACK_CONTENT_BLOCKS = [
  {
    title: "Core Insight",
    content: "Use this block for your primary explanation or key concept.",
  },
  {
    title: "Supporting Detail",
    content: "Use this block for examples, process notes, or implementation guidance.",
  },
];

function getContentBlocks(form) {
  if (!Array.isArray(form.contentBlocks) || form.contentBlocks.length === 0) {
    return FALLBACK_CONTENT_BLOCKS;
  }

  return form.contentBlocks.map((item, index) => ({
    title:
      typeof item?.title === "string" && item.title.length > 0
        ? item.title
        : `Block ${index + 1}`,
    content: typeof item?.content === "string" ? item.content : "",
  }));
}

function Frame({ form, t, frameStyle, children }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10 h-full">{children}</div>
      <SafeGridOverlay form={form} />
    </div>
  );
}

function MediaPanel({ t, label }) {
  return (
    <div className={`flex h-full flex-col rounded-[28px] border ${t.placeholderBorder} ${t.placeholderSurface} p-4`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
        <ImageIcon className={`h-4 w-4 ${t.placeholderText}`} />
        <span className={t.placeholderText}>{label}</span>
      </div>
      <div className={`mt-4 flex-1 rounded-[24px] border border-dashed ${t.placeholderBorder} bg-white/60`} />
      <div className="mt-4 space-y-2">
        <div className="h-2 w-32 rounded-full bg-slate-300/80" />
        <div className="h-2 w-24 rounded-full bg-slate-200/90" />
      </div>
    </div>
  );
}

function CopyStack({ form, t, blocks, badgeLabel = "Content" }) {
  return (
    <div className="flex h-full flex-col">
      <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
        {badgeLabel}
      </Badge>
      <h2 className={`text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
      <p className={`mt-4 text-[15px] leading-7 ${t.textBody}`}>{form.body}</p>

      <div className="mt-5 space-y-3">
        {blocks.slice(0, 2).map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`rounded-3xl border p-4 ${t.surfaceMuted} ${t.surfaceBorder}`}
          >
            <p className={`text-sm font-semibold ${t.accentText}`}>{item.title}</p>
            <p className={`mt-2 text-sm leading-6 ${t.textBody}`}>{item.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button className={`${t.button} rounded-2xl px-5 text-white`}>{form.cta}</Button>
      </div>
    </div>
  );
}

function DetailCard({ t, title, body }) {
  return (
    <div className={`rounded-[28px] border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${t.accentText}`} />
        <p className={`text-sm font-semibold ${t.accentText}`}>{title}</p>
      </div>
      <p className={`mt-3 text-sm leading-6 ${t.textBody}`}>{body}</p>
    </div>
  );
}

export function ContentLayoutPreview({ form, t, frameStyle }) {
  const blocks = getContentBlocks(form);
  const firstBlock = blocks[0] || FALLBACK_CONTENT_BLOCKS[0];
  const secondBlock = blocks[1] || FALLBACK_CONTENT_BLOCKS[1];

  if (form.layout === "image-left-text-right") {
    return (
      <Frame form={form} t={t} frameStyle={frameStyle}>
        <div className="grid h-full grid-cols-12 gap-6 p-8">
          <div className="col-span-6">
            <MediaPanel t={t} label="Visual Reference" />
          </div>
          <div className="col-span-6 min-w-0">
            <CopyStack form={form} t={t} blocks={blocks} />
          </div>
        </div>
      </Frame>
    );
  }

  if (form.layout === "full-width-content") {
    return (
      <Frame form={form} t={t} frameStyle={frameStyle}>
        <div className="flex h-full flex-col p-8">
          <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
            Full Width Content
          </Badge>
          <h2 className={`text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
          <div className={`mt-5 flex-1 rounded-[32px] border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
            <p className={`text-base leading-8 ${t.textBody}`}>{form.body}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {blocks.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-3xl bg-white/75 p-4">
                  <p className={`text-sm font-semibold ${t.accentText}`}>{item.title}</p>
                  <p className={`mt-2 text-sm leading-6 ${t.textBody}`}>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6">
            <Button className={`${t.button} rounded-2xl px-5 text-white`}>{form.cta}</Button>
          </div>
        </div>
      </Frame>
    );
  }

  if (form.layout === "image-top-text-bottom") {
    return (
      <Frame form={form} t={t} frameStyle={frameStyle}>
        <div className="flex h-full flex-col gap-6 p-8">
          <div className="h-[42%]">
            <MediaPanel t={t} label="Hero Media" />
          </div>
          <div className="min-h-0 flex-1">
            <CopyStack form={form} t={t} blocks={blocks} badgeLabel="Media Story" />
          </div>
        </div>
      </Frame>
    );
  }

  if (form.layout === "two-column-text") {
    return (
      <Frame form={form} t={t} frameStyle={frameStyle}>
        <div className="flex h-full flex-col p-8">
          <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
            Two Column Content
          </Badge>
          <h2 className={`text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
          <p className={`mt-3 text-[15px] leading-7 ${t.textBody}`}>{form.body}</p>
          <div className="mt-6 grid flex-1 grid-cols-2 gap-5">
            <DetailCard t={t} title={firstBlock.title} body={firstBlock.content} />
            <DetailCard t={t} title={secondBlock.title} body={secondBlock.content} />
          </div>
          <div className="pt-6">
            <Button className={`${t.button} rounded-2xl px-5 text-white`}>{form.cta}</Button>
          </div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame form={form} t={t} frameStyle={frameStyle}>
      <div className="grid h-full grid-cols-12 gap-6 p-8">
        <div className="col-span-6 min-w-0">
          <CopyStack form={form} t={t} blocks={blocks} />
        </div>
        <div className="col-span-6">
          <MediaPanel t={t} label="Image or Illustration" />
        </div>
      </div>
    </Frame>
  );
}

