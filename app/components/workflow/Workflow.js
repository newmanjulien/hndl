// app/components/workflow/Workflow.js
"use client";

import { useState, useEffect } from "react";
import { Plus, ArrowLeft, Check } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  LoadingState,
  Layout,
  PageHeader,
} from "@/components/ui";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowStep from "./WorkflowStep";

const Workflow = ({ workflowId: initialWorkflowId = null, onNavigateBack }) => {
  const [workflowId, setWorkflowId] = useState(initialWorkflowId);
  const [workflowTitle, setWorkflowTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const [isPlaybookWorkflow, setIsPlaybookWorkflow] = useState(false);
  const [playbookDescription, setPlaybookDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSavedState, setShowSavedState] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [originalData, setOriginalData] = useState({
    title: "",
    steps: [],
    isPlaybookWorkflow: false,
    playbookDescription: "",
  });

  useEffect(() => {
    if (initialWorkflowId) {
      loadSpecificWorkflow(initialWorkflowId);
    } else {
      loadLatestWorkflow();
    }
  }, [initialWorkflowId]);

  useEffect(() => {
    const currentData = {
      title: workflowTitle,
      steps: steps,
      isPlaybookWorkflow: isPlaybookWorkflow,
      playbookDescription: playbookDescription,
    };
    const hasChanges =
      JSON.stringify(currentData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [
    workflowTitle,
    steps,
    isPlaybookWorkflow,
    playbookDescription,
    originalData,
  ]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadSpecificWorkflow = async (id) => {
    try {
      const response = await fetch(`/api/workflows/${id}`);
      const result = await response.json();
      if (result.workflow) {
        const data = {
          title: result.workflow.title,
          steps: result.workflow.steps,
          isPlaybookWorkflow: result.workflow.isPlaybookWorkflow || false,
          playbookDescription: result.workflow.playbook_description || "",
        };
        setWorkflowTitle(data.title);
        setSteps(data.steps);
        setIsPlaybookWorkflow(data.isPlaybookWorkflow);
        setPlaybookDescription(data.playbookDescription);
        setOriginalData(data);
      } else {
        console.error("Workflow not found");
        setDefaultWorkflow();
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      setDefaultWorkflow();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLatestWorkflow = async () => {
    setDefaultWorkflow();
    setIsLoading(false);
  };

  const setDefaultWorkflow = () => {
    const defaultData = {
      title: "My new workflow",
      steps: [
        {
          id: Date.now(),
          instruction:
            "Add your first step and assign it either to the AI or to a human",
          executor: "ai",
        },
      ],
      isPlaybookWorkflow: false,
      playbookDescription: "",
    };
    setWorkflowTitle(defaultData.title);
    setSteps(defaultData.steps);
    setIsPlaybookWorkflow(defaultData.isPlaybookWorkflow);
    setPlaybookDescription(defaultData.playbookDescription);
    setOriginalData(defaultData);
  };

  const addStep = () => {
    const newStep = {
      id: Date.now(),
      instruction: "",
      executor: "ai",
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id, field, value) => {
    setSteps(
      steps.map((step) => {
        if (step.id === id) {
          const updatedStep = { ...step, [field]: value };
          if (field === "executor" && value === "ai") {
            delete updatedStep.assignedHuman;
          }
          if (
            field === "executor" &&
            value === "human" &&
            !step.assignedHuman
          ) {
            updatedStep.assignedHuman = "Femi Ibrahim";
          }
          return updatedStep;
        }
        return step;
      })
    );
  };

  const deleteStep = (id) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  const moveStepUp = (index) => {
    if (index > 0) {
      const newSteps = [...steps];
      const temp = newSteps[index];
      newSteps[index] = newSteps[index - 1];
      newSteps[index - 1] = temp;
      setSteps(newSteps);
    }
  };

  const moveStepDown = (index) => {
    if (index < steps.length - 1) {
      const newSteps = [...steps];
      const temp = newSteps[index];
      newSteps[index] = newSteps[index + 1];
      newSteps[index + 1] = temp;
      setSteps(newSteps);
    }
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes that will be lost. Are you sure you want to leave?"
        )
      ) {
        onNavigateBack();
      }
    } else {
      onNavigateBack();
    }
  };

  const handleConfirmLeave = () => {
    onNavigateBack();
    setIsModalOpen(false);
  };

  const saveWorkflow = async () => {
    if (!workflowTitle.trim()) {
      alert("Please enter a workflow title");
      return;
    }
    const hasEmptySteps = steps.some((step) => !step.instruction.trim());
    if (hasEmptySteps) {
      alert("Please fill in all step instructions");
      return;
    }
    setIsSaving(true);
    try {
      const workflowData = {
        title: workflowTitle,
        steps: steps,
        isPlaybookWorkflow: isPlaybookWorkflow,
        playbook_description: playbookDescription,
        playbook: null,
      };
      let response;
      if (workflowId) {
        response = await fetch(`/api/workflows/${workflowId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workflowData),
        });
      } else {
        response = await fetch("/api/workflows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workflowData),
        });
      }
      const result = await response.json();
      if (result.success) {
        if (!workflowId && result.id) {
          setWorkflowId(result.id);
        }
        const savedData = {
          title: workflowTitle,
          steps: steps,
          isPlaybookWorkflow: isPlaybookWorkflow,
          playbookDescription: playbookDescription,
        };
        setOriginalData(savedData);
        setShowSavedState(true);
        setTimeout(() => {
          setShowSavedState(false);
        }, 2000);
        if (onNavigateBack && !initialWorkflowId) {
          setTimeout(() => {
            onNavigateBack();
          }, 2500);
        }
      } else {
        alert("Error saving workflow: " + result.error);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving workflow: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        variant="fullscreen"
        title="Loading workflow..."
        description="Please wait while we fetch your data"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader size="md">
        <Layout variant="page-content" className="h-full">
          <Layout variant="page-inner" className="h-full">
            <Layout variant="header-grid">
              <Layout variant="header-left">
                {onNavigateBack && (
                  <Button
                    onClick={handleBackClick}
                    variant="back"
                    size="sm"
                    className="flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                )}
              </Layout>
              <Layout variant="header-center">
                <h1 className="heading-secondary">
                  {initialWorkflowId ? "Edit Workflow" : "Create Workflow"}
                </h1>
              </Layout>
              <Layout variant="header-right">
                <Button
                  onClick={saveWorkflow}
                  disabled={isSaving || showSavedState}
                  variant={
                    showSavedState ? "saved" : isSaving ? "updating" : "primary"
                  }
                  size="sm"
                >
                  {isSaving ? (
                    "Saving..."
                  ) : showSavedState ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    "Save Workflow"
                  )}
                </Button>
              </Layout>
            </Layout>
          </Layout>
        </Layout>
      </PageHeader>

      <Layout variant="page-content" className="py-8">
        <WorkflowHeader
          workflowTitle={workflowTitle}
          setWorkflowTitle={setWorkflowTitle}
          isPlaybookWorkflow={isPlaybookWorkflow}
          playbookDescription={playbookDescription}
        />

        <Card>
          <CardHeader>
            <Layout variant="flex-between">
              <h3 className="section-header">Workflow Steps</h3>
              <Button
                onClick={addStep}
                variant="primary"
                size="xs"
                className="flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Step</span>
              </Button>
            </Layout>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <WorkflowStep
                  key={step.id}
                  step={step}
                  index={index}
                  steps={steps}
                  updateStep={updateStep}
                  deleteStep={deleteStep}
                  moveStepUp={moveStepUp}
                  moveStepDown={moveStepDown}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </Layout>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLeave}
        title="Unsaved Changes"
      >
        <p>
          You have unsaved changes that will be lost. Are you sure you want to
          leave?
        </p>
      </ConfirmationModal>
    </div>
  );
};

export default Workflow;
