import http from 'k6/http';
import { check, sleep } from 'k6';
import { browser } from 'k6/browser';
import { generateCodeVerifier, generateCodeChallenge, obtainAuthCode } from './pkce-utils.js';
import { loadEnv, getEnv } from './env-loader.js';

/**
 * Performance test for OrangeHRM Login API (OAuth 2.0 Token Endpoint)
 * 
 * Support loading from .env via env-loader.js
 * Automatically obtains AUTH_CODE if not provided (requires k6-browser)
 */

// Load variables from .env file
const envData = loadEnv();

export const options = {
    scenarios: {
        login: {
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1,
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    },
};

const BASE_URL = getEnv('BASE_URL', 'http://localhost:8080', envData);
const TOKEN_URL = `${BASE_URL}/web/index.php/oauth2/token`;

// Values from environment
const CLIENT_ID = getEnv('CLIENT_ID', '', envData);
const REDIRECT_URI = getEnv('REDIRECT_URI', 'https://oauth.pstmn.io/v1/callback', envData);
const USERNAME = getEnv('USERNAME', '', envData);
const PASSWORD = getEnv('PASSWORD', '', envData);

export async function setup() {
    // k6/browser is NOT supported in setup(). 
    // We generate PKCE values here and pass them to the default function.
    const verifier = getEnv('CODE_VERIFIER', '', envData) || generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    return { verifier, challenge };
}

export default async function (data) {
    let authCode = getEnv('AUTH_CODE', '', envData);
    const verifier = data.verifier;
    const challenge = data.challenge;

    // Automate AUTH_CODE retrieval if missing - This is now in the default function
    // where the browser module is supported.
    if (!authCode) {
        console.log('AUTH_CODE missing. Attempting to obtain it automatically via browser...');
        const authorizeUrl = `${BASE_URL}/web/index.php/oauth2/authorize?response_type=code&state=k6_test&code_challenge_method=S256&code_challenge=${challenge}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

        try {
            authCode = await obtainAuthCode(browser, {
                baseUrl: BASE_URL,
                authorizeUrl: authorizeUrl,
                username: USERNAME,
                password: PASSWORD
            });
            console.log(`Successfully obtained AUTH_CODE: ${authCode}`);
        } catch (e) {
            console.error(`Failed to obtain AUTH_CODE automatically: ${e}`);
            console.log('Please provide AUTH_CODE manually via .env or -e AUTH_CODE=...');
            return;
        }
    }

    const payload = {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: authCode,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
    };

    const params = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const response = http.post(TOKEN_URL, payload, params);

    if (response.status === 200) {
        console.log('------------------------------------------------------------');
        console.log('SUCCESS! Access Token obtained:');
        console.log(response.json().access_token);
        console.log('------------------------------------------------------------');
    } else {
        console.error(`Token Request Failed (Status ${response.status}): ${response.body}`);
    }

    check(response, {
        'is status 200': (r) => r.status === 200,
        'has access_token': (r) => r.json().access_token !== undefined,
    });

    sleep(1);
}
