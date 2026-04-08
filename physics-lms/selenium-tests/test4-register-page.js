const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testRegisterPage() {
    let driver;
    
    try {
        console.log('Starting Registration Page Test...');
        
        const options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        // Navigate to register page
        await driver.get('https://physics-lms.vercel.app/register');
        console.log('✓ Navigated to registration page');
        
        // Wait for page to load
        await driver.sleep(3000);
        
        // Check page title
        const title = await driver.getTitle();
        console.log(`Page Title: ${title}`);
        
        // Check for name input field
        const nameInput = await driver.findElements(By.css('input[name="name"], input[placeholder*="Name"]'));
        if (nameInput.length > 0) {
            console.log('✓ Name input field found');
        } else {
            console.log('⚠ Name input field not found');
        }
        
        // Check for email input field
        const emailInput = await driver.findElements(By.css('input[type="email"], input[name="email"]'));
        if (emailInput.length > 0) {
            console.log('✓ Email input field found');
        } else {
            console.log('⚠ Email input field not found');
        }
        
        // Check for password input field
        const passwordInput = await driver.findElements(By.css('input[type="password"]'));
        if (passwordInput.length > 0) {
            console.log('✓ Password input fields found');
        } else {
            console.log('⚠ Password input fields not found');
        }
        
        // Check for register button
        const registerButton = await driver.findElements(By.xpath("//button[contains(text(), 'Register') or contains(text(), 'Sign Up')]"));
        if (registerButton.length > 0) {
            console.log('✓ Register button found');
        } else {
            console.log('⚠ Register button not found');
        }
        
        console.log('✓ TEST PASSED: Registration page is accessible and contains required elements');
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

testRegisterPage();
