import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly invalidCredentialsAlert: Locator;
    readonly requiredErrorMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.invalidCredentialsAlert = page.locator('.oxd-alert');
        this.requiredErrorMessages = page.locator('.oxd-input-field-error-message');
    }

    async goto() {
        await this.page.goto('/web/index.php/auth/login');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async verifyInvalidCredentialsError() {
        // Wait for the page to navigate back to login after validation
        await this.page.waitForURL(/.*login/, { timeout: 10000 });

        // Now check for the alert
        await expect(this.invalidCredentialsAlert).toBeVisible({ timeout: 10000 });
        await expect(this.invalidCredentialsAlert).toContainText('Invalid credentials');
    }

    async verifyRequiredFieldError(count: number = 1) {
        await expect(this.requiredErrorMessages).toHaveCount(count);
        await expect(this.requiredErrorMessages.first()).toContainText('Required');
    }

    async verifyUsernameHasError() {
        const usernameField = this.usernameInput;
        await expect(usernameField).toHaveClass(/oxd-input--error/);
    }

    async verifyPasswordHasError() {
        const passwordField = this.passwordInput;
        await expect(passwordField).toHaveClass(/oxd-input--error/);
    }
}
