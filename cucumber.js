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
