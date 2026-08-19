import { Typography } from "@povio/ui";
import { useEffect, useRef, useState } from "react";
import { SwaggerUIBundle, SwaggerUIStandalonePreset, type Spec } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function getRobodevTagDescription(tag: JsonObject) {
  const hidden = tag["x-robodev-hidden"] === true;
  const tables = asStringArray(tag["x-robodev-owned-tables"]);
  const details: string[] = [];

  if (tables.length > 0) {
    details.push(`Owned tables: ${tables.join(", ")}`);
  }

  if (hidden) {
    details.push("Hidden from Robodev");
  }

  if (details.length === 0) {
    return typeof tag.description === "string" ? tag.description : undefined;
  }

  return [typeof tag.description === "string" ? tag.description : "", details.join("; ")].filter(Boolean).join("\n");
}

function createSwaggerDisplaySpec(openapi: unknown): Spec {
  const spec = structuredClone(openapi);

  if (!isObject(spec)) {
    return spec as Spec;
  }

  if (Array.isArray(spec.tags)) {
    spec.tags = spec.tags.map((tag) => {
      if (!isObject(tag)) {
        return tag;
      }

      const description = getRobodevTagDescription(tag);
      const { "x-robodev-hidden": _hidden, "x-robodev-owned-tables": _tables, ...displayTag } = tag;

      return description ? { ...displayTag, description } : displayTag;
    });
  }

  return spec;
}

export function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSwagger() {
      try {
        const response = await fetch("/api-docs/openapi.json");

        if (!response.ok) {
          throw new Error("Failed to load OpenAPI specification");
        }

        const openapi = await response.json();

        if (!isMounted || !containerRef.current) {
          return;
        }

        setError(null);
        containerRef.current.innerHTML = "";
        SwaggerUIBundle({
          spec: createSwaggerDisplaySpec(openapi),
          domNode: containerRef.current,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          showExtensions: true,
        });
      } catch (error) {
        if (isMounted) {
          setError(String(error));
        }
      }
    }

    void loadSwagger();

    return () => {
      isMounted = false;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-elevation-fill-default-1">
      {error ? (
        <div className="flex min-h-[30rem] items-center justify-center bg-elevation-fill-default-2 p-8">
          <Typography
            as="p"
            size="body-2"
            className="text-text-error-1"
          >
            Failed to load API docs: {error}
          </Typography>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className="tiny-api-docs"
      />
    </div>
  );
}
