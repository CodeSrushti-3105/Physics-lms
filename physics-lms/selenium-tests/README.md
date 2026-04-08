# Selenium Automated Tests
## Physics LMS Functional Testing

This directory contains automated functional tests for the S.B.Classes Physics Learning Management System using Selenium WebDriver.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- Chrome Browser installed
- Internet connection

### Installation

```bash
# Install dependencies
npm install
```

This will install:
- `selenium-webdriver` - Browser automation framework
- `chromedriver` - Chrome browser driver

## Running Tests

### Run Individual Tests

```bash
# Test 1: Homepage Load Test
node test1-homepage.js

# Test 2: Navigation Links Test
node test2-navigation.js

# Test 3: Login Page Test
node test3-login-page.js

# Test 4: Registration Page Test
node test4-register-page.js

# Test 5: Protected Routes Test
node test5-protected-routes.js
```

### Run All Tests

```bash
# Run complete test suite (headless - no browser window)
node run-all-tests.js

# Run with VISIBLE browser window
node test-with-browser.js

# Run demo test (visible browser, slower for demonstration)
node demo-test.js
```

## Test Files

| File | Description | Browser Visible? |
|------|-------------|------------------|
| `test1-homepage.js` | Verifies homepage loads with correct title | No (headless) |
| `test2-navigation.js` | Checks navigation elements presence | No (headless) |
| `test3-login-page.js` | Validates login page accessibility and form elements | No (headless) |
| `test4-register-page.js` | Validates registration page and form elements | No (headless) |
| `test5-protected-routes.js` | Tests authentication and route protection | No (headless) |
| `run-all-tests.js` | Executes all tests and provides summary | No (headless) |
| `test-with-browser.js` | Same as run-all-tests but with visible browser | Yes ✓ |
| `demo-test.js` | Demonstration test with slower navigation | Yes ✓ |

## Test Results

All tests run in **headless mode** (no visible browser window) for faster execution.

### Expected Output

```
============================================================
PHYSICS LMS - AUTOMATED TEST SUITE
============================================================

[TEST 1] Homepage Load Test
✓ PASSED - Title: S.B.Classes — Learning Management System

[TEST 2] Navigation Links Test
✓ PASSED - Navigation elements verified

[TEST 3] Login Page Accessibility Test
✓ PASSED - Login page accessible

[TEST 4] Registration Page Accessibility Test
✓ PASSED - Registration page accessible

[TEST 5] Protected Routes Test
✓ PASSED - Protected routes working correctly

============================================================
TEST EXECUTION SUMMARY
============================================================
Total Tests: 5
Passed: 5
Failed: 0
Success Rate: 100.00%
============================================================
```

## Test Coverage

- ✓ Homepage accessibility
- ✓ Navigation elements
- ✓ Login page functionality
- ✓ Registration page functionality
- ✓ Protected route security
- ✓ Authentication redirects

## Troubleshooting

### Chrome Driver Issues
If you encounter ChromeDriver errors:
```bash
npm install chromedriver --force
```

### Network Issues
Ensure you have a stable internet connection as tests access the production site at https://physics-lms.vercel.app

### Timeout Errors
If tests timeout, increase the sleep duration in test files:
```javascript
await driver.sleep(5000); // Increase from 3000 to 5000
```

## Notes

- Tests run against production environment (https://physics-lms.vercel.app)
- All tests use headless Chrome for faster execution
- Email verification tests are skipped (known production issue)
- Tests focus on public pages and authentication flow

## Documentation

For complete testing documentation, see:
- `../FUNCTIONAL_AUTOMATED_TESTING.md` - Full testing report
- `../TEST_RESULTS.md` - Test execution results

## Success Rate

**Current Status:** 100% Pass Rate (5/5 tests)
