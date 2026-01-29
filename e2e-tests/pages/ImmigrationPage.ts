import { Page, Locator, expect } from '@playwright/test';

export class ImmigrationPage {
    readonly page: Page;

    // Form locators
    readonly addButton: Locator;
    readonly documentNumberInput: Locator;
    readonly issuedDateInput: Locator;
    readonly expiryDateInput: Locator;
    readonly eligibleStatusInput: Locator;
    readonly issuedByDropdown: Locator;
    readonly eligibleReviewDateInput: Locator;
    readonly commentsInput: Locator;
    readonly saveButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addButton = page.getByRole('button', { name: ' Add' }).first();
        this.documentNumberInput = page.locator('div.oxd-input-group:has-text("Number") input').first();
        this.issuedDateInput = page.locator('div.oxd-input-group:has-text("Issued Date") input').first();
        this.expiryDateInput = page.locator('div.oxd-input-group:has-text("Expiry Date") input').first();
        this.eligibleStatusInput = page.locator('div.oxd-input-group:has-text("Eligible Status") input').first();
        this.issuedByDropdown = page.locator('div.oxd-input-group:has-text("Issued By") .oxd-select-text').first();
        this.eligibleReviewDateInput = page.locator('div.oxd-input-group:has-text("Eligible Review Date") input').first();
        this.commentsInput = page.getByPlaceholder('Type Comments here');
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
        this.successMessage = page.getByText('Successfully Saved');
    }

    /**
     * Navigate to the Immigration page for a specific employee
     * @param employeeNumber - The employee number from the URL
     */
    async goto(employeeNumber: string) {
        await this.page.goto(`/web/index.php/pim/viewImmigration/empNumber/${employeeNumber}`);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the Add button to open the immigration record form
     */
    async clickAdd() {
        await this.addButton.click();
    }

    /**
     * Add a new immigration record with all provided information
     * @param immigration - Object containing immigration record details
     */
    async addImmigrationRecord(immigration: {
        documentNumber: string;
        issuedDate: string;
        expiryDate: string;
        eligibleStatus: string;
        issuedBy: string;
        eligibleReviewDate: string;
        comments?: string;
    }) {
        await this.documentNumberInput.fill(immigration.documentNumber);
        await this.issuedDateInput.fill(immigration.issuedDate);
        await this.expiryDateInput.fill(immigration.expiryDate);
        await this.eligibleStatusInput.fill(immigration.eligibleStatus);

        await this.issuedByDropdown.click();
        await this.page.getByRole('option', { name: immigration.issuedBy }).click();

        await this.eligibleReviewDateInput.fill(immigration.eligibleReviewDate);

        if (immigration.comments) {
            await this.commentsInput.fill(immigration.comments);
        }
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
