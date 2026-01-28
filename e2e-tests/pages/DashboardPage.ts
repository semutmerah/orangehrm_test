import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardHeading: Locator;

    // Menu items
    readonly leaveMenu: Locator;
    readonly timeMenu: Locator;
    readonly myInfoMenu: Locator;
    readonly performanceMenu: Locator;
    readonly dashboardMenu: Locator;
    readonly directoryMenu: Locator;
    readonly claimMenu: Locator;
    readonly buzzMenu: Locator;
    readonly adminMenu: Locator;
    readonly pimMenu: Locator;
    readonly maintenanceMenu: Locator;
    readonly recruitmentMenu: Locator;

    // Dashboard widgets
    readonly searchBox: Locator;
    readonly timeAtWorkWidget: Locator;
    readonly myActionsWidget: Locator;
    readonly buzzLatestPostsWidget: Locator;
    readonly quickLaunchWidget: Locator;
    readonly employeesOnLeaveWidget: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });

        // Menu items
        this.leaveMenu = page.getByRole('link', { name: 'Leave' });
        this.timeMenu = page.getByRole('link', { name: 'Time' });
        this.myInfoMenu = page.getByRole('link', { name: 'My Info' });
        this.performanceMenu = page.getByRole('link', { name: 'Performance' });
        this.dashboardMenu = page.getByRole('link', { name: 'Dashboard' });
        this.directoryMenu = page.getByRole('link', { name: 'Directory' });
        this.claimMenu = page.getByRole('link', { name: 'Claim' });
        this.buzzMenu = page.getByRole('link', { name: 'Buzz' });
        this.adminMenu = page.getByRole('link', { name: 'Admin' });
        this.pimMenu = page.getByRole('link', { name: 'PIM' });
        this.maintenanceMenu = page.getByRole('link', { name: 'Maintenance' });
        this.recruitmentMenu = page.getByRole('link', { name: 'Recruitment' });

        // Dashboard widgets
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
        this.timeAtWorkWidget = page.getByText('Time at Work');
        this.myActionsWidget = page.getByText('My Actions');
        this.buzzLatestPostsWidget = page.getByText('Buzz Latest Posts');
        this.quickLaunchWidget = page.getByText('Quick Launch');
        this.employeesOnLeaveWidget = page.getByText('Employees on Leave Today');
    }

    async verifyDashboardLoaded() {
        await Promise.race([
            expect(this.page).toHaveURL(/.*dashboard/, { timeout: 60000 }),
            expect(this.dashboardHeading).toBeVisible({ timeout: 60000 })
        ]);
    }

    async verifyESSMenuAccess() {
        // Verify ESS user has access to these menus
        await expect(this.leaveMenu).toBeVisible();
        await expect(this.timeMenu).toBeVisible();
        await expect(this.myInfoMenu).toBeVisible();
        await expect(this.performanceMenu).toBeVisible();
        await expect(this.dashboardMenu).toBeVisible();
        await expect(this.directoryMenu).toBeVisible();
        await expect(this.claimMenu).toBeVisible();
        await expect(this.buzzMenu).toBeVisible();

        // Verify ESS user does NOT have access to admin menus
        await expect(this.adminMenu).toBeHidden();
        await expect(this.pimMenu).toBeHidden();
        await expect(this.maintenanceMenu).toBeHidden();
        await expect(this.recruitmentMenu).toBeHidden();
    }

    async verifyAdminMenuAccess() {
        // Verify Admin user has access to all standard menus
        await expect(this.leaveMenu).toBeVisible();
        await expect(this.timeMenu).toBeVisible();
        await expect(this.myInfoMenu).toBeVisible();
        await expect(this.performanceMenu).toBeVisible();
        await expect(this.dashboardMenu).toBeVisible();
        await expect(this.directoryMenu).toBeVisible();
        await expect(this.claimMenu).toBeVisible();
        await expect(this.buzzMenu).toBeVisible();

        // Verify Admin user HAS access to admin-specific menus
        await expect(this.adminMenu).toBeVisible();
        await expect(this.pimMenu).toBeVisible();
        await expect(this.maintenanceMenu).toBeVisible();
        await expect(this.recruitmentMenu).toBeVisible();
    }

    async verifyDashboardWidgets() {
        await expect(this.searchBox).toBeVisible();
        await expect(this.timeAtWorkWidget).toBeVisible();
        await expect(this.myActionsWidget).toBeVisible();
        await expect(this.buzzLatestPostsWidget).toBeVisible();
        await expect(this.quickLaunchWidget).toBeVisible();
        await expect(this.employeesOnLeaveWidget).toBeVisible();
    }
}
