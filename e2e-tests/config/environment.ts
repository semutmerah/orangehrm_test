import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Environment configuration helper
 * Loads environment-specific configuration from .env files
 */

// Determine which environment to use (default to staging)
const ENV = process.env.ENV || 'staging';

// Load the appropriate .env file
const envPath = path.resolve(__dirname, `../../.env.${ENV}`);

// Only load if the file exists
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

export interface EnvironmentConfig {
    baseURL: string;
    username: string;
    password: string;
    environment: string;
}

/**
 * Get the current environment configuration
 */
export function getConfig(): EnvironmentConfig {
    const baseURL = process.env.BASE_URL || 'http://localhost:8080';
    const username = process.env.USERNAME || 'DummyUser';
    const password = process.env.PASSWORD || 'DummyPassword';

    return {
        baseURL,
        username,
        password,
        environment: ENV,
    };
}

/**
 * Validate that all required environment variables are set
 */
export function validateConfig(): void {
    const config = getConfig();

    if (!process.env.BASE_URL || !process.env.USERNAME || !process.env.PASSWORD) {
        console.warn(`⚠ Warning: Using default configuration. To use environment-specific config, create .env.${ENV} file.`);
    } else {
        console.log(`✓ Environment configuration loaded successfully for: ${config.environment}`);
        console.log(`  Base URL: ${config.baseURL}`);
        console.log(`  Username: ${config.username}`);
    }
}
