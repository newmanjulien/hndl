// app/components/workflow/WorkflowHeader.js
"use client";

import {
  Card,
  CardHeader,
  CardContent,
  Input,
  Layout,
} from "@/components/ui";

const WorkflowHeader = ({
  workflowTitle,
  setWorkflowTitle,
  isPlaybookWorkflow,
  playbookDescription,
}) => (
  <div className="mb-6">
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
  </div>
);

export default WorkflowHeader;
