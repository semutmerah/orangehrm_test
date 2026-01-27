import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Failed Login Scenarios', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('Should show required error when both username and password are empty', async ({ page }) => {
        // Click login without filling any fields
        await loginPage.clickLogin();

        // Verify both fields show "Required" error
        await loginPage.verifyRequiredFieldError(2);

        // Verify both fields have error styling
        await loginPage.verifyUsernameHasError();
        await loginPage.verifyPasswordHasError();
    });

    test('Should show required error when only username is filled', async ({ page }) => {
        // Fill only username
        await loginPage.fillUsername('WrongUser');
        await loginPage.clickLogin();

        // Verify password field shows "Required" error
        await loginPage.verifyRequiredFieldError(1);

        // Verify only password field has error styling
        await loginPage.verifyPasswordHasError();
    });

    test('Should show required error when only password is filled', async ({ page }) => {
        // Fill only password
        await loginPage.fillPassword('WrongPass');
        await loginPage.clickLogin();

        // Verify username field shows "Required" error
        await loginPage.verifyRequiredFieldError(1);

        // Verify only username field has error styling
        await loginPage.verifyUsernameHasError();
    });

    test('Should show invalid credentials error with wrong username and password', async ({ page }) => {
        // Attempt login with invalid credentials
        await loginPage.login('WrongUser', 'WrongPass');

        // Verify invalid credentials alert is displayed
        await loginPage.verifyInvalidCredentialsError();

        // Verify we're still on the login page
        await expect(page).toHaveURL(/.*login/);
    });

    test('Should show invalid credentials error with correct username but wrong password', async ({ page }) => {
        // Attempt login with correct username but wrong password
        await loginPage.login('Admin', 'WrongPassword123');

        // Verify invalid credentials alert is displayed
        await loginPage.verifyInvalidCredentialsError();

        // Verify we're still on the login page
        await expect(page).toHaveURL(/.*login/);
    });

    test('Should show invalid credentials error with wrong username but correct password', async ({ page }) => {
        // Attempt login with wrong username but correct password
        await loginPage.login('WrongAdmin', 'admin123');

        // Verify invalid credentials alert is displayed
        await loginPage.verifyInvalidCredentialsError();

        // Verify we're still on the login page
        await expect(page).toHaveURL(/.*login/);
    });

    test('Should show invalid credentials error with empty username and correct password', async ({ page }) => {
        // Fill only password with correct credentials
        await loginPage.fillPassword('admin123');
        await loginPage.clickLogin();

        // Verify username field shows "Required" error (not invalid credentials)
        await loginPage.verifyRequiredFieldError(1);
        await loginPage.verifyUsernameHasError();
    });

    test('Should show invalid credentials error with correct username and empty password', async ({ page }) => {
        // Fill only username with correct credentials
        await loginPage.fillUsername('Admin');
        await loginPage.clickLogin();

        // Verify password field shows "Required" error (not invalid credentials)
        await loginPage.verifyRequiredFieldError(1);
        await loginPage.verifyPasswordHasError();
    });
});