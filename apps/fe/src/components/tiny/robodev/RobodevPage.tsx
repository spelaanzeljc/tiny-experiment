import {
  Button,
  PasswordInput,
  Segment,
  Select,
  TextInput,
  Toggle,
  Typography,
  useDebounceCallback,
  useFormAutosave,
  useFormValue,
  useToast,
} from "@povio/ui/tanstack";
import { Clipboard, Download, Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";

import {
  AGENTS,
  AI_PROVIDERS,
  GENERATION_STRATEGIES,
  ROBODEV_COMMANDS,
  TEST_STRATEGIES,
  createRobodevCommand,
  createRobodevJson,
  createRobodevYaml,
  type RobodevFormValues,
} from "./robodevSpec";
import {
  RobodevFormSchema,
  mergeRobodevFormValues,
  readStoredRobodevFormValues,
  writeStoredRobodevFormValues,
} from "./robodevForm";
import { RobodevSpecSourceSection } from "./RobodevSpecSourceSection";

const aiProviderOptions = AI_PROVIDERS.map((id) => ({ id, label: id }));
const agentOptions = AGENTS.map((id) => ({ id, label: id }));
const generationStrategyOptions = GENERATION_STRATEGIES.map((id) => ({ id, label: id }));
const testStrategyOptions = TEST_STRATEGIES.map((id) => ({ id, label: id }));
const robodevCommandOptions = ROBODEV_COMMANDS.map((id) => ({ id, label: id }));
type OutputFormat = "json" | "yaml";
interface SpecSource {
  openapi: Record<string, unknown> | null;
  dbml: string;
}

const outputFormatOptions: { id: OutputFormat; label: string }[] = [
  { id: "json", label: "JSON" },
  { id: "yaml", label: "YAML" },
];
const REQUIRED_REPOSITORY_FIELDS = [
  ["baseOwnerName", "Base owner name is required."],
  ["baseRepositoryName", "Base repository name is required."],
  ["baseBranchName", "Base branch is required."],
  ["targetOwnerName", "Target owner name is required."],
  ["targetRepositoryName", "Target repository name is required."],
  ["targetBranchName", "Target branch is required."],
] as const;

async function fetchTextWithFallback(primary: string, fallback: string): Promise<string> {
  const response = await fetch(primary);

  if (response.ok) {
    return response.text();
  }

  const fallbackResponse = await fetch(fallback);

  if (!fallbackResponse.ok) {
    throw new Error(`Failed to load ${primary}`);
  }

  return fallbackResponse.text();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readOpenapiJsonFile(file: File): Promise<Record<string, unknown>> {
  const parsed = JSON.parse(await file.text()) as unknown;

  if (!isRecord(parsed)) {
    throw new Error("OpenAPI file must contain a JSON object.");
  }

  return parsed;
}

function getOutputFormatLabel(format: OutputFormat) {
  return format.toUpperCase();
}

function downloadOutput(content: string, format: OutputFormat) {
  const extension = format === "json" ? "json" : "yml";
  const mimeType = format === "json" ? "application/json;charset=utf-8" : "application/yaml;charset=utf-8";
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `robodev-project-request.${extension}`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function hasRequiredRepositoryValues(values: RobodevFormValues): boolean {
  return Boolean(
    values.baseOwnerName.trim() &&
    values.baseRepositoryName.trim() &&
    values.baseBranchName.trim() &&
    values.targetOwnerName.trim() &&
    values.targetRepositoryName.trim() &&
    values.targetBranchName.trim(),
  );
}

function getMissingRepositoryFields(values: RobodevFormValues) {
  return REQUIRED_REPOSITORY_FIELDS.filter(([field]) => !values[field].trim());
}

function renderYamlScalar(value: string) {
  if (!value) {
    return null;
  }

  if (/^".*"$/.test(value) || /^'.*'$/.test(value)) {
    return <span className="text-text-success-1">{value}</span>;
  }

  if (/^(true|false|null)$/u.test(value)) {
    return <span className="text-text-warning-1">{value}</span>;
  }

  if (/^-?\d+(\.\d+)?$/u.test(value)) {
    return <span className="text-interactive-text-primary-idle">{value}</span>;
  }

  if (value === "|" || value === ">" || value === "[]" || value === "{}") {
    return <span className="text-text-default-3">{value}</span>;
  }

  return <span className="text-text-default-1">{value}</span>;
}

function getIndentLength(line: string): number {
  return /^\s*/u.exec(line)?.[0].length ?? 0;
}

function renderPlainYamlLine(line: string) {
  return (
    <>
      <span className="text-text-default-1">{line}</span>
      {"\n"}
    </>
  );
}

function renderYamlLine(line: string) {
  if (!line) {
    return "\n";
  }

  if (line.trimStart().startsWith("#")) {
    return (
      <>
        <span className="text-text-default-3">{line}</span>
        {"\n"}
      </>
    );
  }

  const keyMatch = /^(\s*)(-\s+)?([^:#]+):(\s*)(.*)$/u.exec(line);

  if (keyMatch) {
    const [, indent, listMarker = "", key, gap, value] = keyMatch;

    return (
      <>
        {indent}
        {listMarker ? <span className="text-text-default-3">{listMarker}</span> : null}
        <span className="font-semibold text-interactive-text-primary-idle">{key}</span>
        <span className="text-text-default-3">:</span>
        {gap}
        {renderYamlScalar(value)}
        {"\n"}
      </>
    );
  }

  const listMatch = /^(\s*)-\s+(.*)$/u.exec(line);

  if (listMatch) {
    const [, indent, value] = listMatch;

    return (
      <>
        {indent}
        <span className="text-text-default-3">- </span>
        {renderYamlScalar(value)}
        {"\n"}
      </>
    );
  }

  return renderPlainYamlLine(line);
}

function getYamlPreviewLines(yaml: string) {
  const lines = yaml.split("\n");
  let blockScalarIndent: number | null = null;

  return lines.map((line, index) => {
    const indentLength = getIndentLength(line);
    const isBlank = line.trim() === "";
    const isBlockScalarContent = blockScalarIndent !== null && (isBlank || indentLength >= blockScalarIndent);
    const highlighted = isBlockScalarContent ? renderPlainYamlLine(line) : renderYamlLine(line);

    if (!isBlockScalarContent && /:\s*[|>]\s*$/u.test(line)) {
      blockScalarIndent = indentLength + 2;
    } else if (blockScalarIndent !== null && !isBlockScalarContent) {
      blockScalarIndent = null;
    }

    return {
      id: `${line}-${yaml.slice(0, index).length}-${line.length}`,
      highlighted,
    };
  });
}

function renderJsonToken(token: string, index: number) {
  if (token.startsWith('"')) {
    return (
      <span
        key={`${index}-${token}`}
        className="text-text-success-1"
      >
        {token}
      </span>
    );
  }

  if (/^(true|false|null)$/u.test(token)) {
    return (
      <span
        key={`${index}-${token}`}
        className="text-text-warning-1"
      >
        {token}
      </span>
    );
  }

  if (/^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/iu.test(token)) {
    return (
      <span
        key={`${index}-${token}`}
        className="text-interactive-text-primary-idle"
      >
        {token}
      </span>
    );
  }

  return token;
}

function renderJsonLine(line: string) {
  if (!line) {
    return "\n";
  }

  const keyMatch = /^(\s*)("[^"\\]*(?:\\.[^"\\]*)*")(:)(.*)$/u.exec(line);

  if (keyMatch) {
    const [, indent, key, colon, rest] = keyMatch;

    return (
      <>
        {indent}
        <span className="font-semibold text-interactive-text-primary-idle">{key}</span>
        <span className="text-text-default-3">{colon}</span>
        {rest.split(/("(?:[^"\\]|\\.)*"|true|false|null|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/giu).map(renderJsonToken)}
        {"\n"}
      </>
    );
  }

  return (
    <>
      {line.split(/("(?:[^"\\]|\\.)*"|true|false|null|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/giu).map(renderJsonToken)}
      {"\n"}
    </>
  );
}

function getJsonPreviewLines(json: string) {
  return json.split("\n").map((line, index) => ({
    id: `${line}-${json.slice(0, index).length}-${line.length}`,
    highlighted: renderJsonLine(line),
  }));
}

export function RobodevPage() {
  const { successToast, errorToast } = useToast();
  const [savedValues, setSavedValues] = useState(readStoredRobodevFormValues);
  const [isGenerating, setIsGenerating] = useState(false);
  const [openapi, setOpenapi] = useState<Record<string, unknown> | null>(null);
  const [dbml, setDbml] = useState("");
  const [defaultSpecSource, setDefaultSpecSource] = useState<SpecSource>({ openapi: null, dbml: "" });
  const [openapiSourceName, setOpenapiSourceName] = useState("Bundled OpenAPI");
  const [dbmlSourceName, setDbmlSourceName] = useState("Bundled DBML");
  const [isSpecLoading, setIsSpecLoading] = useState(true);
  const [specError, setSpecError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("json");
  const [output, setOutput] = useState("");
  const [outputError, setOutputError] = useState<string | null>(null);
  const form = useFormAutosave({
    zodSchema: RobodevFormSchema,
    getResetValues: () => savedValues,
    resetDeps: [savedValues],
    autosaveDelay: 500,
    onAutosave: async (changedValues) => {
      const nextValues = mergeRobodevFormValues({ ...savedValues, ...changedValues });

      writeStoredRobodevFormValues(nextValues);
      setSavedValues(nextValues);
    },
  });
  const watchedValues = useFormValue(form, (values) => values);
  const requestValues = useMemo(() => mergeRobodevFormValues(watchedValues), [watchedValues]);
  const requestConfigKey = useMemo(
    () => JSON.stringify({ dbml, openapi, values: requestValues }),
    [dbml, openapi, requestValues],
  );
  const executionId = useMemo(() => crypto.randomUUID(), [requestConfigKey]);

  const generateOutput = useCallback(
    (values: RobodevFormValues, requestExecutionId: string) => {
      if (!openapi || !dbml) {
        setOutput("");
        return;
      }

      try {
        setOutput(
          outputFormat === "json"
            ? createRobodevJson(values, openapi, dbml, requestExecutionId)
            : createRobodevYaml(values, openapi, dbml, requestExecutionId),
        );
        setOutputError(null);
      } catch (error) {
        console.error(`[robodev] Failed to generate ${outputFormat} preview:`, error);
        setOutput("");
        setOutputError(`Generating ${getOutputFormatLabel(outputFormat)} preview failed.`);
      }
    },
    [dbml, openapi, outputFormat],
  );
  const { callback: generateOutputDebounced, isDebouncing } = useDebounceCallback(generateOutput, { delay: 400 });

  useEffect(() => {
    let isMounted = true;

    async function loadSpecSources() {
      setIsSpecLoading(true);
      setSpecError(null);
      try {
        const [openapiResponse, nextDbml] = await Promise.all([
          fetch("/api-docs/openapi.json"),
          fetchTextWithFallback("/api-docs/dbml", "/api-docs/dbml.txt"),
        ]);

        if (!openapiResponse.ok) {
          throw new Error("Failed to load OpenAPI specification");
        }

        const nextOpenapi = (await openapiResponse.json()) as Record<string, unknown>;

        if (!isMounted) {
          return;
        }

        setOpenapi(nextOpenapi);
        setDbml(nextDbml);
        setDefaultSpecSource({ openapi: nextOpenapi, dbml: nextDbml });
        setOpenapiSourceName("Bundled OpenAPI");
        setDbmlSourceName("Bundled DBML");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("[robodev] Failed to load specification sources:", error);
        setSpecError("OpenAPI or DBML could not be loaded. The form is still editable.");
      } finally {
        if (isMounted) {
          setIsSpecLoading(false);
        }
      }
    }

    void loadSpecSources();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    generateOutput(mergeRobodevFormValues(form.state.values), executionId);
  }, [dbml, executionId, form, generateOutput, openapi]);

  useEffect(() => {
    generateOutputDebounced(requestValues, executionId);
  }, [executionId, generateOutputDebounced, requestValues]);

  useEffect(() => {
    const nextValues = mergeRobodevFormValues(watchedValues);
    const fieldsToClear: (keyof RobodevFormValues)[] = REQUIRED_REPOSITORY_FIELDS.filter(([field]) =>
      nextValues[field].trim(),
    ).map(([field]) => field);

    if (nextValues.robodevToken.trim()) {
      fieldsToClear.push("robodevToken");
    }

    if (fieldsToClear.length > 0) {
      for (const field of fieldsToClear) {
        form.setFieldMeta(field, (meta) => ({
          ...meta,
          errorMap: { ...meta.errorMap, onSubmit: undefined },
        }));
      }
    }
  }, [form, watchedValues]);

  const onSubmit = async (values: RobodevFormValues) => {
    setIsGenerating(true);
    try {
      const missingFields = getMissingRepositoryFields(values);

      if (missingFields.length > 0) {
        for (const [field, message] of missingFields) {
          form.setFieldMeta(field, (meta) => ({
            ...meta,
            errorMap: { ...meta.errorMap, onSubmit: message },
          }));
        }

        throw new Error("Missing required repository values");
      }

      if (!output) {
        throw new Error(`${getOutputFormatLabel(outputFormat)} is not ready`);
      }

      downloadOutput(output, outputFormat);
      successToast({ text: `Robodev ${getOutputFormatLabel(outputFormat)} downloaded` });
    } catch (error) {
      console.error("[robodev] Failed to download specification:", error);
      errorToast({
        text: hasRequiredRepositoryValues(values)
          ? `Generating Robodev ${getOutputFormatLabel(outputFormat)} failed`
          : "Fill in the required repository fields.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyOutput = async () => {
    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      successToast({ text: `${getOutputFormatLabel(outputFormat)} copied to clipboard` });
    } catch (error) {
      console.error(`[robodev] Failed to copy ${outputFormat}:`, error);
      errorToast({ text: `Copying ${getOutputFormatLabel(outputFormat)} failed` });
    }
  };

  const copyRobodevCommand = async (values: RobodevFormValues) => {
    try {
      const missingFields = getMissingRepositoryFields(values);

      if (missingFields.length > 0) {
        for (const [field, message] of missingFields) {
          form.setFieldMeta(field, (meta) => ({
            ...meta,
            errorMap: { ...meta.errorMap, onSubmit: message },
          }));
        }

        throw new Error("Missing required repository values");
      }

      if (!values.robodevToken.trim()) {
        form.setFieldMeta("robodevToken", (meta) => ({
          ...meta,
          errorMap: { ...meta.errorMap, onSubmit: "RoboDev token is required." },
        }));
        throw new Error("Missing RoboDev token");
      }

      if (!openapi || !dbml) {
        throw new Error("Specification sources are not ready");
      }

      await navigator.clipboard.writeText(
        createRobodevCommand(
          createRobodevJson(values, openapi, dbml, executionId),
          values.robodevToken,
          values.robodevCommand,
        ),
      );
      successToast({ text: `${values.robodevCommand} command copied to clipboard` });
    } catch (error) {
      let toastText = "Copying RoboDev command failed";

      if (!values.robodevToken.trim()) {
        toastText = "RoboDev token is required.";
      } else if (!hasRequiredRepositoryValues(values)) {
        toastText = "Fill in the required repository fields.";
      }

      console.error("[robodev] Failed to copy RoboDev command:", error);
      errorToast({ text: toastText });
    }
  };

  const uploadOpenapi = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const nextOpenapi = await readOpenapiJsonFile(file);

      setOpenapi(nextOpenapi);
      setOpenapiSourceName(file.name);
      setSpecError(null);
      successToast({ text: "OpenAPI source uploaded" });
    } catch (error) {
      console.error("[robodev] Failed to upload OpenAPI source:", error);
      errorToast({ text: "OpenAPI upload failed. Use a JSON OpenAPI file." });
    } finally {
      event.target.value = "";
    }
  };

  const uploadDbml = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setDbml(await file.text());
      setDbmlSourceName(file.name);
      setSpecError(null);
      successToast({ text: "DBML source uploaded" });
    } catch (error) {
      console.error("[robodev] Failed to upload DBML source:", error);
      errorToast({ text: "DBML upload failed" });
    } finally {
      event.target.value = "";
    }
  };

  const resetSpecSources = () => {
    setOpenapi(defaultSpecSource.openapi);
    setDbml(defaultSpecSource.dbml);
    setOpenapiSourceName("Bundled OpenAPI");
    setDbmlSourceName("Bundled DBML");
    setSpecError(
      defaultSpecSource.openapi && defaultSpecSource.dbml ? null : "Bundled specification sources are not ready.",
    );
  };

  const outputFormatLabel = getOutputFormatLabel(outputFormat);
  const previewLines = outputFormat === "json" ? getJsonPreviewLines(output) : getYamlPreviewLines(output);

  return (
    <div className="min-h-screen bg-elevation-fill-default-2 p-4 md:p-6">
      <div className="mx-auto flex max-w-[104rem] flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-1 text-text-default-2">
              <Settings size={20} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <Typography
                as="h1"
                size="title-4"
                variant="prominent-1"
                className="text-text-default-1"
              >
                Robodev specification
              </Typography>
              <Typography
                size="body-3"
                className="text-text-default-2"
              >
                Generate a ProjectRequest YAML from the current OpenAPI and DBML output.
              </Typography>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(32rem,44rem)] xl:items-start">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-w-0 flex-col gap-6"
          >
            <RobodevSpecSourceSection
              openapiSourceName={openapiSourceName}
              dbmlSourceName={dbmlSourceName}
              isSpecLoading={isSpecLoading}
              canResetSpecSources={Boolean(defaultSpecSource.openapi || defaultSpecSource.dbml)}
              onOpenapiUpload={(event) => void uploadOpenapi(event)}
              onDbmlUpload={(event) => void uploadDbml(event)}
              onResetSpecSources={resetSpecSources}
            />

            <section className="grid gap-5 rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-1 p-4 md:p-5">
              <Typography
                as="h2"
                size="title-5"
                variant="prominent-1"
              >
                Repository
              </Typography>

              <div>
                <div className="grid gap-4 md:grid-cols-3">
                  <TextInput
                    field={{ form, name: "baseOwnerName" }}
                    label="Base owner name"
                    placeholder="povioai"
                    isRequired
                  />
                  <TextInput
                    field={{ form, name: "baseRepositoryName" }}
                    label="Base repository name"
                    placeholder="orion-template"
                    isRequired
                  />
                  <TextInput
                    field={{ form, name: "baseBranchName" }}
                    label="Base branch"
                    placeholder="develop"
                    isRequired
                  />
                </div>
              </div>

              <div className="border-t border-elevation-outline-default-1 pt-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <TextInput
                    field={{ form, name: "targetOwnerName" }}
                    label="Target owner name"
                    placeholder="povio"
                    isRequired
                  />
                  <TextInput
                    field={{ form, name: "targetRepositoryName" }}
                    label="Target repository name"
                    placeholder="backend-service"
                    isRequired
                  />
                  <TextInput
                    field={{ form, name: "targetBranchName" }}
                    label="Target branch"
                    placeholder="feature/backend-generation"
                    isRequired
                  />
                </div>
              </div>

              <div className="border-t border-elevation-outline-default-1 pt-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput
                    field={{ form, name: "directory" }}
                    label="Directory"
                    placeholder="apps/be"
                  />
                  <TextInput
                    field={{ form, name: "commitMessage" }}
                    label="Commit message"
                    placeholder="Generated backend specification"
                  />
                </div>
              </div>
            </section>

            <section className="grid gap-4 rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-1 p-4 md:grid-cols-2 md:p-5">
              <Typography
                as="h2"
                size="title-5"
                variant="prominent-1"
                className="md:col-span-2"
              >
                Generation
              </Typography>
              <Select
                field={{ form, name: "aiProvider" }}
                label="AI provider"
                placeholder="Select option"
                items={aiProviderOptions}
                isRequired
              />
              <Select
                field={{ form, name: "agent" }}
                label="Agent"
                placeholder="Select option"
                items={agentOptions}
                isRequired
              />
              <Select
                field={{ form, name: "generationStrategy" }}
                label="Generation strategy"
                placeholder="Select option"
                items={generationStrategyOptions}
                isRequired
              />
              <Select
                field={{ form, name: "testStrategy" }}
                label="Test strategy"
                placeholder="Select option"
                items={testStrategyOptions}
                isRequired
              />
              <TextInput
                field={{ form, name: "appName" }}
                label="App name"
                placeholder="backend-service"
              />
              <div className="grid content-end gap-3">
                <Toggle field={{ form, name: "generateCode" }}>Generate code</Toggle>
                <Toggle field={{ form, name: "generateAdmin" }}>Generate admin</Toggle>
                <Toggle field={{ form, name: "runTests" }}>Run tests</Toggle>
                <Toggle field={{ form, name: "deploy" }}>Deploy after generation</Toggle>
              </div>
            </section>

            <section className="grid gap-4 rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-1 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:p-5">
              <Typography
                as="h2"
                size="title-5"
                variant="prominent-1"
                className="md:col-span-2"
              >
                RoboDev command
              </Typography>
              <PasswordInput
                field={{ form, name: "robodevToken" }}
                label="Token"
                placeholder="Paste plain token"
              />
              <div className="grid content-end gap-2">
                <Typography
                  as="span"
                  size="body-3"
                  className="text-text-default-2"
                >
                  Command
                </Typography>
                <Segment
                  field={{ form, name: "robodevCommand" }}
                  items={robodevCommandOptions}
                  className="w-fit!"
                />
              </div>
            </section>
          </form>

          <aside className="min-w-0 rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-1 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-elevation-outline-default-1 p-4">
              <div className="flex flex-col gap-1">
                <Typography
                  as="h2"
                  size="title-5"
                  variant="prominent-1"
                >
                  Generated {outputFormatLabel}
                </Typography>
                <Typography
                  size="body-3"
                  className="text-text-default-2"
                >
                  {isDebouncing ? "Updating preview..." : "Live preview"}
                </Typography>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Segment
                  value={outputFormat}
                  onChange={(value: any) => setOutputFormat((value ?? "json") as OutputFormat)}
                  items={outputFormatOptions}
                  className="w-fit!"
                />
                <Button
                  type="button"
                  size="s"
                  width="hug"
                  variant="outlined"
                  color="secondary"
                  icon={Clipboard}
                  isDisabled={!output || Boolean(specError) || Boolean(outputError)}
                  onPress={() => void copyOutput()}
                >
                  Copy
                </Button>
                <Button
                  type="button"
                  size="s"
                  width="hug"
                  icon={Download}
                  isDisabled={isGenerating || !output || Boolean(specError) || Boolean(outputError)}
                  isLoading={isGenerating}
                  onPress={() => void form.handleSubmit(onSubmit)()}
                >
                  Download
                </Button>
                <Button
                  type="button"
                  size="s"
                  width="hug"
                  icon={Clipboard}
                  isDisabled={!openapi || !dbml || Boolean(specError)}
                  onPress={() => void form.handleSubmit(copyRobodevCommand)()}
                >
                  Copy command
                </Button>
              </div>
            </div>
            <div className="min-h-72 p-4">
              {isSpecLoading ? (
                <Typography
                  size="body-3"
                  className="text-text-default-2"
                >
                  Loading OpenAPI and DBML...
                </Typography>
              ) : null}
              {!isSpecLoading && specError ? (
                <Typography
                  size="body-3"
                  className="text-text-error-1"
                >
                  {specError}
                </Typography>
              ) : null}
              {!isSpecLoading && outputError ? (
                <Typography
                  size="body-3"
                  className="text-text-error-1"
                >
                  {outputError}
                </Typography>
              ) : null}
              {!isSpecLoading && !specError && !outputError && output ? (
                <pre className="max-h-[min(50rem,calc(100vh-13rem))] overflow-auto rounded-sm bg-elevation-fill-default-2 p-3 text-xs leading-5 text-text-default-1">
                  <code>
                    {previewLines.map(({ id, highlighted }) => (
                      <span key={id}>{highlighted}</span>
                    ))}
                  </code>
                </pre>
              ) : null}
              {!isSpecLoading && !specError && !outputError && !output ? (
                <Typography
                  size="body-3"
                  className="text-text-default-2"
                >
                  {outputFormatLabel} will appear here once the source specification is ready.
                </Typography>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
