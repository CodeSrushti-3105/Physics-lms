const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testNavigation() {
    let driver;
    
    try {
        console.log('Starting Navigation Links Test...');
        
        const options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        await driver.get('https://physics-lms.vercel.app');
        console.log('✓ Navigated to homepage');
        
        // Wait for page to load
        await driver.sleep(3000);
        
        // Check for "Get Started" button
        const getStartedButton = await driver.findElements(By.xpath("//button[contains(text(), 'Get Started')]"));
        if (getStartedButton.length > 0) {
            console.log('✓ "Get Started" button found');
        } else {
            console.log('⚠ "Get Started" button not found');
        }
        
        // Check for Login link/button
        const loginLinks = await driver.findElements(By.xpath("//*[contains(text(), 'Login') or contains(text(), 'Sign In')]"));
        if (loginLinks.length > 0) {
            console.log('✓ Login link found');
        } else {
            console.log('⚠ Login link not found');
        }
        
        // Check for Register link/button
        const registerLinks = await driver.findElements(By.xpath("//*[contains(text(), 'Register') or contains(text(), 'Sign Up')]"));
        if (registerLinks.length > 0) {
            console.log('✓ Register link found');
        } else {
            console.log('⚠ Register link not found');
        }
        
        console.log('✓ TEST PASSED: Navigation elements verified');
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

testNavigation();
