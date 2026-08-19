import { ORPCError } from "@orpc/server";

export function notFound(message: string): never {
  throw new ORPCError("NOT_FOUND", { message });
}

export function forbidden(message: string): never {
  throw new ORPCError("FORBIDDEN", { message });
}

export function badRequest(message: string): never {
  throw new ORPCError("BAD_REQUEST", { message });
}
