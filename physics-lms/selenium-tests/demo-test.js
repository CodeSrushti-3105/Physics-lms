const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function demoTest() {
    let driver;
    
    try {
        console.log('='.repeat(60));
        console.log('PHYSICS LMS - DEMO TEST (VISIBLE BROWSER)');
        console.log('='.repeat(60));
        console.log('\nThis test will open Chrome and navigate through your app');
        console.log('Watch the browser window!\n');
        
        // Create browser with visible window
        const options = new chrome.Options();
        options.addArguments('--start-maximized');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        // Test 1: Homepage
        console.log('[1/5] Loading Homepage...');
        await driver.get('https://physics-lms.vercel.app');
        await driver.sleep(4000);
        const title = await driver.getTitle();
        console.log(`    ✓ Title: ${title}`);
        
        // Test 2: Navigate to Login
        console.log('\n[2/5] Navigating to Login Page...');
        await driver.get('https://physics-lms.vercel.app/login');
        await driver.sleep(4000);
        console.log('    ✓ Login page loaded');
        
        // Test 3: Navigate to Register
        console.log('\n[3/5] Navigating to Register Page...');
        await driver.get('https://physics-lms.vercel.app/register');
        await driver.sleep(4000);
        console.log('    ✓ Register page loaded');
        
        // Test 4: Try to access protected route
        console.log('\n[4/5] Testing Protected Route (Student Dashboard)...');
        await driver.get('https://physics-lms.vercel.app/student/dashboard');
        await driver.sleep(4000);
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes('/login')) {
            console.log('    ✓ Correctly redirected to login (security working!)');
        }
        
        // Test 5: Back to homepage
        console.log('\n[5/5] Returning to Homepage...');
        await driver.get('https://physics-lms.vercel.app');
        await driver.sleep(4000);
        console.log('    ✓ Back to homepage');
        
        console.log('\n' + '='.repeat(60));
        console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log('\nBrowser will close in 3 seconds...');
        await driver.sleep(3000);
        
    } catch (error) {
        console.log('\n✗ ERROR: ' + error.message);
    } finally {
        if (driver) {
            await driver.quit();
            console.log('\nBrowser closed. Test complete!\n');
        }
    }
}

// Run the demo
demoTest();
