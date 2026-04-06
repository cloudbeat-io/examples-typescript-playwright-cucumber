import { Page, expect as pwExpect } from '@playwright/test';

type ExpectFn = typeof pwExpect;

export class LoginPage {
    private readonly page: Page;
    private readonly expect: ExpectFn;
    private readonly baseUrl: string = 'https://www.saucedemo.com';

    constructor(page: Page, expect: ExpectFn = pwExpect, baseUrl?: string) {
        this.page = page;
        this.expect = expect;
        if (baseUrl) {
            this.baseUrl = baseUrl;
        }
    }

    async open(): Promise<void> {
        await this.page.goto(this.baseUrl);
    }

    async assertPageOpen(): Promise<void> {
        const loginBtn = this.page.locator('#login-button');
        await this.expect(loginBtn).toBeVisible();
    }

    async enterUsername(username: string): Promise<void> {
        const usernameField = this.page.locator('#user-name');
        await this.expect(usernameField).toBeVisible();
        await usernameField.click();
        await usernameField.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        const passwordField = this.page.locator('#password');
        await this.expect(passwordField).toBeVisible();
        await passwordField.click();
        await passwordField.fill(password);
    }

    async pressLoginButton(): Promise<void> {
        const loginBtn = this.page.locator('#login-button');
        await this.expect(loginBtn).toBeVisible();
        await loginBtn.click();
    }

    async assertLoginSuccess(): Promise<void> {
        const loginBtn = this.page.locator('#login-button');
        await this.expect(loginBtn).not.toBeVisible();
    }

    async assertLoginErrorMessage(expectedMessage: string): Promise<void> {
        const errorMessage = this.page.locator('[data-test="error"]');
        await this.expect(errorMessage).toBeVisible();
        await this.expect(errorMessage).toHaveText(expectedMessage);
    }
}
