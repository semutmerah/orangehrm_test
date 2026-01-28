import { Page, Locator, expect } from '@playwright/test';

export class ViewEmployeePage {
    readonly page: Page;

    // Search section locators
    readonly searchInput: Locator;
    readonly searchButton: Locator;

    // Employee list locators
    readonly employeeRow: Locator;
    readonly deleteButton: Locator;

    // Confirmation dialog locators
    readonly confirmDeleteButton: Locator;
    readonly cancelDeleteButton: Locator;

    // Success message locators
    readonly successToast: Locator;

    constructor(page: Page) {
        this.page = page;

        // Search section - Employee Name autocomplete input
        this.searchInput = page.locator('input[placeholder="Type for hints..."]').first();
        this.searchButton = page.getByRole('button', { name: 'Search' });

        // Employee list - will be populated after search
        this.employeeRow = page.locator('.oxd-table-card').first();
        // Delete button - trash icon in the actions column
        this.deleteButton = page.locator('.oxd-table-card').first().locator('button i.bi-trash').locator('..')

        this.confirmDeleteButton = page.getByRole('button', { name: ' Yes, Delete' }); // TODO: Add confirm delete button locator
        this.cancelDeleteButton = page.getByRole('button', { name: 'No, Cancel' }); // TODO: Add cancel delete button locator

        this.successToast = page.locator('.oxd-text--toast-message');
    }

    async goto() {
        await this.page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'domcontentloaded' });
        await this.page.waitForLoadState('networkidle');
    }

    async navigateFromPersonalDetails() {
        // Wait for page to be stable before navigating
        await this.page.waitForLoadState('networkidle');

        // Navigate to Employee List via PIM menu
        // Click PIM to open the submenu/navigate to PIM section
        await this.page.getByRole('link', { name: 'PIM' }).click();
        await this.page.waitForLoadState('networkidle');

        // Click on Employee List link if it exists, otherwise we're already on the list
        const employeeListLink = this.page.getByRole('link', { name: 'Employee List' });
        if (await employeeListLink.isVisible().catch(() => false)) {
            await employeeListLink.click();
            await this.page.waitForLoadState('networkidle');
        }
    }

    async searchEmployee(employeeName: string) {
        // Fill the employee name in the autocomplete field
        await this.searchInput.fill(employeeName);
        // Wait a bit for autocomplete suggestions to appear
        await this.page.waitForTimeout(1000);
        // Click search button
        await this.searchButton.click();
        // Wait for search results to load
        await this.page.waitForLoadState('networkidle');
        // Wait for the table to be visible
        await this.employeeRow.waitFor({ state: 'visible', timeout: 10000 });
    }

    async deleteEmployee() {
        // TODO: Implement delete logic
        // Click delete button for the employee
        await this.deleteButton.click();

        // Confirm deletion in the dialog
        await this.confirmDeleteButton.click();
    }

    async verifySuccessfulDeletion() {
        await expect(this.successToast).toContainText('Successfully Deleted', { timeout: 60000 });
    }

    async verifyEmployeeNotFound(employeeName: string) {
        // TODO: Implement verification that employee is not in the list
        // This could check for "No Records Found" message or similar
    }
}
