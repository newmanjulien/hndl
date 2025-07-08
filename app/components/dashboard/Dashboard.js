// app/components/dashboard/Dashboard.js
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  LoadingState,
  Layout,
  PageHeader,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import WorkflowTable from "./WorkflowTable";
import PlaybookAccordion from "./PlaybookAccordion";
import EmptyState from "../shared/EmptyState";

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

  useEffect(() => {
    loadWorkflows();
  }, []);

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

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

  const filteredWorkflows = workflows.filter((workflow) => {
    if (activeSection === "playbooks") {
      return workflow.isPlaybookWorkflow === true;
    } else {
      return workflow.isPlaybookWorkflow !== true;
    }
  });

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
      <PageHeader size="md">
        <Layout variant="page-content" className="h-full">
          <Layout variant="page-inner" className="h-full">
            <Layout variant="header-grid">
              <Layout variant="header-left" />
              <Layout variant="header-center">
                <h1 className="heading-secondary">Workflows</h1>
              </Layout>
              <Layout variant="header-right">
                {activeSection === "workflows" && (
                  <Button onClick={onCreateNew} variant="primary" size="sm">
                    <Plus className="w-4 h-4" />
                    New workflow
                  </Button>
                )}
              </Layout>
            </Layout>
          </Layout>
        </Layout>
      </PageHeader>

      <Layout variant="page-content" className="py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList variant="navigation" className="w-full justify-start">
            <TabsTrigger value="workflows" variant="navigation">
              <Layout variant="space-x-2">
                <span>Workflows</span>
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

          <div className="mt-6">
            <TabsContent value="workflows" className="mt-0">
              <Card>
                <CardContent>
                  {filteredWorkflows.length === 0 ? (
                    <EmptyState sectionName="workflows" />
                  ) : (
                    <WorkflowTable
                      workflows={filteredWorkflows}
                      onToggleStatus={handleToggleWorkflowStatus}
                      onEdit={onNavigateToWorkflow}
                      onDelete={handleDeleteWorkflow}
                      updatingStatus={updatingStatus}
                      isDeleting={isDeleting}
                      activeSection={activeSection}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playbooks" className="mt-0">
              <PlaybookAccordion
                workflows={workflows}
                onToggleStatus={handleToggleWorkflowStatus}
                onEdit={onNavigateToWorkflow}
                updatingStatus={updatingStatus}
                activePlaybookSection={activePlaybookSection}
                setActivePlaybookSection={setActivePlaybookSection}
                activeSection={activeSection}
              />
            </TabsContent>
          </div>
        </Tabs>
      </Layout>
    </div>
  );
};

export default Dashboard;
