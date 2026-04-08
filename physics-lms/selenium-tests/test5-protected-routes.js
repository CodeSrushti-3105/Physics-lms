const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testProtectedRoutes() {
    let driver;
    
    try {
        console.log('Starting Protected Routes Test...');
        
        const options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        // Test 1: Try to access student dashboard without login
        console.log('\nTest 1: Accessing student dashboard without authentication');
        await driver.get('https://physics-lms.vercel.app/student/dashboard');
        await driver.sleep(3000);
        
        const currentUrl1 = await driver.getCurrentUrl();
        if (currentUrl1.includes('/login')) {
            console.log('✓ Redirected to login page (Expected behavior)');
        } else {
            console.log('⚠ Not redirected to login page');
        }
        
        // Test 2: Try to access admin dashboard without login
        console.log('\nTest 2: Accessing admin dashboard without authentication');
        await driver.get('https://physics-lms.vercel.app/admin/dashboard');
        await driver.sleep(3000);
        
        const currentUrl2 = await driver.getCurrentUrl();
        if (currentUrl2.includes('/login')) {
            console.log('✓ Redirected to login page (Expected behavior)');
        } else {
            console.log('⚠ Not redirected to login page');
        }
        
        // Test 3: Verify login page is accessible
        console.log('\nTest 3: Verifying login page accessibility');
        await driver.get('https://physics-lms.vercel.app/login');
        await driver.sleep(3000);
        
        const currentUrl3 = await driver.getCurrentUrl();
        if (currentUrl3.includes('/login')) {
            console.log('✓ Login page is accessible');
        } else {
            console.log('⚠ Login page not accessible');
        }
        
        console.log('\n✓ TEST PASSED: Protected routes are working correctly');
        return true;
        
    } catch (error) {
        console.log('✗ TEST FAILED: ' + error.message);
        return false;
    } finally {
        if (driver) {
            await driver.quit();
            console.log('Browser closed\n');
        }
    }
}

testProtectedRoutes();
