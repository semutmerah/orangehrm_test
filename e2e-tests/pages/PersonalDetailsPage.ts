import { Page, Locator, expect } from '@playwright/test';

export class PersonalDetailsPage {
    readonly page: Page;

    // Personal Details form locators
    readonly driverLicenseNumberInput: Locator;
    readonly licenseExpiryDateInput: Locator;
    readonly nationalityDropdown: Locator;
    readonly maritalStatusDropdown: Locator;
    readonly dateOfBirthInput: Locator;
    readonly maleGenderRadio: Locator;
    readonly femaleGenderRadio: Locator;
    readonly saveButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators using label-based selectors for robustness
        this.driverLicenseNumberInput = page.locator('div.oxd-input-group:has-text("Driver\'s License Number") input').first();
        this.licenseExpiryDateInput = page.locator('div.oxd-input-group:has-text("License Expiry Date") input').first();
        this.nationalityDropdown = page.locator('div.oxd-input-group:has-text("Nationality") .oxd-select-text').first();
        this.maritalStatusDropdown = page.locator('div.oxd-input-group:has-text("Marital Status") .oxd-select-text').first();
        this.dateOfBirthInput = page.locator('div.oxd-input-group:has-text("Date of Birth") input').first();
        this.maleGenderRadio = page.locator('label:has-text("Male")').first();
        this.femaleGenderRadio = page.locator('label:has-text("Female")').first();
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
        this.successMessage = page.getByText('Successfully Updated');
    }

    /**
     * Navigate to the Personal Details page for a specific employee
     * @param employeeNumber - The employee number from the URL
     */
    async goto(employeeNumber: string) {
        await this.page.goto(`/web/index.php/pim/viewPersonalDetails/empNumber/${employeeNumber}`);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Extract employee number from the current URL
     * @returns The employee number extracted from the URL
     * @throws Error if employee number cannot be extracted
     */
    async extractEmployeeNumber(): Promise<string> {
        await this.page.waitForURL(/.*viewPersonalDetails.*empNumber.*/);
        const currentUrl = this.page.url();
        const match = currentUrl.match(/empNumber\/(\d+)/);
        if (match) {
            return match[1];
        } else {
            throw new Error(`Failed to extract employee number from URL: ${currentUrl}`);
        }
    }

    /**
     * Fill the driver's license number field
     * @param licenseNumber - The license number to fill
     */
    async fillDriverLicenseNumber(licenseNumber: string) {
        await this.driverLicenseNumberInput.fill(licenseNumber);
    }

    /**
     * Fill the license expiry date field
     * @param expiryDate - The expiry date in yyyy-mm-dd format
     */
    async fillLicenseExpiryDate(expiryDate: string) {
        await this.licenseExpiryDateInput.fill(expiryDate);
    }

    /**
     * Select nationality from the dropdown
     * @param nationality - The nationality to select (e.g., 'Afghan', 'American')
     */
    async selectNationality(nationality: string) {
        await this.nationalityDropdown.click();
        await this.page.getByRole('option', { name: nationality }).click();
    }

    /**
     * Select marital status from the dropdown
     * @param status - The marital status to select (e.g., 'Single', 'Married')
     */
    async selectMaritalStatus(status: string) {
        await this.maritalStatusDropdown.click();
        await this.page.getByRole('option', { name: status }).click();
    }

    /**
     * Fill the date of birth field
     * @param dateOfBirth - The date of birth in yyyy-mm-dd format
     */
    async fillDateOfBirth(dateOfBirth: string) {
        await this.dateOfBirthInput.fill(dateOfBirth);
    }

    /**
     * Select gender
     * @param gender - The gender to select ('Male' or 'Female')
     */
    async selectGender(gender: 'Male' | 'Female') {
        if (gender === 'Male') {
            await this.maleGenderRadio.click();
        } else {
            await this.femaleGenderRadio.click();
        }
    }

    /**
     * Update personal details with all provided information
     * @param details - Object containing all personal details to update
     */
    async updatePersonalDetails(details: {
        driverLicenseNumber?: string;
        licenseExpiryDate?: string;
        nationality?: string;
        maritalStatus?: string;
        dateOfBirth?: string;
        gender?: 'Male' | 'Female';
    }) {
        if (details.driverLicenseNumber) {
            await this.fillDriverLicenseNumber(details.driverLicenseNumber);
        }
        if (details.licenseExpiryDate) {
            await this.fillLicenseExpiryDate(details.licenseExpiryDate);
        }
        if (details.nationality) {
            await this.selectNationality(details.nationality);
        }
        if (details.maritalStatus) {
            await this.selectMaritalStatus(details.maritalStatus);
        }
        if (details.dateOfBirth) {
            await this.fillDateOfBirth(details.dateOfBirth);
        }
        if (details.gender) {
            await this.selectGender(details.gender);
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
    async verifySuccessfulUpdate(timeout: number = 10000) {
        await expect(this.successMessage).toBeVisible({ timeout });
    }
}
