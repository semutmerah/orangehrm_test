/**
 * Simple .env file loader for k6
 * Since k6 doesn't natively support dotenv, this utility uses open()
 * to read and parse .env files during the init stage.
 */

export function loadEnv(filePath = './.env') {
    let envVars = {};

    try {
        // k6 open() reads the file content
        const content = open(filePath);

        content.split('\n').forEach(line => {
            // Ignore comments and empty lines
            if (!line || line.startsWith('#') || !line.includes('=')) {
                return;
            }

            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=').trim();

            // Remove quotes if present
            const cleanKey = key.trim();
            const cleanValue = value.replace(/^["']|["']$/g, '');

            envVars[cleanKey] = cleanValue;
        });
    } catch (e) {
        // If file doesn't exist, we just return empty object
        // k6 will throw if open() fails, so we catch it
    }

    return envVars;
}

/**
 * Get environment variable with fallback to k6 __ENV
 */
export function getEnv(key, defaultValue, envData = {}) {
    if (envData[key] !== undefined) return envData[key];
    if (__ENV[key] !== undefined) return __ENV[key];
    return defaultValue;
}
