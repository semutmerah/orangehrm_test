import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { getConfig } from '../config/environment';

test("Should able to login successfully", async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const config = getConfig();

    // Navigate to the login page
    await loginPage.goto();

    // Perform login with environment-specific credentials
    await loginPage.login(config.username, config.password);

    // Verify successful login
    await dashboardPage.verifyDashboardLoaded();
});
