import { userRepository } from "~/db/tables/user/user.repository";
import { invalidCredentials } from "~/orpc/helpers/auth-errors";
import type { AuthContextData } from "~/orpc/types";

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

type TokenType = "access" | "refresh";

interface FakeJwtPayload {
  sub: string;
  uid: string;
  typ: TokenType;
  iat: number;
  exp: number;
}

function getBearerToken(request: Request): string | null {
  const value = request.headers.get("authorization");
  if (!value) {
    return null;
  }

  const [scheme, token] = value.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function base64UrlEncode(value: string): string {
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function createToken(userId: string, type: TokenType, ttlSeconds: number): string {
  const iat = nowSeconds();
  const payload: FakeJwtPayload = {
    sub: userId,
    uid: userId,
    typ: type,
    iat,
    exp: iat + ttlSeconds,
  };

  return [
    base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" })),
    base64UrlEncode(JSON.stringify(payload)),
    base64UrlEncode("fake-signature"),
  ].join(".");
}

function decodeToken(token: string): FakeJwtPayload | null {
  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as Partial<FakeJwtPayload>;
    if (
      typeof parsed.sub !== "string" ||
      typeof parsed.uid !== "string" ||
      (parsed.typ !== "access" && parsed.typ !== "refresh") ||
      typeof parsed.iat !== "number" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }

    return parsed as FakeJwtPayload;
  } catch {
    return null;
  }
}

function verifyToken(token: string, type: TokenType): FakeJwtPayload {
  const payload = decodeToken(token);
  if (!payload || payload.typ !== type || payload.exp <= nowSeconds()) {
    invalidCredentials(`Invalid ${type} token`);
  }

  return payload;
}

export function createAuthTokens(userId: string) {
  return {
    accessToken: createToken(userId, "access", ACCESS_TOKEN_TTL_SECONDS),
    refreshToken: createToken(userId, "refresh", REFRESH_TOKEN_TTL_SECONDS),
  };
}

export function verifyRefreshToken(token: string): FakeJwtPayload {
  return verifyToken(token, "refresh");
}

export async function resolveAuthFromRequest(request: Request): Promise<AuthContextData | null> {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }

  const payload = (() => {
    try {
      return verifyToken(token, "access");
    } catch {
      return null;
    }
  })();
  if (!payload) {
    return null;
  }

  const user = await userRepository.findById(payload.uid);
  if (!user) {
    return null;
  }

  return { token, user };
}
