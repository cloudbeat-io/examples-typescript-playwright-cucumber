import { Given, When, Then } from '@cucumber/cucumber';
import { expect as pwExpect } from '@playwright/test';
import { wrapExpect } from '@cloudbeat/cucumber';
import { LoginPage } from '../pages/Login';
import { CbWorld } from '../support/world';

function getLoginPage(world: CbWorld) {
    const expect = wrapExpect(pwExpect, world);
    return new LoginPage(world.page, expect as typeof pwExpect);
}

Given('Open the login page {string} and {string}', async function (this: CbWorld) {
    const loginPage = getLoginPage(this);
    await loginPage.open();
    await loginPage.assertPageOpen();
});

Given('Logged in as {string} with password {string}', async function (this: CbWorld, username: string, password: string) {
    const loginPage = getLoginPage(this);
    await loginPage.open();
    await loginPage.assertPageOpen();
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
    await loginPage.pressLoginButton();
    await loginPage.assertLoginSuccess();
});

When('Enter username {string} and password {string}', async function (this: CbWorld, username: string, password: string) {
    const loginPage = getLoginPage(this);
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
});

When('Press the login button', async function (this: CbWorld) {
    const loginPage = getLoginPage(this);
    await loginPage.pressLoginButton();
});

Then('Login should be successful', async function (this: CbWorld) {
    const loginPage = getLoginPage(this);
    await loginPage.assertLoginSuccess();
});

Then('Login error {string} should be displayed', async function (this: CbWorld, expectedMessage: string) {
    const loginPage = getLoginPage(this);
    await loginPage.assertLoginErrorMessage(expectedMessage);
});
