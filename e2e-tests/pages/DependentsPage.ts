import { Page, Locator, expect } from '@playwright/test';

export class DependentsPage {
    readonly page: Page;

    // Form locators
    readonly addButton: Locator;
    readonly nameInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly relationshipDropdown: Locator;
    readonly saveButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addButton = page.getByRole('button', { name: ' Add' }).first();
        this.nameInput = page.locator('div.oxd-input-group:has-text("Name") input').first();
        this.dateOfBirthInput = page.locator('div.oxd-input-group:has-text("Date of Birth") input').first();
        this.relationshipDropdown = page.locator('div.oxd-input-group:has-text("Relationship") .oxd-select-text').first();
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
        this.successMessage = page.getByText('Successfully Saved');
    }

    /**
     * Navigate to the Dependents page for a specific employee
     * @param employeeNumber - The employee number from the URL
     */
    async goto(employeeNumber: string) {
        await this.page.goto(`/web/index.php/pim/viewDependents/empNumber/${employeeNumber}`);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the Add button to open the dependent form
     */
    async clickAdd() {
        await this.addButton.click();
    }

    /**
     * Add a new dependent with all provided information
     * @param dependent - Object containing dependent details
     */
    async addDependent(dependent: {
        name: string;
        dateOfBirth: string;
        relationship: string;
    }) {
        await this.nameInput.fill(dependent.name);
        await this.dateOfBirthInput.fill(dependent.dateOfBirth);

        await this.relationshipDropdown.click();
        await this.page.getByRole('option', { name: dependent.relationship }).click();
    }

    /**
     * Click the Save button to submit the form
     */
    async save() {
        await this.saveButton.click();
    }

    /**
     * Verify that the success message is displayed
     * @param timeout - Optional timeout in milliseconds (default: 10000)
     */
    async verifySuccessfulSave(timeout: number = 10000) {
        await expect(this.successMessage).toBeVisible({ timeout });
    }
}
