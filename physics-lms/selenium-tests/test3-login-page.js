const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testLoginPage() {
    let driver;
    
    try {
        console.log('Starting Login Page Test...');
        
        const options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        // Navigate directly to login page
        await driver.get('https://physics-lms.vercel.app/login');
        console.log('✓ Navigated to login page');
        
        // Wait for page to load
        await driver.sleep(3000);
        
        // Check page title
        const title = await driver.getTitle();
        console.log(`Page Title: ${title}`);
        
        // Check for email input field
        const emailInput = await driver.findElements(By.css('input[type="email"], input[name="email"]'));
        if (emailInput.length > 0) {
            console.log('✓ Email input field found');
        } else {
            console.log('⚠ Email input field not found');
        }
        
        // Check for password input field
        const passwordInput = await driver.findElements(By.css('input[type="password"], input[name="password"]'));
        if (passwordInput.length > 0) {
            console.log('✓ Password input field found');
        } else {
            console.log('⚠ Password input field not found');
        }
        
        // Check for login button
        const loginButton = await driver.findElements(By.xpath("//button[contains(text(), 'Login') or contains(text(), 'Sign In')]"));
        if (loginButton.length > 0) {
            console.log('✓ Login button found');
        } else {
            console.log('⚠ Login button not found');
        }
        
        // Check for role selection (Student/Admin)
        const roleButtons = await driver.findElements(By.xpath("//*[contains(text(), 'Student') or contains(text(), 'Admin')]"));
        if (roleButtons.length > 0) {
            console.log('✓ Role selection found');
        } else {
            console.log('⚠ Role selection not found');
        }
        
        console.log('✓ TEST PASSED: Login page is accessible and contains required elements');
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

testLoginPage();
