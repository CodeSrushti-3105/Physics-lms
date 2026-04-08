# Quick Start Guide
## Running Selenium Tests for Physics LMS

This is a quick reference for running automated tests.

## One-Time Setup

```bash
# 1. Navigate to test directory
cd selenium-tests

# 2. Install dependencies
npm install
```

## Run Tests

### Option 1: Run All Tests - Fast (No Browser Window)
```bash
node run-all-tests.js
```

### Option 2: Run All Tests - With Visible Browser
```bash
node test-with-browser.js
```

### Option 3: Run Demo Test - Slow & Visible (Best for Watching)
```bash
node demo-test.js
```

### Option 4: Run Individual Tests
```bash
node test1-homepage.js        # Homepage test
node test2-navigation.js      # Navigation test
node test3-login-page.js      # Login page test
node test4-register-page.js   # Register page test
node test5-protected-routes.js # Security test
```

## Expected Result

```
============================================================
PHYSICS LMS - AUTOMATED TEST SUITE
============================================================

[TEST 1] Homepage Load Test
✓ PASSED

[TEST 2] Navigation Links Test
✓ PASSED

[TEST 3] Login Page Accessibility Test
✓ PASSED

[TEST 4] Registration Page Accessibility Test
✓ PASSED

[TEST 5] Protected Routes Test
✓ PASSED

============================================================
TEST EXECUTION SUMMARY
============================================================
Total Tests: 5
Passed: 5
Failed: 0
Success Rate: 100.00%
============================================================
```

## Troubleshooting

**Problem:** Tests fail to start  
**Solution:** Run `npm install` again

**Problem:** Chrome driver error  
**Solution:** Run `npm install chromedriver --force`

**Problem:** Network timeout  
**Solution:** Check internet connection

## That's It!

Tests run automatically in headless Chrome browser. No manual interaction needed.

For detailed documentation, see `../FUNCTIONAL_AUTOMATED_TESTING.md`
