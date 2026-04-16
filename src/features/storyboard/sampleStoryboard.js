import { createStoryboardSlide } from "@/components/slideModel";

export function createSampleStoryboard() {
  const intro = createStoryboardSlide("title");
  intro.title = "Welcome to Customer Conversations";
  intro.body = "This sample storyboard shows how to introduce a topic, guide the learner through a process, and finish with a short knowledge check.";
  intro.cta = "Start Lesson";
  intro.titleHighlights = [
    { text: "Set context quickly" },
    { text: "Guide the learner" },
    { text: "Check understanding" },
  ];

  const process = createStoryboardSlide("process");
  process.title = "Support Call Workflow";
  process.body = "Use a simple three-step flow to acknowledge, investigate, and resolve the issue.";
  process.cta = "Review Steps";
  process.processSteps = [
    { title: "Acknowledge", description: "Confirm the issue and show empathy." },
    { title: "Investigate", description: "Ask focused questions and identify the root cause." },
    { title: "Resolve", description: "Offer a clear next step and confirm the outcome." },
  ];

  const quiz = createStoryboardSlide("quiz");
  quiz.title = "Quick Check";
  quiz.body = "Which response best demonstrates empathy at the start of a support call?";
  quiz.cta = "Submit";
  quiz.quizOptions = [
    { text: "State the policy immediately." },
    { text: "Acknowledge the concern and ask a clarifying question." },
    { text: "Transfer the learner without context." },
    { text: "Skip directly to the solution." },
  ];

  return {
    slides: [intro, process, quiz],
    activeSlideId: intro.id,
  };
}
