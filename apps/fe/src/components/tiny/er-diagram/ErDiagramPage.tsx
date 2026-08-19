import { Typography } from "@povio/ui";
import { ReactFlowProvider } from "@xyflow/react";
import { Database } from "lucide-react";

import { ErDiagramCanvas } from "./ErDiagramCanvas";

export function ErDiagramPage() {
  return (
    <ReactFlowProvider>
      <div className="flex min-h-screen flex-col gap-5 bg-elevation-fill-default-2 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-1 text-text-default-2">
              <Database size={20} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <Typography
                as="h1"
                size="title-4"
                variant="prominent-1"
                className="text-text-default-1"
              >
                Entity relationship diagram
              </Typography>
            </div>
          </div>
        </div>

        <ErDiagramCanvas />
      </div>
    </ReactFlowProvider>
  );
}
