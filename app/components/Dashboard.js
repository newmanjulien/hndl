// app/components/Dashboard.js
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Play,
  Pause,
  BookOpen,
  Workflow,
  ChevronRight,
  Zap,
  Target,
  Rocket,
  DollarSign,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  LoadingState,
  Layout,
  PageHeader,
  Badge,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  AccordionItem,
  AccordionTrigger,
  AccordionTitleGroup,
  AccordionIcon,
  AccordionText,
  AccordionChevron,
  AccordionContent,
  AccordionDescription,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  Accordion,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

const Dashboard = ({
  onNavigateToWorkflow,
  onCreateNew,
  initialSection = "workflows",
  initialPlaybookSection = null,
}) => {
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [activePlaybookSection, setActivePlaybookSection] = useState(
    initialPlaybookSection
  );

  // Define playbook subsections
  const playbookSections = [
    {
      id: "failing-to-close",
      title: "Rep is failing to close deals",
      description:
        "We are creating playbooks for the common ways reps miss quota. Playbooks will make it quick and easy to help your rep. Each playbook will contain pre-programmed workflows based on best practices from top Sales Managers. And each workflow will be fully customizable so you can make them fit your specific process",
      icon: Target,
    },
    {
      id: "deals-drop-off",
      title: "Deals drop off in negotiation",
      description:
        "We are creating playbooks for the common ways reps miss quota. Playbooks will make it quick and easy to help your rep. Each playbook will contain pre-programmed workflows based on best practices from top Sales Managers. And each workflow will be fully customizable so you can make them fit your specific process",
      icon: Zap,
    },
    {
      id: "not-moving-forward",
      title: "Rep is not moving deals forward in earlier stages",
      description:
        "We are creating playbooks for the common ways reps miss quota. Playbooks will make it quick and easy to help your rep. Each playbook will contain pre-programmed workflows based on best practices from top Sales Managers. And each workflow will be fully customizable so you can make them fit your specific process",
      icon: Rocket,
    },
    {
      id: "acv-off-whack",
      title: "ACV optimization strategies",
      description:
        "We are creating playbooks for the common ways reps miss quota. Playbooks will make it quick and easy to help your rep. Each playbook will contain pre-programmed workflows based on best practices from top Sales Managers. And each workflow will be fully customizable so you can make them fit your specific process",
      icon: DollarSign,
    },
  ];

  useEffect(() => {
    loadWorkflows();
  }, []);

  // Update activeSection when initialSection changes
  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  // Update activePlaybookSection when initialPlaybookSection changes
  useEffect(() => {
    setActivePlaybookSection(initialPlaybookSection);
  }, [initialPlaybookSection]);

  const loadWorkflows = async () => {
    try {
      const response = await fetch("/api/workflows");
      const result = await response.json();

      if (result.workflows) {
        setWorkflows(result.workflows);
      }
    } catch (error) {
      console.error("Error loading workflows:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkflow = async (workflowId, workflowTitle) => {
    if (
      !confirm(
        `Are you sure you want to delete "${workflowTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(workflowId);

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setWorkflows(workflows.filter((w) => w.id !== workflowId));
      } else {
        alert("Error deleting workflow: " + result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting workflow: " + error.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleWorkflowStatus = async (workflowId, currentStatus) => {
    setUpdatingStatus(workflowId);

    try {
      const response = await fetch(`/api/workflows/${workflowId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isRunning: !currentStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setWorkflows(
          workflows.map((w) =>
            w.id === workflowId ? { ...w, isRunning: !currentStatus } : w
          )
        );
      } else {
        alert("Error updating workflow status: " + result.error);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Error updating workflow status: " + error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStepsSummary = (steps) => {
    if (!steps || steps.length === 0) return "No steps";

    const aiSteps = steps.filter((step) => step.executor === "ai").length;
    const humanSteps = steps.filter((step) => step.executor === "human").length;

    const parts = [];
    if (aiSteps > 0) parts.push(`${aiSteps} AI`);
    if (humanSteps > 0) parts.push(`${humanSteps} Human`);

    return parts.join(", ");
  };

  const getPlaybooksForSection = (sectionId) => {
    const playbookWorkflows = workflows.filter(
      (workflow) => workflow.isPlaybookWorkflow === true
    );
    return playbookWorkflows.filter(
      (workflow) => workflow.playbook === sectionId
    );
  };

  const getPlaybookCountForSection = (sectionId) => {
    return getPlaybooksForSection(sectionId).length;
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    if (activeSection === "playbooks") {
      return workflow.isPlaybookWorkflow === true;
    } else {
      return workflow.isPlaybookWorkflow !== true;
    }
  });

  const renderWorkflowRow = (
    workflow,
    isPlaybookWorkflow = false,
    playbookSectionId = null
  ) => (
    <TableRow
      key={workflow.id}
      variant={isPlaybookWorkflow ? "playbook" : "workflow"}
    >
      <TableCell variant="workflow">
        <Layout variant="space-x-3">
          {/* Status Indicator */}
          <Badge
            variant="dot"
            color={workflow.isRunning ? "active" : "inactive"}
            className="flex-shrink-0"
          />

          {/* Workflow Info */}
          <div className="flex-1 min-w-0">
            <Layout variant="space-x-2">
              <h3 className="workflow-title">{workflow.title}</h3>
            </Layout>
            <div className="workflow-description">
              {workflow.steps &&
                workflow.steps.length > 0 &&
                workflow.steps[0].instruction}
            </div>
          </div>
        </Layout>
      </TableCell>

      <TableCell variant="workflow">
        <Badge
          variant="default"
          color={workflow.isRunning ? "active" : "inactive"}
        >
          {workflow.isRunning ? "Active" : "Paused"}
        </Badge>
      </TableCell>

      <TableCell variant="workflow">
        <span className="workflow-summary">
          {getStepsSummary(workflow.steps)}
        </span>
      </TableCell>

      <TableCell variant="workflow-right">
        <Layout variant="space-x-2-right">
          {/* Run/Pause Button */}
          <Button
            onClick={() =>
              handleToggleWorkflowStatus(workflow.id, workflow.isRunning)
            }
            disabled={updatingStatus === workflow.id}
            variant={
              updatingStatus === workflow.id
                ? "updating"
                : workflow.isRunning
                ? "pause"
                : "run"
            }
            size="sm"
          >
            {updatingStatus === workflow.id ? (
              "Updating..."
            ) : workflow.isRunning ? (
              <>
                <Pause className="w-3 h-3" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                Run
              </>
            )}
          </Button>

          {/* Edit Button */}
          <Button
            onClick={() =>
              onNavigateToWorkflow(
                workflow.id,
                activeSection,
                playbookSectionId
              )
            }
            variant="edit"
            size="sm"
          >
            Edit
          </Button>

          {/* Delete Button */}
          {!isPlaybookWorkflow && (
            <Button
              onClick={() => handleDeleteWorkflow(workflow.id, workflow.title)}
              disabled={isDeleting === workflow.id}
              variant="delete"
              size="sm"
            >
              <Trash2 className="w-3 h-3" />
              <span>
                {isDeleting === workflow.id ? "Deleting..." : "Delete"}
              </span>
            </Button>
          )}
        </Layout>
      </TableCell>
    </TableRow>
  );

  const renderPlaybookSection = (section) => {
    const sectionWorkflows = getPlaybooksForSection(section.id);
    const workflowCount = getPlaybookCountForSection(section.id);
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
            {/* Section Description */}
            <AccordionDescription variant="container">
              <AccordionDescription variant="text" as="p">
                {section.description}
              </AccordionDescription>
            </AccordionDescription>

            {/* Workflows Table */}
            {sectionWorkflows.length > 0 ? (
              <TableContainer variant="workflow">
                <Table variant="workflow">
                  <TableHeader variant="workflow">
                    <TableRow variant="workflow">
                      <TableHead variant="workflow">Workflow</TableHead>
                      <TableHead variant="workflow">Status</TableHead>
                      <TableHead variant="workflow">Steps</TableHead>
                      <TableHead variant="workflow-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody variant="workflow">
                    {sectionWorkflows.map((workflow) =>
                      renderWorkflowRow(workflow, true, section.id)
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <EmptyState size="sm">
                <EmptyStateIcon>
                  <Workflow className="w-6 h-6 text-gray-400" />
                </EmptyStateIcon>
                <EmptyStateDescription>
                  No workflows in this playbook yet
                </EmptyStateDescription>
              </EmptyState>
            )}
          </AccordionContent>
        </AccordionItem>
      </Card>
    );
  };

  const renderEmptyState = (sectionName) => (
    <EmptyState>
      <EmptyStateIcon>
        {sectionName === "workflows" ? (
          <Workflow className="w-6 h-6 text-gray-400" />
        ) : (
          <BookOpen className="w-6 h-6 text-gray-400" />
        )}
      </EmptyStateIcon>
      <EmptyStateTitle>
        {sectionName === "workflows" ? "No workflows yet" : "No playbooks yet"}
      </EmptyStateTitle>
      <EmptyStateDescription>
        {sectionName === "workflows"
          ? "Your workflows will appear here when created"
          : "Your playbooks will appear here when created"}
      </EmptyStateDescription>
    </EmptyState>
  );

  const renderWorkflowsContent = () => (
    <Card>
      <CardContent>
        {filteredWorkflows.length === 0 ? (
          renderEmptyState("workflows")
        ) : (
          <TableContainer variant="workflow">
            <Table variant="workflow">
              <TableHeader variant="workflow">
                <TableRow variant="workflow">
                  <TableHead variant="workflow">Workflow</TableHead>
                  <TableHead variant="workflow">Status</TableHead>
                  <TableHead variant="workflow">Steps</TableHead>
                  <TableHead variant="workflow-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody variant="workflow">
                {filteredWorkflows.map((workflow) =>
                  renderWorkflowRow(workflow, false, null)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderPlaybooksContent = () => (
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

  if (isLoading) {
    return (
      <LoadingState
        variant="fullscreen"
        title="Loading workflows..."
        description="Please wait while we fetch your data"
      />
    );
  }

  return (
    <div className="min-h-screen disabled-gray-bg">
      {/* Header */}
      <PageHeader size="md">
        <Layout variant="page-content" className="h-full">
          <Layout variant="page-inner" className="h-full">
            <Layout variant="header-grid">
              <Layout variant="header-left">
                {/* Left content or empty */}
              </Layout>
              <Layout variant="header-center">
                <h1 className="heading-secondary">Workflows</h1>
              </Layout>
              <Layout variant="header-right">
                {activeSection === "workflows" && (
                  <Button onClick={onCreateNew} variant="primary" size="lg">
                    <Plus className="w-4 h-4" />
                    New workflow
                  </Button>
                )}
              </Layout>
            </Layout>
          </Layout>
        </Layout>
      </PageHeader>

      {/* Separate Tab Navigation Section */}
      <div className="border-b border-gray-200 bg-white">
        <Layout variant="page-content">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList variant="navigation" className="w-full justify-start">
              <TabsTrigger value="workflows" variant="navigation">
                <Layout variant="space-x-2">
                  <span>My workflows</span>
                  <Badge variant="count" color="inactive">
                    {workflows.filter((w) => !w.isPlaybookWorkflow).length}
                  </Badge>
                </Layout>
              </TabsTrigger>
              <TabsTrigger value="playbooks" variant="navigation">
                <Layout variant="space-x-2">
                  <span>Playbooks</span>
                  <Badge variant="count" color="inactive">
                    {workflows.filter((w) => w.isPlaybookWorkflow).length}
                  </Badge>
                </Layout>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Layout>
      </div>

      {/* Main Content */}
      <Layout variant="page-content" className="py-8">
        {activeSection === "workflows"
          ? renderWorkflowsContent()
          : renderPlaybooksContent()}
      </Layout>
    </div>
  );
};

export default Dashboard;
