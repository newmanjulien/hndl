// app/components/dashboard/PlaybookAccordion.js
"use client";

import { ChevronRight, Target, Zap, Rocket, DollarSign } from "lucide-react";
import {
  Card,
  AccordionItem,
  AccordionTrigger,
  AccordionTitleGroup,
  AccordionIcon,
  AccordionText,
  AccordionChevron,
  AccordionContent,
  AccordionDescription,
  Accordion,
} from "@/components/ui";
import WorkflowTable from "./WorkflowTable";
import EmptyState from "../shared/EmptyState";

const PlaybookAccordion = ({
  workflows,
  onToggleStatus,
  onEdit,
  updatingStatus,
  activePlaybookSection,
  setActivePlaybookSection,
  activeSection,
}) => {
  const playbookSections = [
    {
      id: "failing-to-close",
      title: "Rep is failing to close deals",
      description:
        "Comprehensive playbooks designed to help sales reps overcome common obstacles in the deal closure process, including objection handling, pricing negotiations, and timing issues.",
      icon: Target,
    },
    {
      id: "deals-drop-off",
      title: "Deals drop off in negotiation",
      description:
        "Strategic approaches to prevent deal abandonment during critical negotiation phases, with focus on maintaining momentum and addressing buyer concerns.",
      icon: Zap,
    },
    {
      id: "not-moving-forward",
      title: "Rep is not moving deals forward in earlier stages",
      description:
        "Tactical workflows to accelerate deal progression through discovery, qualification, and proposal stages with systematic follow-up strategies.",
      icon: Rocket,
    },
    {
      id: "acv-off-whack",
      title: "ACV optimization strategies",
      description:
        "Data-driven approaches to optimize Annual Contract Value through upselling, cross-selling, and strategic pricing adjustments.",
      icon: DollarSign,
    },
  ];

  const getPlaybooksForSection = (sectionId) => {
    return workflows.filter(
      (workflow) =>
        workflow.isPlaybookWorkflow && workflow.playbook === sectionId
    );
  };

  const renderPlaybookSection = (section) => {
    const sectionWorkflows = getPlaybooksForSection(section.id);
    const workflowCount = sectionWorkflows.length;
    const IconComponent = section.icon;

    return (
      <Card key={section.id}>
        <AccordionItem value={section.id}>
          <AccordionTrigger variant="playbook">
            <AccordionTitleGroup>
              <AccordionIcon>
                <IconComponent className="w-4 h-4 text-gray-600" />
              </AccordionIcon>
              <div>
                <AccordionText variant="title">{section.title}</AccordionText>
                <AccordionText variant="subtitle">
                  {workflowCount} workflow{workflowCount !== 1 ? "s" : ""}
                </AccordionText>
              </div>
            </AccordionTitleGroup>
            <AccordionChevron>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </AccordionChevron>
          </AccordionTrigger>
          <AccordionContent variant="playbook">
            <AccordionDescription variant="container">
              <AccordionDescription variant="text" as="p">
                {section.description}
              </AccordionDescription>
            </AccordionDescription>

            {sectionWorkflows.length > 0 ? (
              <WorkflowTable
                workflows={sectionWorkflows}
                onToggleStatus={onToggleStatus}
                onEdit={onEdit}
                updatingStatus={updatingStatus}
                isPlaybookWorkflow={true}
                playbookSectionId={section.id}
                activeSection={activeSection}
              />
            ) : (
              <EmptyState sectionName="playbooks" />
            )}
          </AccordionContent>
        </AccordionItem>
      </Card>
    );
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={activePlaybookSection}
      onValueChange={setActivePlaybookSection}
      className="space-y-4"
    >
      {playbookSections.map((section) => renderPlaybookSection(section))}
    </Accordion>
  );
};

export default PlaybookAccordion;
