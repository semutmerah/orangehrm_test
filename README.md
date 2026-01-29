# OrangeHRM Playwright E2E Tests

This repository contains the end-to-end (E2E) testing suite for the OrangeHRM application, built using [Playwright](https://playwright.dev/).

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd orangehrm_test
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Copy the template environment file and fill in your credentials.
    ```bash
    cp .env.example .env.staging
    # Edit .env.staging with your target URL and Admin credentials
    ```

4.  **Start OrangeHRM via Docker:**
    To run the application locally for testing:
    ```bash
    docker compose up -d
    ```
    The application will be accessible at [http://localhost:8080](http://localhost:8080).

---

## 🧪 Test Execution

### Local Execution

The project uses environment-specific scripts defined in `package.json`.

| Environment | Command | Description |
| :--- | :--- | :--- |
| **Staging** | `npm run test:staging` | Runs all tests against the staging environment. |
| **Production** | `npm run test:production` | Runs all tests against the production environment. |
| **Smoke** | `npm run test:smoke` | Runs tests tagged with `@smoke`. |
| **Headed** | `npm run test:staging:headed` | Runs tests in headed mode. |
| **UI Mode** | `npm run test:staging:ui` | Opens Playwright UI for interactive testing. |

### Docker Execution

You can also run tests within a Docker container to ensure environment parity:

```bash
# Start the system and run tests in the 'test' profile
docker compose --profile test up --build
```

### CI/CD Execution

Tests are automatically triggered via GitHub Actions on specific events or manually via `workflow_dispatch`.

- **Staging Pipeline**: `.github/workflows/staging-playwright.yml`
- **Production Pipeline**: `.github/workflows/prod-playwright.yml`

**Features of our CI/CD implementation:**
- **Sharding**: Tests are split into multiple shards (e.g., 2 shards) to run in parallel, reducing execution time.
- **Artifacts**: Playwright reports and trace files are uploaded for each shard and merged into a final report.
- **Secrets Management**: Credentials and base URLs are managed via GitHub Secrets.

---

## 📐 Key Design Decisions

### 1. Page Object Model (POM)
I follow the POM pattern to separate test logic from page-specific actions and locators. This improves maintainability and reusability.
- Locators and actions are defined in `e2e-tests/pages/`.
- Tests are focused on business flows and assertions.

### 2. Centralized Environment Configuration
Instead of hardcoding URLs and credentials, I use a dynamic configuration loader (`e2e-tests/config/environment.ts`).
- Supports `.env.staging`, `.env.production`.
- Automatically picks up environment variables in CI/CD.
- Provides a single source of truth for the entire framework.

### 3. Global Authentication (Setup Project)
To optimize performance, I use Playwright's "Setup" project feature:
- `auth.setup.ts` performs the login once and saves the storage state to `e2e-tests/.auth/user.json`.
- Subsequent tests reuse this state to skip the login step, significantly speeding up the suite.

### 4. Test Isolation & Dynamic Data
- Tests are designed to be independent.
- I use `@faker-js/faker` for generating dynamic test data (names, usernames, etc.) to avoid collision and ensure tests remain idempotent.

### 5. Robust Locators
Prioritizing Playwright's recommended locators (e.g., `getByRole`, `getByLabel`, `getByText`) over fragile CSS or XPath selectors to ensure tests are resilient to UI changes.

---

## 📊 Reporting

After test execution, a consolidated HTML report is generated.
- **Local**: Open it using `npx playwright show-report`.
- **CI/CD**: Download the `playwright-report-final` artifact from the GitHub Action run summary.
