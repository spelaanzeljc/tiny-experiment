import { Button, Typography } from "@povio/ui";
import { FileJson, RotateCcw, Upload } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

interface RobodevSpecSourceSectionProps {
  openapiSourceName: string;
  dbmlSourceName: string;
  isSpecLoading: boolean;
  canResetSpecSources: boolean;
  onOpenapiUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onDbmlUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onResetSpecSources: () => void;
}

export function RobodevSpecSourceSection({
  openapiSourceName,
  dbmlSourceName,
  isSpecLoading,
  canResetSpecSources,
  onOpenapiUpload,
  onDbmlUpload,
  onResetSpecSources,
}: RobodevSpecSourceSectionProps) {
  const openapiInputRef = useRef<HTMLInputElement>(null);
  const dbmlInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="grid gap-4 rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-1 p-4 md:p-5">
      <div className="flex flex-col gap-1">
        <Typography
          as="h2"
          size="title-5"
          variant="prominent-1"
        >
          Specification source
        </Typography>
        <Typography
          size="body-3"
          className="text-text-default-2"
        >
          Upload an OpenAPI JSON file and optionally replace the DBML used in the generated Robodev spec.
        </Typography>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2 rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-2 p-3">
          <div className="flex items-center gap-2 text-text-default-1">
            <FileJson size={18} />
            <Typography
              as="h3"
              size="body-2"
              variant="prominent-1"
            >
              OpenAPI
            </Typography>
          </div>
          <Typography
            size="body-3"
            className="truncate text-text-default-2"
          >
            {openapiSourceName}
          </Typography>
          <input
            ref={openapiInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onOpenapiUpload}
          />
          <Button
            type="button"
            size="s"
            width="hug"
            variant="outlined"
            color="secondary"
            icon={Upload}
            onPress={() => openapiInputRef.current?.click()}
          >
            Upload JSON
          </Button>
        </div>

        <div className="flex min-w-0 flex-col gap-2 rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-2 p-3">
          <div className="flex items-center gap-2 text-text-default-1">
            <FileJson size={18} />
            <Typography
              as="h3"
              size="body-2"
              variant="prominent-1"
            >
              DBML
            </Typography>
          </div>
          <Typography
            size="body-3"
            className="truncate text-text-default-2"
          >
            {dbmlSourceName}
          </Typography>
          <input
            ref={dbmlInputRef}
            type="file"
            accept=".dbml,.txt,text/plain"
            className="hidden"
            onChange={onDbmlUpload}
          />
          <Button
            type="button"
            size="s"
            width="hug"
            variant="outlined"
            color="secondary"
            icon={Upload}
            onPress={() => dbmlInputRef.current?.click()}
          >
            Upload DBML
          </Button>
        </div>
      </div>

      <Button
        type="button"
        size="s"
        width="hug"
        variant="outlined"
        color="secondary"
        icon={RotateCcw}
        isDisabled={isSpecLoading || !canResetSpecSources}
        onPress={onResetSpecSources}
      >
        Use bundled sources
      </Button>
    </section>
  );
}
