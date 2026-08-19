import type { UseQueryResult } from "@tanstack/react-query";
import { QueryAutocomplete, Typography } from "@povio/ui/tanstack";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

type MockProjectStatus = "active" | "archived";

interface MockProjectLabel {
  id: string;
  label: string;
}

interface MockProject {
  id: string;
  name: string;
  status: MockProjectStatus;
  teamId: string;
}

interface MockProjectLabelsInput {
  search?: string;
  status?: MockProjectStatus;
  teamId?: string;
  labelPrefix?: string;
}

const mockProjects: MockProject[] = [
  { id: "project-1", name: "Apollo Inventory", status: "active", teamId: "platform" },
  { id: "project-2", name: "Launch Analytics", status: "active", teamId: "platform" },
  { id: "project-3", name: "Crew Scheduler", status: "active", teamId: "ops" },
  { id: "project-4", name: "Legacy Telemetry", status: "archived", teamId: "platform" },
  { id: "project-5", name: "Payload Catalog", status: "active", teamId: "ops" },
];

function useMockProjectLabels({
  search = "",
  status,
  teamId,
  labelPrefix,
}: MockProjectLabelsInput): UseQueryResult<MockProjectLabel[], Error> {
  const data = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return mockProjects
      .filter((project) => !status || project.status === status)
      .filter((project) => !teamId || project.teamId === teamId)
      .filter((project) => !normalizedSearch || project.name.toLowerCase().includes(normalizedSearch))
      .map((project) => ({
        id: project.id,
        label: labelPrefix ? `${labelPrefix}: ${project.name}` : project.name,
      }));
  }, [labelPrefix, search, status, teamId]);

  return {
    data,
    error: null,
    isError: false,
    isFetching: false,
    isLoading: false,
    isPending: false,
    status: "success",
  } as UseQueryResult<MockProjectLabel[], Error>;
}

function QueryAutocompleteExamplesPage() {
  const [projectId, setProjectId] = useState<string | null>(null);

  return (
    <div className="flex max-w-md flex-col gap-6 p-20">
      <Typography
        as="h1"
        size="title-4"
      >
        QueryAutocomplete
      </Typography>

      <QueryAutocomplete
        label="Project"
        placeholder="Search active platform projects"
        value={projectId}
        onChange={setProjectId}
        query={useMockProjectLabels as never}
        queryParams={
          {
            status: "active",
            teamId: "platform",
            labelPrefix: "Platform",
          } as never
        }
        isClearable
      />

      <Typography
        as="p"
        size="body-2"
      >
        Selected project: {projectId ?? "None"}
      </Typography>
    </div>
  );
}

export const Route = createFileRoute("/(public)/code-examples/query-autocomplete")({
  component: QueryAutocompleteExamplesPage,
});
