// ──────────────────────────────────────────────────────────────────────────────
// A starting-point config for running tests via CloudBeat.
//
// ⚠️  Do NOT set '--paths' or '--tags' when running via the CloudBeat agent.
//     Hardcoding them here will interfere with CB execution.
//
//     Only set 'paths' and 'tags' for local runs (non-CB).
// ──────────────────────────────────────────────────────────────────────────────

const common = [
  '--require-module tsx/cjs',
  '--require support/**/*.ts',
  '--require step_definitions/**/*.ts',
  `--format ${process.env.CB_AGENT ? '@cloudbeat/cucumber' : 'progress'}`,
  '--format html:reports/cucumber-report.html',
  '--parallel 1',
].join(' ');

module.exports = {
  default: common,
};
