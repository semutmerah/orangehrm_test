import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    }

    async verifyDashboardLoaded() {
        await expect(this.page).toHaveURL(/.*dashboard/, { timeout: 10000 });
        await expect(this.dashboardHeading).toBeVisible({ timeout: 10000 });
    }
}
