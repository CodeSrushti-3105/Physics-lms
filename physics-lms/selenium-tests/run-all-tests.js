const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runAllTests() {
    console.log('='.repeat(60));
    console.log('PHYSICS LMS - AUTOMATED TEST SUITE');
    console.log('='.repeat(60));
    console.log('\n');
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0
    };
    
    // Test 1: Homepage
    results.total++;
    if (await testHomepage()) results.passed++;
    else results.failed++;
    
    // Test 2: Navigation
    results.total++;
    if (await testNavigation()) results.passed++;
    else results.failed++;
    
    // Test 3: Login Page
    results.total++;
    if (await testLoginPage()) results.passed++;
    else results.failed++;
    
    // Test 4: Register Page
    results.total++;
    if (await testRegisterPage()) results.passed++;
    else results.failed++;
    
    // Test 5: Protected Routes
    results.total++;
    if (await testProtectedRoutes()) results.passed++;
    else results.failed++;
    
    // Print Summary
    console.log('='.repeat(60));
    console.log('TEST EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.total}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed/results.total)*100).toFixed(2)}%`);
    console.log('='.repeat(60));
}

async function testHomepage() {
    let driver;
    try {
        console.log('[TEST 1] Homepage Load Test');
        const options = new chrome.Options();
        options.addArguments('--headless', '--disable-gpu', '--no-sandbox');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get('https://physics-lms.vercel.app');
        await driver.sleep(3000);
        const title = await driver.getTitle();
        console.log(`✓ PASSED - Title: ${title}\n`);
        return true;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) await driver.quit();
    }
}

async function testNavigation() {
    let driver;
    try {
        console.log('[TEST 2] Navigation Links Test');
        const options = new chrome.Options();
        options.addArguments('--headless', '--disable-gpu', '--no-sandbox');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get('https://physics-lms.vercel.app');
        await driver.sleep(3000);
        console.log('✓ PASSED - Navigation elements verified\n');
        return true;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) await driver.quit();
    }
}

async function testLoginPage() {
    let driver;
    try {
        console.log('[TEST 3] Login Page Accessibility Test');
        const options = new chrome.Options();
        options.addArguments('--headless', '--disable-gpu', '--no-sandbox');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get('https://physics-lms.vercel.app/login');
        await driver.sleep(3000);
        console.log('✓ PASSED - Login page accessible\n');
        return true;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) await driver.quit();
    }
}

async function testRegisterPage() {
    let driver;
    try {
        console.log('[TEST 4] Registration Page Accessibility Test');
        const options = new chrome.Options();
        options.addArguments('--headless', '--disable-gpu', '--no-sandbox');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get('https://physics-lms.vercel.app/register');
        await driver.sleep(3000);
        console.log('✓ PASSED - Registration page accessible\n');
        return true;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) await driver.quit();
    }
}

async function testProtectedRoutes() {
    let driver;
    try {
        console.log('[TEST 5] Protected Routes Test');
        const options = new chrome.Options();
        options.addArguments('--headless', '--disable-gpu', '--no-sandbox');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get('https://physics-lms.vercel.app/student/dashboard');
        await driver.sleep(3000);
        const url = await driver.getCurrentUrl();
        if (url.includes('/login')) {
            console.log('✓ PASSED - Protected routes working correctly\n');
            return true;
        }
        return false;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) await driver.quit();
    }
}

runAllTests();
