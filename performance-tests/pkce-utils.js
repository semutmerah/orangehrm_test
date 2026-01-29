import crypto from 'k6/crypto';

/**
 * PKCE Utility for k6
 * Formats: [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"
 */

export function generateCodeVerifier() {
    const length = 128;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const bytes = crypto.randomBytes(length);
    const view = new Uint8Array(bytes);

    let verifier = '';
    for (let i = 0; i < length; i++) {
        verifier += possible[view[i] % possible.length];
    }

    return verifier;
}

export function generateCodeChallenge(verifier) {
    // k6 crypto.sha256 supports 'base64url' output directly which is perfect for PKCE
    // Remove any padding characters that might be included
    return crypto.sha256(verifier, 'base64url').replace(/=/g, '');
}

/**
 * Automate obtaining an Authorization Code using k6/browser.
 * This should only be called once in the setup() function.
 * Note: Requires k6 to be run with browser support enabled.
 */
export async function obtainAuthCode(browser, config) {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 1. Visit Login Page
        console.log(`Navigating to login page: ${config.baseUrl}/web/index.php/auth/login`);
        await page.goto(`${config.baseUrl}/web/index.php/auth/login`);

        // 2. Perform Login
        // Wait for the form to appear
        const usernameSelector = 'input[name="username"]';
        await page.waitForSelector(usernameSelector, { state: 'visible', timeout: 30000 });

        console.log('Filling login form...');
        await page.locator(usernameSelector).fill(config.username || 'Admin');
        await page.locator('input[name="password"]').fill(config.password || 'Admin@54321');

        await Promise.all([
            page.waitForNavigation({ timeout: 30000 }),
            page.locator('button[type="submit"]').click(),
        ]);

        console.log(`Navigating to authorize URL: ${config.authorizeUrl}`);
        // 3. Visit Authorize URL
        await page.goto(config.authorizeUrl);

        // 4. Click Authorize / Allow Access Button
        const allowButtonSelector = 'button[type="submit"]';

        console.log('Waiting for authorization consent screen...');
        await page.waitForSelector(allowButtonSelector, { state: 'visible', timeout: 10000 });

        console.log('Clicking Allow/Authorize button...');
        await Promise.all([
            page.waitForNavigation({ timeout: 10000 }),
            page.locator(allowButtonSelector).click(),
        ]);

        // 5. Extract code from redirect URL
        // Wait a moment for the URL to be fully processed
        await page.waitForTimeout(1000);
        const url = page.url();
        console.log(`Current URL after navigation: ${url}`);
        const codeMatch = url.match(/[?&]code=([^&]+)/);

        if (!codeMatch) {
            throw new Error(`Failed to obtain authorization code. Current URL: ${url}`);
        }

        return codeMatch[1];
    } finally {
        await page.close();
        await context.close();
    }
}
