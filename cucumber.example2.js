// ──────────────────────────────────────────────────────────────────────────────
// A starting-point config for running tests via CloudBeat.
//
// ⚠️  Do NOT set 'paths' or 'tags' when running via the CloudBeat agent.
//     Hardcoding them here will interfere with CB execution.
//
//     Only set 'paths' and 'tags' for local runs (non-CB).
// ──────────────────────────────────────────────────────────────────────────────

const example = {
  requireModule: ['ts-node/register'],
  formatOptions: { snippetInterface: 'async-await' },
  worldParameters: { timeout: 60000 },
  require:        ['tests/**/*.ts'],
  format:         ['progress-bar'],
  parallel:       1,
  retry:          0,
  dryRun:         false,
  publishQuiet:   false,
  timeout:        60000,
};

if (process.env.CB_AGENT) {
  // required for CB reporting
  example.format.push('@cloudbeat/cucumber');
} else {
  // add here additional reporters for local runs if needed...
  // ..
  // add here paths and tags if needed
  example.paths = ['tests/features/**/*.feature'];
  example.tags = '@foobar';
}

module.exports = {
  default: example
};