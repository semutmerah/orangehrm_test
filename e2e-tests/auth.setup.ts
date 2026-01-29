import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { getConfig } from './config/environment';

const authFile = 'e2e-tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const config = getConfig();

    // Navigate to the login page
    await loginPage.goto();

    // Perform login with environment-specific credentials
    await loginPage.login(config.username, config.password);

    // Verify successful login
    await dashboardPage.verifyDashboardLoaded();

    // Save the authenticated state to a file
    await page.context().storageState({ path: authFile });
});
