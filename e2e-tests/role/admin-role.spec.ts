import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Admin Role Tests', () => {
    test('Admin user should have full menu access', async ({ page }) => {
        // Initialize page objects
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        // Navigate to the application (already authenticated via storage state)
        await loginPage.goto();

        // Verify Admin user has full menu access
        await dashboardPage.verifyAdminMenuAccess();

        // Verify dashboard widgets are visible
        await dashboardPage.verifyDashboardWidgets();

    });
});
