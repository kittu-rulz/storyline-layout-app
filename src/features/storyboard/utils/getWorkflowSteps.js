export function getWorkflowSteps({ workspaceTab, exportReadiness }) {
  const steps = [
    {
      label: "Structure selected",
      description: "Choose a screen type and matching layout.",
      done: Boolean(exportReadiness?.sections?.structure?.complete),
    },
    {
      label: "Core copy added",
      description: "Add the title, body copy, and CTA text.",
      done: Boolean(exportReadiness?.sections?.content?.complete),
    },
    {
      label: "Handoff reviewed",
      description: "Open the brief and confirm the slide is ready.",
      done: workspaceTab === "spec" || Boolean(exportReadiness?.valid),
    },
  ];

  return {
    steps,
    completedCount: steps.filter((step) => step.done).length,
  };
}
