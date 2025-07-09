"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Sparkles,
  User,
  ArrowLeft,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  LoadingState,
  Layout,
  PageHeader,
  StepNumber,
  StepConnector,
  Input,
  Textarea,
  Select,
} from "@/components/ui";

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

  // Store original data to compare against
  const [originalData, setOriginalData] = useState({
    title: "",
    steps: [],
    isPlaybookWorkflow: false,
    playbookDescription: "",
  });

  // Load existing workflow data on component mount
  useEffect(() => {
    if (initialWorkflowId) {
      loadSpecificWorkflow(initialWorkflowId);
    } else {
      loadLatestWorkflow();
    }
  }, [initialWorkflowId]);

  // Track changes for dirty state
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

  // Browser beforeunload event for unsaved changes
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
    // For new workflows, always start with default data
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
          // If switching from human to AI, remove the assignedHuman field
          if (field === "executor" && value === "ai") {
            delete updatedStep.assignedHuman;
          }
          // If switching to human and no human is assigned, default to first option
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
        confirm(
          "You have unsaved changes that will be lost. Are you sure you want to leave? Your changes will be lost and cannot be recovered."
        )
      ) {
        onNavigateBack();
      }
    } else {
      onNavigateBack();
    }
  };

  const saveWorkflow = async () => {
    // Basic validation
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
      };

      let response;

      if (workflowId) {
        // Update existing workflow
        response = await fetch(`/api/workflows/${workflowId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workflowData),
        });
      } else {
        // Create new workflow
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
        // If this was a new workflow, store the ID for future updates
        if (!workflowId && result.id) {
          setWorkflowId(result.id);
        }

        // Update original data to reflect saved state
        const savedData = {
          title: workflowTitle,
          steps: steps,
          isPlaybookWorkflow: isPlaybookWorkflow,
          playbookDescription: playbookDescription,
        };
        setOriginalData(savedData);

        // Show saved state
        setShowSavedState(true);
        setTimeout(() => {
          setShowSavedState(false);
        }, 2000);

        // If we have a navigation callback and this is a new workflow, navigate back
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
      {/* Header */}
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
                  size="lg"
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

      {/* Main Content */}
      <Layout variant="workflow-content" className="py-8">
        {/* Workflow Title */}
        <div className="mb-6">
          <label htmlFor="workflowTitle" className="text-body">
            Workflow Title
          </label>
          <Input
            id="workflowTitle"
            type="text"
            value={workflowTitle}
            onChange={(e) =>
              !isPlaybookWorkflow && setWorkflowTitle(e.target.value)
            }
            placeholder={isPlaybookWorkflow ? "" : "Enter workflow title..."}
            disabled={isPlaybookWorkflow}
          />
        </div>

        {/* Playbook Description (only for playbook workflows) */}
        {isPlaybookWorkflow && playbookDescription && (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <h3 className="section-header">About this workflow</h3>
              </CardHeader>
              <CardContent>
                <p className="text-body">{playbookDescription}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Steps Section */}
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
                <div key={step.id} className="relative">
                  {/* Step Layout */}
                  <Layout variant="step-layout">
                    {/* Step Number */}
                    <StepNumber variant="large">{index + 1}</StepNumber>

                    {/* Step Content */}
                    <Layout variant="step-content">
                      <Layout variant="step-container">
                        {/* Instruction Input */}
                        <Textarea
                          value={step.instruction}
                          onChange={(e) =>
                            updateStep(step.id, "instruction", e.target.value)
                          }
                          placeholder="Enter step instructions..."
                          className="min-h-[80px]"
                        />

                        {/* Executor and Actions */}
                        <Layout variant="step-actions">
                          <Layout variant="space-x-3">
                            <Button
                              onClick={() =>
                                updateStep(step.id, "executor", "ai")
                              }
                              variant={
                                step.executor === "ai"
                                  ? "toggle-active"
                                  : "toggle-inactive"
                              }
                              size="xs"
                              className="flex items-center space-x-1.5"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>AI</span>
                            </Button>

                            <Button
                              onClick={() =>
                                updateStep(step.id, "executor", "human")
                              }
                              variant={
                                step.executor === "human"
                                  ? "toggle-human"
                                  : "toggle-inactive"
                              }
                              size="xs"
                              className="flex items-center space-x-1.5"
                            >
                              <User className="w-3 h-3" />
                              <span>Human</span>
                            </Button>
                          </Layout>

                          <Layout variant="space-x-2">
                            {/* Move Step Buttons */}
                            {steps.length > 1 && (
                              <Layout variant="space-x-2">
                                <Button
                                  onClick={() => moveStepUp(index)}
                                  disabled={index === 0}
                                  variant="move"
                                  size="iconxs"
                                  title="Move step up"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => moveStepDown(index)}
                                  disabled={index === steps.length - 1}
                                  variant="move"
                                  size="iconxs"
                                  title="Move step down"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </Layout>
                            )}

                            {/* Delete Button */}
                            {steps.length > 1 && (
                              <Button
                                onClick={() => deleteStep(step.id)}
                                variant="delete"
                                size="xs"
                                className="flex items-center space-x-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </Button>
                            )}
                          </Layout>
                        </Layout>

                        {/* Human Assignment */}
                        {step.executor === "human" && (
                          <Layout variant="step-assignment">
                            <label className="text-body">Assign to:</label>
                            <Select
                              value={step.assignedHuman || "Femi Ibrahim"}
                              onChange={(e) =>
                                updateStep(
                                  step.id,
                                  "assignedHuman",
                                  e.target.value
                                )
                              }
                            >
                              <option value="Femi Ibrahim">Femi Ibrahim</option>
                              <option value="Jason Mao">Jason Mao</option>
                            </Select>
                          </Layout>
                        )}
                      </Layout>
                    </Layout>
                  </Layout>

                  {/* Connector Line */}
                  {index < steps.length - 1 && <StepConnector />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Layout>
    </div>
  );
};

export default Workflow;
