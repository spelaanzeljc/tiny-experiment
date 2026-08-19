import z from "zod";

import {
  AGENTS,
  AI_PROVIDERS,
  GENERATION_STRATEGIES,
  ROBODEV_COMMANDS,
  TEST_STRATEGIES,
  type RobodevFormValues,
} from "./robodevSpec";

export const ROBODEV_FORM_STORAGE_KEY = "tiny-template-robodev-form-values-v3";

export const RobodevFormSchema = z.object({
  baseOwnerName: z.string(),
  baseRepositoryName: z.string(),
  baseBranchName: z.string(),
  targetOwnerName: z.string(),
  targetRepositoryName: z.string(),
  targetBranchName: z.string(),
  directory: z.string(),
  appName: z.string(),
  commitMessage: z.string(),
  aiProvider: z.enum(AI_PROVIDERS),
  agent: z.enum(AGENTS),
  generationStrategy: z.enum(GENERATION_STRATEGIES),
  testStrategy: z.enum(TEST_STRATEGIES),
  robodevToken: z.string(),
  robodevCommand: z.enum(ROBODEV_COMMANDS),
  runTests: z.boolean(),
  deploy: z.boolean(),
  generateCode: z.boolean(),
  generateAdmin: z.boolean(),
});

export const DEFAULT_VALUES: RobodevFormValues = {
  baseOwnerName: "povioai",
  baseRepositoryName: "orion-template",
  baseBranchName: "develop",
  targetOwnerName: "",
  targetRepositoryName: "",
  targetBranchName: "",
  directory: "apps/be",
  appName: "",
  commitMessage: "",
  aiProvider: "OpenAI",
  agent: "Codex",
  generationStrategy: "Class",
  testStrategy: "HAPPY_PATH",
  robodevToken: "",
  robodevCommand: "curl",
  runTests: true,
  deploy: false,
  generateCode: true,
  generateAdmin: false,
};

type FormKey = keyof RobodevFormValues;
type StoredRobodevFormValues = Omit<RobodevFormValues, "robodevToken">;

const formSchemaShape = RobodevFormSchema.shape;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mergeRobodevFormValues(values: unknown): RobodevFormValues {
  if (!isRecord(values)) {
    return DEFAULT_VALUES;
  }

  const result = { ...DEFAULT_VALUES };

  for (const key of Object.keys(DEFAULT_VALUES) as FormKey[]) {
    const parsed = formSchemaShape[key].safeParse(values[key]);

    Object.assign(result, { [key]: parsed.success ? parsed.data : DEFAULT_VALUES[key] });
  }

  return result;
}

export function readStoredRobodevFormValues(): RobodevFormValues {
  if (typeof window === "undefined") {
    return DEFAULT_VALUES;
  }

  try {
    const stored = window.localStorage.getItem(ROBODEV_FORM_STORAGE_KEY);

    if (!stored) {
      return DEFAULT_VALUES;
    }

    return {
      ...mergeRobodevFormValues(JSON.parse(stored)),
      robodevToken: DEFAULT_VALUES.robodevToken,
    };
  } catch {
    return DEFAULT_VALUES;
  }
}

export function getStoredRobodevFormValues(values: RobodevFormValues): StoredRobodevFormValues {
  const { robodevToken: _robodevToken, ...storedValues } = mergeRobodevFormValues(values);

  return storedValues;
}

export function writeStoredRobodevFormValues(values: RobodevFormValues) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ROBODEV_FORM_STORAGE_KEY, JSON.stringify(getStoredRobodevFormValues(values)));
}
