import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('ESS Role Tests', () => {
    let username: string;
    let password: string;

    test.beforeEach(async ({ browser }) => {
        // Create a context with admin storage state for employee creation
        const adminContext = await browser.newContext({
            storageState: 'e2e-tests/.auth/user.json'
        });
        const adminPage = await adminContext.newPage();

        const addEmployeePage = new AddEmployeePage(adminPage);

        // Navigate to the Add Employee page (authenticated as admin)
        await addEmployeePage.goto();

        // Generate dynamic employee data
        const firstName = faker.person.firstName();
        const middleName = faker.person.middleName();
        const lastName = faker.person.lastName();
        const employeeId = faker.number.int({ min: 40000, max: 60000 }).toString();
        const photoPath = path.join(__dirname, '../photo/photo.png');
        username = faker.internet.username();
        // Generate a password that meets OrangeHRM requirements
        // Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
        password = `Pass${faker.string.alphanumeric(6)}123`;

        // Add employee with photo and login details
        await addEmployeePage.addEmployee(firstName, middleName, lastName, photoPath, employeeId, username, password);

        // Verify successful creation (redirects to personal details page)
        await addEmployeePage.verifySuccessfulCreation();

        // Cleanup admin context
        await adminContext.close();
    });

    test('ESS user should have limited menu access', async ({ browser }) => {
        // Create a new context without storage state to bypass admin session
        const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
        const page = await context.newPage();

        // Initialize page objects
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        // Navigate to login page and login with ESS user credentials
        await loginPage.goto();
        await loginPage.login(username, password);

        // Verify ESS user has limited menu access
        await dashboardPage.verifyESSMenuAccess();

        // Verify dashboard widgets are visible
        await dashboardPage.verifyDashboardWidgets();

        // Cleanup: close the context
        await context.close();
    });
});
