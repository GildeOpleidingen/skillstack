import { beforeEach, describe, expect, it, vi } from "vitest";

// Some env 
const validEnv = {
  AUTH_SECRET: "test-secret",
  AUTH_GITHUB_ID: "github-client-id",
  AUTH_GITHUB_SECRET: "github-client-secret",
};

function setValidEnv() {
  process.env.AUTH_SECRET = validEnv.AUTH_SECRET;
  process.env.AUTH_GITHUB_ID = validEnv.AUTH_GITHUB_ID;
  process.env.AUTH_GITHUB_SECRET = validEnv.AUTH_GITHUB_SECRET;
}

describe("auth configuration", () => {
  beforeEach(() => {
    vi.resetModules();

    delete process.env.AUTH_SECRET;
    delete process.env.AUTH_GITHUB_ID;
    delete process.env.AUTH_GITHUB_SECRET;
  });

  it("loads when all required environment variables exist", async () => {
    setValidEnv();

    const { env, authConfig } = await import("./auth.config");

    expect(env).toEqual(validEnv);
    expect(authConfig.session).toEqual({
      strategy: "jwt",
    });
    expect(authConfig.trustHost).toBe(true);
    expect(authConfig.providers).toHaveLength(1);
  });

  it.each([
    "AUTH_SECRET",
    "AUTH_GITHUB_ID",
    "AUTH_GITHUB_SECRET",
  ])("throws when %s is missing", async (missingKey) => {
    setValidEnv();
    delete process.env[missingKey];

    await expect(import("./auth.config")).rejects.toThrow(
      `Missing required environment variable: ${missingKey}`,
    );
  });

  it.each([
    "AUTH_SECRET",
    "AUTH_GITHUB_ID",
    "AUTH_GITHUB_SECRET",
  ])("throws when %s is empty", async (emptyKey) => {
    setValidEnv();
    process.env[emptyKey] = "   ";

    await expect(import("./auth.config")).rejects.toThrow(
      `Missing required environment variable: ${emptyKey}`,
    );
  });

  it("adds the GitHub profile id to the JWT", async () => {
    setValidEnv();

    const { authConfig } = await import("./auth.config");

    const token = {};

    const result = await authConfig.callbacks!.jwt!({
      token,
      user: undefined,
      account: undefined,
      profile: {
        id: 12345,
      },
      trigger: "signIn",
    });

    expect(result.id).toBe("12345");
  });

  it("copies the JWT id into the session user", async () => {
    setValidEnv();

    const { authConfig } = await import("./auth.config");

    const session = {
      user: {
        name: "Student",
        email: "student@example.com",
        image: null,
      },
      expires: "2099-01-01T00:00:00.000Z",
    };

    const result = await authConfig.callbacks!.session!({
      session,
      token: {
        id: "user-123",
      },
      user: undefined,
      trigger: "update",
      newSession: undefined,
    });

    expect(result.user.id).toBe("user-123");
  });

  it("does not overwrite the session id when the token has no id", async () => {
    setValidEnv();

    const { authConfig } = await import("./auth.config");

    const session = {
      user: {
        name: "Student",
        email: "student@example.com",
        image: null,
      },
      expires: "2099-01-01T00:00:00.000Z",
    };

    const result = await authConfig.callbacks!.session!({
      session,
      token: {},
      user: undefined,
      trigger: "update",
      newSession: undefined,
    });

    expect(result.user.id).toBeUndefined();
  });

  it("allows sign-in when a GitHub profile exists", async () => {
    setValidEnv();

    const { authConfig } = await import("./auth.config");

    const result = await authConfig.callbacks!.signIn!({
      profile: {
        id: "github-123",
      },
      user: {} as never,
      account: null,
    });

    expect(result).toBe(true);
  });

  it("rejects sign-in when the GitHub profile is missing", async () => {
    setValidEnv();

    const { authConfig } = await import("./auth.config");

    const result = await authConfig.callbacks!.signIn!({
      profile: undefined,
      user: {} as never,
      account: null,
    });

    expect(result).toBe(false);
  });
});
