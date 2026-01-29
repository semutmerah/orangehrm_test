import http from 'k6/http';
import { check, sleep } from 'k6';
import { loadEnv, getEnv } from './env-loader.js';

/**
 * Performance test for OrangeHRM Employee Creation API
 * 
 * Path: POST /web/index.php/api/v2/pim/employees
 * Authorization: Bearer <access_token>
 */

// Load variables from .env file (looked for in project root)
const envData = loadEnv();

export const options = {
    stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.05'],    // Allow slightly higher error rate for creation
    },
};

const BASE_URL = getEnv('BASE_URL', 'http://localhost:8080', envData);
const CREATE_EMPLOYEE_URL = `${BASE_URL}/web/index.php/api/v2/pim/employees`;
const ACCESS_TOKEN = getEnv('ACCESS_TOKEN', '', envData);

export default function () {
    // Generate unique employee data for each request
    const uniqueId = Math.floor(Math.random() * 1000000);
    const payload = JSON.stringify({
        firstName: `K6_User_${uniqueId}`,
        lastName: `Test_${uniqueId}`,
        middleName: '',
        employeeId: `EMP${uniqueId}`
    });

    const params = {
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
    };

    const response = http.post(CREATE_EMPLOYEE_URL, payload, params);

    console.log(`Response Status: ${response.status}`);
    console.log(`Response Body: ${response.body}`);

    check(response, {
        'is status 200 or 201': (r) => r.status === 200 || r.status === 201,
        'has employee data': (r) => {
            try {
                const json = r.json();
                return json.data !== undefined;
            } catch (e) {
                console.error(`Failed to parse JSON response: ${e}`);
                return false;
            }
        },
    });

    if (response.status >= 400) {
        console.error(`Employee creation failed: ${response.body}`);
    }

    sleep(1);
}
