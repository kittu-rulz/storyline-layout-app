import { useRef } from "react";
import { Download, FileText, Presentation, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImportExportPanel({
  onExportSpec,
  onExportBrief,
  onExportCurrentPptx,
  onExportPptx,
  onImportStoryboardJson,
  importError,
  exportReadiness,
}) {
  const importInputRef = useRef(null);
  const isSlideReadyForExport = Boolean(exportReadiness?.valid);

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportStoryboardJson(file);
    }
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImportFileChange}
      />

      <div
        role="status"
        aria-live="polite"
        className={exportReadiness?.valid ? "rounded-[22px] border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-600 shadow-sm" : "rounded-[22px] border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-700 shadow-sm"}
      >
        {exportReadiness?.valid
          ? "Current slide is ready for export."
          : `Before export: ${exportReadiness?.summary}`}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-11 justify-start rounded-2xl px-3 py-2.5 text-left"
          onClick={onExportSpec}
          disabled={!isSlideReadyForExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Spec JSON
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-11 justify-start rounded-2xl px-3 py-2.5 text-left"
          onClick={onExportBrief}
          disabled={!isSlideReadyForExport}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export Brief TXT
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-11 justify-start rounded-2xl px-3 py-2.5 text-left"
          onClick={onExportCurrentPptx}
          disabled={!isSlideReadyForExport}
        >
          <Presentation className="mr-2 h-4 w-4" />
          Export Current Slide PPTX
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-11 justify-start rounded-2xl px-3 py-2.5 text-left"
          onClick={onExportPptx}
          disabled={!isSlideReadyForExport}
        >
          <Presentation className="mr-2 h-4 w-4" />
          Export Storyboard PPTX
        </Button>
        <Button type="button" variant="outline" className="h-auto min-h-11 justify-start rounded-2xl px-3 py-2.5 text-left md:col-span-2" onClick={handleImportClick}>
          <Upload className="mr-2 h-4 w-4" />
          Import Storyboard JSON
        </Button>
      </div>

      {importError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {importError}
        </div>
      ) : null}
    </>
  );
}
