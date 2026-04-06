import { Given, Then } from '@cucumber/cucumber';
import { cb } from '@cloudbeat/cucumber';
import { FailureReasonEnum } from '@cloudbeat/types';
import { LoginPage } from '../pages/Login';
import { CbWorld } from '../support/world';

Given('Log {string}', function (_message: string) {
    // data-driven placeholder — the scenario outline name carries the value
});

Then('Try to assert login success and suppress the failure', async function (this: CbWorld) {
    const loginPage = new LoginPage(this.page);
    try {
        await loginPage.assertLoginSuccess();
    } catch {
        console.log('failure suppressed');
    }
});

Then('Try to assert login success and set failure reason on failure', async function (this: CbWorld) {
    const loginPage = new LoginPage(this.page);
    try {
        await loginPage.assertLoginSuccess();
    } catch {
        cb.setFailureReason(FailureReasonEnum.RealDefect);
        throw new Error('test failed');
    }
});

Then('Add test attribute {string} with value {string}', function (_name: string, _value: string) {
    cb.addTestAttribute(_name, _value);
});

Then('Add output data {string} with value {string}', function (_name: string, _value: string) {
    cb.addOutputData(_name, _value);
});

Given('Start intercepting browser console logs', function (this: CbWorld) {
    this.page.on('console', (message) => cb.onConsole(message));
});

Then('Throw an error {string}', function (message: string) {
    throw new Error(message);
});
