import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

const authFile = 'e2e-tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Navigate to the login page
    await loginPage.goto();

    // Perform login
    await loginPage.login('Admin', 'Admin@54321');

    // Verify successful login
    await dashboardPage.verifyDashboardLoaded();

    // Save the authenticated state to a file
    await page.context().storageState({ path: authFile });
});
