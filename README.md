# remix-webcrypto-cookie-session

This library was created as a drop-in replacement for Remix's built-in 
`createCookieSessionStorage` method, but with support for encrypting sessions
using the `simple-secure-webcrypto` encryption library.

## Features

✅ Only 1 package dependency outside of Remix.

✅ Uses Web Crypto APIs = Works on browser platforms like Cloudflare Workers.

✅ Secure defaults; uses AES-GCM (authenticated encryption) with a 256 bit key.

✅ Written in TypeScript.

## Usage

Install via your package manager:

```
bun install remix-webcrypto-cookie-session
```

Then import `createWebCryptoCookieSessionStorage` in place of `createCookieSessionStorage` in your code.

Please refer to the official documentation for more information:

<https://remix.run/docs/en/main/utils/sessions>

## How does it work?

Remix signs and verifies cookies. Instead, we use the encrypt/decrypt methods
from the [simple-secure-webcrypto](https://www.npmjs.com/package/simple-secure-webcrypto)
package.

## License

MIT

## Credit

Thank you to [Nadrama.com](https://nadrama.com) for sponsoring this work! Nadrama enables you to run a Kubernetes PaaS in your cloud account, in minutes.

## Development

We're using TypeScript, Bun, Bun test, Prettier, and ESLint.

To install dev dependencies:

```bash
bun install
```

To run prettier and eslint:

```bash
bun run pretty
bun run lint
```

To build:

```
bun run build
```

## Security

Please reach out to [Nadrama](https://nadrama.com) or [@ryan0x44](https://ryan0x44.com) if you have any security related questions or concerns.
