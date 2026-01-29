import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { PersonalDetailsPage } from '../pages/PersonalDetailsPage';
import { ContactDetailsPage } from '../pages/ContactDetailsPage';
import { EmergencyContactPage } from '../pages/EmergencyContactPage';
import { DependentsPage } from '../pages/DependentsPage';
import { ImmigrationPage } from '../pages/ImmigrationPage';


test.describe('Employee Update Tests', () => {
    let employeeNumber: string;

    test.beforeEach(async ({ page }) => {
        const addEmployeePage = new AddEmployeePage(page);
        const personalDetailsPage = new PersonalDetailsPage(page);

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

        // Wait for navigation to personal details page and extract employee number
        await page.waitForURL(/.*viewPersonalDetails.*empNumber.*/);

        // Extract employee number from URL using PersonalDetailsPage
        employeeNumber = await personalDetailsPage.extractEmployeeNumber();
    });

    test('Successful Update Personal Details @smoke', async ({ page }) => {
        const personalDetailsPage = new PersonalDetailsPage(page);

        // Navigate to Personal Details page
        await personalDetailsPage.goto(employeeNumber);

        // Update personal details using page object methods
        await personalDetailsPage.updatePersonalDetails({
            driverLicenseNumber: 'B1234PIK',
            licenseExpiryDate: '2030-01-01',
            nationality: 'Afghan',
            maritalStatus: 'Single',
            dateOfBirth: '1990-01-01',
            gender: 'Male'
        });

        // Save the changes
        await personalDetailsPage.save();

        // Verify success message
        await personalDetailsPage.verifySuccessfulUpdate();
    });

    test('Successful Update Contact Details @smoke', async ({ page }) => {
        const contactDetailsPage = new ContactDetailsPage(page);

        // Navigate to Contact Details page
        await contactDetailsPage.goto(employeeNumber);

        // Generate random contact data
        const contactData = {
            street1: faker.location.streetAddress(),
            street2: faker.location.secondaryAddress(),
            city: faker.location.city(),
            state: faker.location.state({ abbreviated: true }),
            zipCode: faker.location.zipCode('#####'),
            country: 'Afghan',
            homePhone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
            mobilePhone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
            workPhone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
            workEmail: faker.internet.email(),
            otherEmail: faker.internet.email()
        };

        // Update contact details using page object
        await contactDetailsPage.updateContactDetails(contactData);

        // Save the changes
        await contactDetailsPage.save();

        // Verify success message
        await contactDetailsPage.verifySuccessfulUpdate();
    });

    test('Successful Update Emergency Contact', async ({ page }) => {
        const emergencyContactPage = new EmergencyContactPage(page);

        // Navigate to Emergency Contacts page
        await emergencyContactPage.goto(employeeNumber);

        // Click Add button
        await emergencyContactPage.clickAdd();

        // Generate random emergency contact data
        const emergencyContact = {
            name: faker.person.fullName(),
            relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend', 'Child', 'Other']),
            homeTelephone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
            mobile: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
            workTelephone: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(4)}`
        };

        // Add emergency contact using page object
        await emergencyContactPage.addEmergencyContact(emergencyContact);

        // Save the changes
        await emergencyContactPage.save();

        // Verify success message
        await emergencyContactPage.verifySuccessfulSave();
    });

    test('Successful Update Dependents', async ({ page }) => {
        const dependentsPage = new DependentsPage(page);

        // Navigate to Dependents page
        await dependentsPage.goto(employeeNumber);

        // Click Add button
        await dependentsPage.clickAdd();

        // Generate random dependent data
        const dependent = {
            name: faker.person.fullName(),
            dateOfBirth: '1990-01-01',
            relationship: 'Child'
        };

        // Add dependent using page object
        await dependentsPage.addDependent(dependent);

        // Save the changes
        await dependentsPage.save();

        // Verify success message
        await dependentsPage.verifySuccessfulSave();
    });

    test('Successful Update Immigration', async ({ page }) => {
        const immigrationPage = new ImmigrationPage(page);

        // Navigate to Immigration page
        await immigrationPage.goto(employeeNumber);

        // Click Add button
        await immigrationPage.clickAdd();

        // Generate random immigration data
        const immigrationRecord = {
            documentNumber: faker.string.alphanumeric(10).toUpperCase(),
            issuedDate: '2020-01-01',
            expiryDate: '2030-01-01',
            eligibleStatus: faker.helpers.arrayElement(['Yes', 'No']),
            issuedBy: 'Afghanistan',
            eligibleReviewDate: '2025-06-01',
            comments: faker.lorem.sentence()
        };

        // Add immigration record using page object
        await immigrationPage.addImmigrationRecord(immigrationRecord);

        // Save the changes
        await immigrationPage.save();

        // Verify success message
        await immigrationPage.verifySuccessfulSave();
    });


    // test('Successful Update Job', async ({ page }) => {
    //     await page.goto(`/web/index.php/pim/viewJobDetails/empNumber/${employeeNumber}`);
    // });

    // test('Successful Update Salary', async ({ page }) => {
    //     await page.goto(`/web/index.php/pim/viewSalaryList/empNumber/${employeeNumber}`);
    // });

    // test('Successful Update Tax Exemptions', async ({ page }) => {
    //     await page.goto(`/web/index.php/pim/viewUsTaxExemptions/empNumber/${employeeNumber}`);
    // });

    // test('Successful Update Report-to', async ({ page }) => {
    //     await page.goto(`/web/index.php/pim/viewReportToDetails/empNumber/${employeeNumber}`);
    // });

    // test('Successful Update Qualifications', async ({ page }) => {
    //     await page.goto(`/web/index.php/pim/viewQualifications/empNumber/${employeeNumber}`);
    // });

    // test('Successful Update Memberships', async ({ page }) => {
    //     await page.goto(`/web/index.php/pim/viewMemberships/empNumber/${employeeNumber}`);
    // });
});