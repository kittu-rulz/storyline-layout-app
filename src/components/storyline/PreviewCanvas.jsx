import { AccordionInteractionLayoutPreview } from "@/components/storyline/AccordionInteractionLayoutPreview";
import { ComparisonLayoutPreview } from "@/components/storyline/ComparisonLayoutPreview";
import { ContentLayoutPreview } from "@/components/storyline/ContentLayoutPreview";
import { InteractionLayoutPreview } from "@/components/storyline/InteractionLayoutPreview";
import { ObjectivesLayoutPreview } from "@/components/storyline/ObjectivesLayoutPreview";
import { ProcessLayoutPreview } from "@/components/storyline/ProcessLayoutPreview";
import { QuizLayoutPreview } from "@/components/storyline/QuizLayoutPreview";
import { ReflectionLayoutPreview } from "@/components/storyline/ReflectionLayoutPreview";
import { ScenarioLayoutPreview } from "@/components/storyline/ScenarioLayoutPreview";
import { SummaryLayoutPreview } from "@/components/storyline/SummaryLayoutPreview";
import { TabsInteractionLayoutPreview } from "@/components/storyline/TabsInteractionLayoutPreview";
import { TimelineLayoutPreview } from "@/components/storyline/TimelineLayoutPreview";
import { getSlideAspectRatioStyle } from "@/components/storyline/slideSize";
import { TitleLayoutPreview } from "@/components/storyline/TitleLayoutPreview";
import { themes } from "@/data/themes";

const PREVIEW_COMPONENTS = {
  title: TitleLayoutPreview,
  content: ContentLayoutPreview,
  objectives: ObjectivesLayoutPreview,
  process: ProcessLayoutPreview,
  comparison: ComparisonLayoutPreview,
  timeline: TimelineLayoutPreview,
  summary: SummaryLayoutPreview,
  tabs: TabsInteractionLayoutPreview,
  scenario: ScenarioLayoutPreview,
  reflection: ReflectionLayoutPreview,
  accordionInteraction: AccordionInteractionLayoutPreview,
  interaction: InteractionLayoutPreview,
  quiz: QuizLayoutPreview,
};

export function PreviewCanvas({ form }) {
  const theme = themes[form.theme] ?? themes.corporate;
  const frameStyle = getSlideAspectRatioStyle(form);
  const ActivePreview = PREVIEW_COMPONENTS[form.screenType] || QuizLayoutPreview;

  return <ActivePreview form={form} t={theme} frameStyle={frameStyle} />;
}
