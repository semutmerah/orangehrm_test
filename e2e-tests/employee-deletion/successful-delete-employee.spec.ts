import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { ViewEmployeePage } from '../pages/ViewEmployeePage';


test.describe('Employee Deletion Tests', () => {
    let firstName: string;

    test.beforeEach(async ({ page }) => {
        const addEmployeePage = new AddEmployeePage(page);

        // Navigate to the Add Employee page (already authenticated via setup)
        await addEmployeePage.goto();

        // Generate dynamic employee data
        firstName = faker.person.firstName();
        const middleName = faker.person.middleName();
        const lastName = faker.person.lastName();
        const employeeId = faker.number.int({ min: 40000, max: 60000 }).toString();
        const photoPath = path.join(__dirname, '../photo/photo.png');

        // Add employee with photo
        await addEmployeePage.addEmployee(firstName, middleName, lastName, photoPath, employeeId);

        // Verify successful creation
        await addEmployeePage.verifySuccessfulCreation();
    });

    test('Successful Delete Employee @smoke', async ({ page }) => {
        const viewEmployeePage = new ViewEmployeePage(page);

        // Navigate to Employee List page
        await viewEmployeePage.navigateFromPersonalDetails();

        // Search and delete employee
        await viewEmployeePage.searchEmployee(firstName);
        await viewEmployeePage.deleteEmployee();
        await viewEmployeePage.verifySuccessfulDeletion();
    });
});