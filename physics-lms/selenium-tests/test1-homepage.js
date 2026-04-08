const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testHomepage() {
    let driver;
    
    try {
        console.log('Starting Homepage Load Test...');
        
        // Set up Chrome options
        const options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        
        // Initialize WebDriver
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        // Navigate to homepage
        await driver.get('https://physics-lms.vercel.app');
        console.log('✓ Navigated to homepage');
        
        // Wait for page to load
        await driver.sleep(3000);
        
        // Get page title
        const title = await driver.getTitle();
        console.log(`Page Title: ${title}`);
        
        // Verify title
        if (title.includes('S.B.Classes') || title.includes('Physics') || title.includes('LMS')) {
            console.log('✓ TEST PASSED: Homepage loaded successfully');
            console.log('✓ Page title verified');
            return true;
        } else {
            console.log('✗ TEST FAILED: Incorrect page title');
            return false;
        }
        
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

// Run the test
testHomepage();
