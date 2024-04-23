// This code was adapted from
// https://github.com/remix-run/remix/blob/0a3ddcd645db33a8b39ced509ee8d9e56eed64c5/packages/remix-server-runtime/sessions/cookieStorage.ts

import {
  isCookie,
  createCookieFactory,
} from "@remix-run/server-runtime/dist/cookies.js";
import type {
  SessionStorage,
  SessionIdStorageStrategy,
  SessionData,
} from "@remix-run/server-runtime/dist/sessions.js";
import { createSession } from "@remix-run/server-runtime/dist/sessions.js";
import { encrypt, decrypt } from "simple-secure-webcrypto";

interface CookieSessionStorageOptions {
  /**
   * The Cookie used to store the session data on the client, or options used
   * to automatically create one.
   */
  cookie?: SessionIdStorageStrategy["cookie"];
}

export type CreateCookieSessionStorage = <Data = SessionData, FlashData = Data>(
  options?: CookieSessionStorageOptions,
) => SessionStorage<Data, FlashData>;

// sign is a drop-in replacement for the standard sign method,
// which instead of signing actually encrypts data
// we only need this because the encrypt method params are in the wrong order
const sign = (value: string, secret: string) => {
  return encrypt(secret, value);
};

// unsign is a drop-in replacement for the standard unsign method,
// which instead of verifying actually decrypts data
// we only need this because the decrypt method params are in the wrong order
const unsign = (value: string, secret: string) => {
  return decrypt(secret, value);
};

// we use the createCookieFactory to inject our sign/unsign methods
const createCookie = createCookieFactory({ sign, unsign });

/**
 * Creates and returns a SessionStorage object that stores all session data
 * encrypted in the session cookie itself.
 *
 * This has the advantage that no database or other backend services are
 * needed, and can help to simplify some load-balanced scenarios. However, it
 * also has the limitation that serialized session data may not exceed the
 * browser's maximum cookie size. Trade-offs!
 *
 * @see https://remix.run/utils/sessions#createcookiesessionstorage
 */
export const createWebCryptoCookieSessionStorage: CreateCookieSessionStorage =
  ({ cookie: cookieArg } = {}) => {
    const cookie = isCookie(cookieArg)
      ? cookieArg
      : createCookie(cookieArg?.name || "__session", cookieArg);

    return {
      async getSession(cookieHeader, options) {
        return createSession(
          (cookieHeader && (await cookie.parse(cookieHeader, options))) || {},
        );
      },
      async commitSession(session, options) {
        const serializedCookie = await cookie.serialize(session.data, options);
        if (serializedCookie.length > 4096) {
          throw new Error(
            "Cookie length will exceed browser maximum. Length: " +
              serializedCookie.length,
          );
        }
        return serializedCookie;
      },
      async destroySession(_session, options) {
        return cookie.serialize("", {
          ...options,
          maxAge: undefined,
          expires: new Date(0),
        });
      },
    };
  };
