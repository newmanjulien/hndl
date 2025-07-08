// app/components/shared/EmptyState.js
"use client";

import { BookOpen, Workflow } from "lucide-react";
import {
  EmptyState as EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "@/components/ui";

const EmptyState = ({ sectionName }) => (
  <EmptyStateContainer>
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
  </EmptyStateContainer>
);

export default EmptyState;
