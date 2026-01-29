import { Page, Locator, expect } from '@playwright/test';

export class ContactDetailsPage {
    readonly page: Page;

    // Address section locators
    readonly street1Input: Locator;
    readonly street2Input: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly countryDropdown: Locator;

    // Telephone section locators
    readonly homePhoneInput: Locator;
    readonly mobilePhoneInput: Locator;
    readonly workPhoneInput: Locator;

    // Email section locators
    readonly workEmailInput: Locator;
    readonly otherEmailInput: Locator;

    // Form actions
    readonly saveButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Address fields
        this.street1Input = page.locator('div.oxd-input-group:has-text("Street 1") input').first();
        this.street2Input = page.locator('div.oxd-input-group:has-text("Street 2") input').first();
        this.cityInput = page.locator('div.oxd-input-group:has-text("City") input').first();
        this.stateInput = page.locator('div.oxd-input-group:has-text("State/Province") input').first();
        this.zipCodeInput = page.locator('div.oxd-input-group:has-text("Zip/Postal Code") input').first();
        this.countryDropdown = page.locator('div.oxd-input-group:has-text("Country") .oxd-select-text').first();

        // Telephone fields
        this.homePhoneInput = page.locator('div.oxd-input-group:has-text("Home") input').first();
        this.mobilePhoneInput = page.locator('div.oxd-input-group:has-text("Mobile") input').first();
        this.workPhoneInput = page.locator('div.oxd-input-group:has-text("Work") input').first();

        // Email fields
        this.workEmailInput = page.locator('div.oxd-input-group:has-text("Work Email") input').first();
        this.otherEmailInput = page.locator('div.oxd-input-group:has-text("Other Email") input').first();

        // Form actions
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
        this.successMessage = page.getByText('Successfully Updated');
    }

    /**
     * Navigate to the Contact Details page for a specific employee
     * @param employeeNumber - The employee number from the URL
     */
    async goto(employeeNumber: string) {
        await this.page.goto(`/web/index.php/pim/contactDetails/empNumber/${employeeNumber}`);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Update contact details with all provided information
     * @param details - Object containing all contact details to update
     */
    async updateContactDetails(details: {
        street1?: string;
        street2?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        homePhone?: string;
        mobilePhone?: string;
        workPhone?: string;
        workEmail?: string;
        otherEmail?: string;
    }) {
        // Address fields
        if (details.street1) await this.street1Input.fill(details.street1);
        if (details.street2) await this.street2Input.fill(details.street2);
        if (details.city) await this.cityInput.fill(details.city);
        if (details.state) await this.stateInput.fill(details.state);
        if (details.zipCode) await this.zipCodeInput.fill(details.zipCode);

        if (details.country) {
            await this.countryDropdown.click();
            await this.page.getByRole('option', { name: details.country }).click();
        }

        // Telephone fields
        if (details.homePhone) await this.homePhoneInput.fill(details.homePhone);
        if (details.mobilePhone) await this.mobilePhoneInput.fill(details.mobilePhone);
        if (details.workPhone) await this.workPhoneInput.fill(details.workPhone);

        // Email fields
        if (details.workEmail) await this.workEmailInput.fill(details.workEmail);
        if (details.otherEmail) await this.otherEmailInput.fill(details.otherEmail);
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
    async verifySuccessfulUpdate(timeout: number = 10000) {
        await expect(this.successMessage).toBeVisible({ timeout });
    }
}
