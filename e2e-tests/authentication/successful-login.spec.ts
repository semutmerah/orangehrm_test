import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test("Should able to login successfully", async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Navigate to the login page
    await loginPage.goto();

    // Perform login
    await loginPage.login('Admin', 'Admin@54321');

    // Verify successful login
    await dashboardPage.verifyDashboardLoaded();
});
