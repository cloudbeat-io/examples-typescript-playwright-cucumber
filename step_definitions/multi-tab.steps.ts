import { Given, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/Login';
import { CbWorld } from '../support/world';

Given('Open a second tab and navigate to the login page', async function (this: CbWorld) {
    this.secondPage = await this.context.newPage();
    const loginPage = new LoginPage(this.secondPage);
    await loginPage.open();
});

Then('The login page should be open on the second tab', async function (this: CbWorld) {
    const loginPage = new LoginPage(this.secondPage!);
    await loginPage.assertPageOpen();
});
