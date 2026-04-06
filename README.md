# CucumberJS & Cloudbeat Example

A CucumberJS + Playwright project for testing the Sauce Demo website, with integrated reporting for Cloudbeat.

## Setup

1. Clone or download this project.
2. Navigate to the project directory: `cd cb-cucumber`
3. Run `npm i` to install dependencies.

## Cloudbeat Reporter Integration

This project comes with the CB reporter already integrated. However, if you would like to integrate the CB reporter into a different project, follow these steps:

Add `@cloudbeat/cucumber` dependency to your project:
```
npm i @cloudbeat/cucumber --save
```

Modify `cucumber.js` to use the CB reporter:
```javascript
const common = [
  '--require-module tsx/cjs',
  '--require support/**/*.ts',
  '--require step_definitions/**/*.ts',
  `--format ${process.env.CB_AGENT ? '@cloudbeat/cucumber' : 'progress'}`,
].join(' ');

module.exports = { default: common };
```

Wrap the Playwright page and expect in your `Before` hook to enable step-level reporting:
```typescript
import { wrapPlaywrightPage, wrapExpect, cb } from '@cloudbeat/cucumber';

Before(async function (this: CbWorld) {
  cb.setWorld(this);
  // ...
  const rawPage = await this.context.newPage();
  this.page = wrapPlaywrightPage(rawPage, this) as Page;
});
```

`CB_AGENT` environment variable is used to determine whether we are running from a CB context or not. It is set to `true` on CB execution agents and should **not** be present on developer's machines.

## Running Tests

- Run all tests: `npm test`
- Run login tests only: `npm run test:login`
- Run products tests only: `npm run test:products`
- Run examples tests only: `npm run test:examples`
- Run a specific feature file: `npx cucumber-js features/login/login.feature`

## CB Helper API

The `cb` object provides utility methods for enriching test results in Cloudbeat. Import it from `@cloudbeat/cucumber` and call `cb.setWorld(this)` in a `Before` hook before using any methods.

| Method | Description |
|---|---|
| `cb.setWorld(this)` | Must be called in `Before` hook to initialise the helper |
| `cb.setFailureReason(FailureReasonEnum.RealDefect)` | Mark a failure with a specific reason |
| `cb.addTestAttribute(name, value)` | Attach a custom attribute to the test result |
| `cb.addOutputData(name, data)` | Attach output data to the test result |
| `cb.onConsole(message)` | Forward browser console logs to Cloudbeat |