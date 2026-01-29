# OrangeHRM Performance Tests (k6)

This folder contains performance test scripts for the OrangeHRM REST API using [k6](https://k6.io/).

## 📋 Prerequisites
- **[k6](https://k6.io/docs/getting-started/installation/)** (v0.43.0+) installed on your machine.
- **OrangeHRM instance** running at `http://localhost:8080`.
- **Environment config**: A `.env` file inside the `performance-tests` folder with valid credentials.

## 🚀 Setup & Configuration

The scripts support loading environment variables from a `.env` file located inside the `performance-tests` directory.

### 1. Initialize environment
Copy the example file and fill in your actual OrangeHRM credentials:
```bash
cp .env.example .env
```

### 2. Required Variables
| Variable | Description | Notes |
|----------|-------------|-------|
| `BASE_URL` | OrangeHRM Base URL | Default: `http://localhost:8080` |
| `CLIENT_ID` | OAuth Client ID | Registered in OrangeHRM Admin |
| `USERNAME` | Admin Username | Used for automated login |
| `PASSWORD` | Admin Password | Used for automated login |
| `ACCESS_TOKEN`| Bearer Token | Needed for `employee-creation.js` |

---

### Running the Tests
Navigate to this folder and run the scripts:

```bash
cd performance-tests

# 1. Login API (Token Endpoint)
k6 run login-api.js

# 2. Employee Creation API
k6 run employee-creation.js
```

**Note on Login API:**
Access Codes are single-use. This script is primarily used to obtain a `ACCESS_TOKEN` which you can then copy into your `.env` for the employee creation tests.

---

## 🛠️ Performance Utilities

- **`pkce-utils.js`**: Reusable logic for PKCE (Verifier/Challenge) and browser-based `AUTH_CODE` retrieval.
- **`env-loader.js`**: Custom utility to load `.env` files into k6.

## 📈 Analysis
Each script is configured with `stages` (ramp-up/down) and `thresholds` (SLA checks).
- **HTTP Duration**: 95% of requests should be < 500ms for login and < 1500ms for employee creation.
- **Error Rate**: Should be less than 5% for creation tasks.

> **Note:** The `login-api.js` is configured to run for exactly **one iteration**. This is because OAuth Authorization Codes are single-use. The script acts as a utility to obtain a Bearer token which you can then use for other load tests.
