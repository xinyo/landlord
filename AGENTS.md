## Engineering Principles

- After setup TODO/plan, always ask confirmation before execute plan.
- Branch names and PR titles must always follow semantic conventions.
- Always run `npm test` after modifying JavaScript/Typescript files.
- Prefer `pnpm` when installing dependencies.
- Ask for confirmation before adding new production dependencies.
- All functional changes should be covered by unit tests.
- React Component Test files should be placed alongside the component they test with `.test.tsx` extension.
- Use `vitest` for the testing framework with `@testing-library/react` for component testing.
- Mock external dependencies like `uuid` in tests.
