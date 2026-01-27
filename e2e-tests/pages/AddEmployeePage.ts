import { Page, Locator, expect } from '@playwright/test';

export class AddEmployeePage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly photoUploadInput: Locator;
    readonly saveButton: Locator;
    readonly successToast: Locator;

    // Login Details fields
    readonly createLoginDetailsToggle: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly statusEnabledRadio: Locator;
    readonly statusDisabledRadio: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.employeeIdInput = page.locator('div.oxd-input-group:has(label:has-text("Employee Id")) input');
        this.photoUploadInput = page.locator('input[type="file"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.successToast = page.locator('.oxd-text--toast-message');

        // Login Details locators - using more robust selectors
        this.createLoginDetailsToggle = page.locator('.oxd-switch-input');
        this.usernameInput = page.locator('div.oxd-input-group:has-text("Username") input');
        this.passwordInput = page.locator('div.oxd-input-group:has(label:text-is("Password")) input[type="password"]');
        this.confirmPasswordInput = page.locator('div.oxd-input-group:has-text("Confirm Password") input[type="password"]');
        this.statusEnabledRadio = page.locator('label:has-text("Enabled")');
        this.statusDisabledRadio = page.locator('label:has-text("Disabled")');
    }

    async goto() {
        await this.page.goto('/web/index.php/pim/addEmployee');
    }

    async uploadPhoto(photoPath: string) {
        await this.photoUploadInput.setInputFiles(photoPath);
    }

    async fillEmployeeDetails(firstName: string, middleName: string, lastName: string, employeeId?: string) {
        await this.firstNameInput.fill(firstName);
        await this.middleNameInput.fill(middleName);
        await this.lastNameInput.fill(lastName);

        if (employeeId) {
            // fill() automatically clears and replaces the text
            await this.employeeIdInput.fill(employeeId);
        }
    }

    async enableLoginDetails() {
        await this.createLoginDetailsToggle.click();
    }

    async fillLoginDetails(username: string, password: string, enabled: boolean = true) {
        // Wait for username field to be visible after toggle
        await this.usernameInput.waitFor({ state: 'visible' });
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);

        if (enabled) {
            await this.statusEnabledRadio.click();
        } else {
            await this.statusDisabledRadio.click();
        }
    }

    async submitForm() {
        await this.saveButton.click();
    }

    async verifySuccessMessage() {
        await expect(this.successToast).toContainText('Successfully Saved');
    }

    async verifySuccessfulCreation() {
        // When creating employee with login details, it redirects to personal details page
        // When creating without login details, it shows a toast message
        try {
            await expect(this.successToast).toContainText('Successfully Saved');
        } catch {
            // If no toast, check if redirected to personal details page
            await expect(this.page).toHaveURL(/.*viewPersonalDetails.*/);
        }
    }

    /**
     * Complete flow to add an employee with basic details only
     */
    async addEmployee(firstName: string, middleName: string, lastName: string, photoPath?: string, employeeId?: string, username?: string, password?: string, enabled: boolean = true) {
        if (photoPath) {
            await this.uploadPhoto(photoPath);
        }
        await this.fillEmployeeDetails(firstName, middleName, lastName, employeeId);

        if (username && password) {
            await this.enableLoginDetails();
            await this.fillLoginDetails(username, password, enabled);
        }

        await this.submitForm();
    }
}
