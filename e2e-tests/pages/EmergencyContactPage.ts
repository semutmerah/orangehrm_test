import { Page, Locator, expect } from '@playwright/test';

export class EmergencyContactPage {
    readonly page: Page;

    // Form locators
    readonly addButton: Locator;
    readonly nameInput: Locator;
    readonly relationshipInput: Locator;
    readonly homeTelephoneInput: Locator;
    readonly mobileInput: Locator;
    readonly workTelephoneInput: Locator;
    readonly saveButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addButton = page.getByRole('button', { name: ' Add' }).first();
        this.nameInput = page.locator('div.oxd-input-group:has-text("Name") input').first();
        this.relationshipInput = page.locator('div.oxd-input-group:has-text("Relationship") input').first();
        this.homeTelephoneInput = page.locator('div.oxd-input-group:has-text("Home Telephone") input').first();
        this.mobileInput = page.locator('div.oxd-input-group:has-text("Mobile") input').first();
        this.workTelephoneInput = page.locator('div.oxd-input-group:has-text("Work Telephone") input').first();
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
        this.successMessage = page.getByText('Successfully Saved');
    }

    /**
     * Navigate to the Emergency Contacts page for a specific employee
     * @param employeeNumber - The employee number from the URL
     */
    async goto(employeeNumber: string) {
        await this.page.goto(`/web/index.php/pim/viewEmergencyContacts/empNumber/${employeeNumber}`);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the Add button to open the emergency contact form
     */
    async clickAdd() {
        await this.addButton.click();
    }

    /**
     * Add a new emergency contact with all provided information
     * @param contact - Object containing emergency contact details
     */
    async addEmergencyContact(contact: {
        name: string;
        relationship: string;
        homeTelephone?: string;
        mobile?: string;
        workTelephone?: string;
    }) {
        await this.nameInput.fill(contact.name);
        await this.relationshipInput.fill(contact.relationship);

        if (contact.homeTelephone) {
            await this.homeTelephoneInput.fill(contact.homeTelephone);
        }
        if (contact.mobile) {
            await this.mobileInput.fill(contact.mobile);
        }
        if (contact.workTelephone) {
            await this.workTelephoneInput.fill(contact.workTelephone);
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
