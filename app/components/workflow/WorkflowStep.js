// app/components/workflow/WorkflowStep.js
"use client";

import {
  Plus,
  Sparkles,
  User,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Button,
  Layout,
  StepNumber,
  StepConnector,
  Textarea,
  Select,
} from "@/components/ui";

const WorkflowStep = ({
  step,
  index,
  steps,
  updateStep,
  deleteStep,
  moveStepUp,
  moveStepDown,
}) => (
  <div className="relative">
    <Layout variant="step-layout">
      <StepNumber variant="large">{index + 1}</StepNumber>
      <Layout variant="step-content">
        <Layout variant="step-container">
          <Textarea
            value={step.instruction}
            onChange={(e) =>
              updateStep(step.id, "instruction", e.target.value)
            }
            placeholder="Enter step instructions..."
            className="min-h-[80px]"
          />
          <Layout variant="step-actions">
            <Layout variant="space-x-3">
              <Button
                onClick={() => updateStep(step.id, "executor", "ai")}
                variant={
                  step.executor === "ai" ? "toggle-active" : "toggle-inactive"
                }
                size="xs"
                className="flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI</span>
              </Button>
              <Button
                onClick={() => updateStep(step.id, "executor", "human")}
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
              {steps.length > 1 && (
                <Layout variant="space-x-2">
                  <Button
                    onClick={() => moveStepUp(index)}
                    disabled={index === 0}
                    variant="move"
                    size="icon-xs"
                    title="Move step up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => moveStepDown(index)}
                    disabled={index === steps.length - 1}
                    variant="move"
                    size="icon-xs"
                    title="Move step down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </Layout>
              )}
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
          {step.executor === "human" && (
            <Layout variant="step-assignment">
              <label className="text-body">Assign to:</label>
              <Select
                value={step.assignedHuman || "Femi Ibrahim"}
                onChange={(e) =>
                  updateStep(step.id, "assignedHuman", e.target.value)
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
    {index < steps.length - 1 && <StepConnector />}
  </div>
);

export default WorkflowStep;
