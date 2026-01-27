import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';
import { AddEmployeePage } from '../pages/AddEmployeePage';

test.describe.serial('Employee Creation Tests', () => {
    test('Successful Add Employee', async ({ page }) => {
        const addEmployeePage = new AddEmployeePage(page);

        // Navigate to the Add Employee page (already authenticated via setup)
        await addEmployeePage.goto();

        // Generate dynamic employee data
        const firstName = faker.person.firstName();
        const middleName = faker.person.middleName();
        const lastName = faker.person.lastName();
        const employeeId = faker.number.int({ min: 40000, max: 60000 }).toString();
        const photoPath = path.join(__dirname, '../photo/photo.png');

        // Add employee with photo
        await addEmployeePage.addEmployee(firstName, middleName, lastName, photoPath, employeeId);

        // Verify successful creation
        await addEmployeePage.verifySuccessfulCreation();
    });

    test('Successful Add Employee with Login Details', async ({ page }) => {
        const addEmployeePage = new AddEmployeePage(page);

        // Navigate to the Add Employee page (already authenticated via setup)
        await addEmployeePage.goto();

        // Generate dynamic employee data
        const firstName = faker.person.firstName();
        const middleName = faker.person.middleName();
        const lastName = faker.person.lastName();
        const employeeId = faker.number.int({ min: 40000, max: 60000 }).toString();
        const photoPath = path.join(__dirname, '../photo/photo.png');
        const username = faker.internet.username();
        // Generate a password that meets OrangeHRM requirements
        // Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
        const password = `Pass${faker.string.alphanumeric(6)}123`;

        // Add employee with photo and login details
        await addEmployeePage.addEmployee(firstName, middleName, lastName, photoPath, employeeId, username, password);

        // Verify successful creation (redirects to personal details page)
        await addEmployeePage.verifySuccessfulCreation();
    });
});
