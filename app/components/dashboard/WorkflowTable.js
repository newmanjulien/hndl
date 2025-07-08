// app/components/dashboard/WorkflowTable.js
"use client";

import { Trash2, Play, Pause } from "lucide-react";
import {
  Button,
  Badge,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  Layout,
} from "@/components/ui";

const WorkflowTable = ({
  workflows,
  onToggleStatus,
  onEdit,
  onDelete,
  updatingStatus,
  isDeleting,
  isPlaybookWorkflow = false,
  playbookSectionId = null,
  activeSection,
}) => {
  const getStepsSummary = (steps) => {
    if (!steps || steps.length === 0) return "No steps";
    const aiSteps = steps.filter((step) => step.executor === "ai").length;
    const humanSteps = steps.filter((step) => step.executor === "human").length;
    const parts = [];
    if (aiSteps > 0) parts.push(`${aiSteps} AI`);
    if (humanSteps > 0) parts.push(`${humanSteps} Human`);
    return parts.join(", ");
  };

  const renderWorkflowRow = (workflow) => (
    <TableRow
      key={workflow.id}
      variant={isPlaybookWorkflow ? "playbook" : "workflow"}
    >
      <TableCell variant="workflow">
        <Layout variant="space-x-3">
          <Badge
            variant="dot"
            color={workflow.isRunning ? "active" : "inactive"}
            className="flex-shrink-0"
          />
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
          <Button
            onClick={() => onToggleStatus(workflow.id, workflow.isRunning)}
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

          <Button
            onClick={() => onEdit(workflow.id, activeSection, playbookSectionId)}
            variant="edit"
            size="sm"
          >
            Edit
          </Button>

          {!isPlaybookWorkflow && (
            <Button
              onClick={() => onDelete(workflow.id, workflow.title)}
              disabled={isDeleting === workflow.id}
              variant="delete"
              size="sm"
            >
              <Trash2 className="w-3 h-3" />
              <span>{isDeleting === workflow.id ? "Deleting..." : "Delete"}</span>
            </Button>
          )}
        </Layout>
      </TableCell>
    </TableRow>
  );

  return (
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
          {workflows.map((workflow) => renderWorkflowRow(workflow))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorkflowTable;
