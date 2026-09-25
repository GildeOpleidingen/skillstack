# skillstack

> Comenius 



## Dependencies

Minimum Node.js version > 22

## Setup

> Copy .env_example -> .env

### Used by Auth
AUTH_SECRET=21c8409eb12f7c2e0d74fe8a61b8ec362d5926c40a758ef204...

### GitHub OAuth App credentials
AUTH_GITHUB_ID=Ov23lipfbFJQzLspBO3t
AUTH_GITHUB_SECRET=...

### URL used by Auth.js to construct callbacks
#### Example: http://localhost:3000
AUTH_URL=http://localhost:3000


## TDD  (tests)

- Vitest for unit and integration tests
- React Testing Library for client components
- Playwright for full browser tests


```bash
npx playwright install
```

Run tests with playwright:

```bash
npm run test:e2e
```
