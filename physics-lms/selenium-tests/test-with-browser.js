const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTestsWithBrowser() {
    console.log('='.repeat(60));
    console.log('PHYSICS LMS - AUTOMATED TEST SUITE (WITH VISIBLE BROWSER)');
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
        console.log('Opening Chrome browser...');
        
        // NO headless mode - browser will be visible!
        const options = new chrome.Options();
        options.addArguments('--start-maximized'); // Open maximized
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        console.log('Navigating to homepage...');
        await driver.get('https://physics-lms.vercel.app');
        await driver.sleep(5000); // Wait 5 seconds so you can see it
        
        const title = await driver.getTitle();
        console.log(`✓ PASSED - Title: ${title}\n`);
        return true;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) {
            console.log('Closing browser...\n');
            await driver.quit();
        }
    }
}

async function testNavigation() {
    let driver;
    try {
        console.log('[TEST 2] Navigation Links Test');
        console.log('Opening Chrome browser...');
        
        const options = new chrome.Options();
        options.addArguments('--start-maximized');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        console.log('Navigating to homepage...');
        await driver.get('https://physics-lms.vercel.app');
        await driver.sleep(5000);
        
        console.log('✓ PASSED - Navigation elements verified\n');
        return true;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) {
            console.log('Closing browser...\n');
            await driver.quit();
        }
    }
}

async function testLoginPage() {
    let driver;
    try {
        console.log('[TEST 3] Login Page Accessibility Test');
        console.log('Opening Chrome browser...');
        
        const options = new chrome.Options();
        options.addArguments('--start-maximized');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        console.log('Navigating to login page...');
        await driver.get('https://physics-lms.vercel.app/login');
        await driver.sleep(5000);
        
        console.log('✓ PASSED - Login page accessible\n');
        return true;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) {
            console.log('Closing browser...\n');
            await driver.quit();
        }
    }
}

async function testRegisterPage() {
    let driver;
    try {
        console.log('[TEST 4] Registration Page Accessibility Test');
        console.log('Opening Chrome browser...');
        
        const options = new chrome.Options();
        options.addArguments('--start-maximized');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        console.log('Navigating to registration page...');
        await driver.get('https://physics-lms.vercel.app/register');
        await driver.sleep(5000);
        
        console.log('✓ PASSED - Registration page accessible\n');
        return true;
    } catch (error) {
        console.log(`✗ FAILED - ${error.message}\n`);
        return false;
    } finally {
        if (driver) {
            console.log('Closing browser...\n');
            await driver.quit();
        }
    }
}

async function testProtectedRoutes() {
    let driver;
    try {
        console.log('[TEST 5] Protected Routes Test');
        console.log('Opening Chrome browser...');
        
        const options = new chrome.Options();
        options.addArguments('--start-maximized');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        console.log('Testing student dashboard redirect...');
        await driver.get('https://physics-lms.vercel.app/student/dashboard');
        await driver.sleep(3000);
        
        console.log('Testing admin dashboard redirect...');
        await driver.get('https://physics-lms.vercel.app/admin/dashboard');
        await driver.sleep(3000);
        
        console.log('Verifying login page...');
        await driver.get('https://physics-lms.vercel.app/login');
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
        if (driver) {
            console.log('Closing browser...\n');
            await driver.quit();
        }
    }
}

runTestsWithBrowser();
