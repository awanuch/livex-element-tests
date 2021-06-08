import { step, TestSettings, Until, By, TestData } from "@flood/element";

export const settings: TestSettings = {
    loopCount: 1,
    description: "NexTech AR - Front-end Load Test",
    screenshotOnFailure: true,
    disableCache: true,
    clearCache: true,
    clearCookies: true,
    actionDelay: 0.5,
    stepDelay: 0.5,
};

export default () => {
    // Config 
    // let url = "http://localhost:3000/?show=phoenix";
    // let url = "https://venue.events-nextechar.com/landing?show=phoenix";
    let url = "https://venue.events-nextechar.com/landing?show=phoenixloadtesting";
    let loginNavButton = "button[width=max-content]";
    let emailSelector = "input[type=email]";
    let passwordSelector = "input[type=password]";
    let loginButton = "button[class*=buttons__DefaultButton]";
    let styledNav = "[class*=Navbar__StyledNav"
    let headerTitle = "[class*=Header__Title]";

    TestData.fromData([
        { email: "test.user@nextechar.com", password: "TestPassword123!"},
    ])

    // Pauses the steps for x milliseconds.
    const delay = seconds => new Promise(res => setTimeout(res, seconds * 1000));

    // Reusable Navigator Function
    const Navigate = async (browser, selector) => {
        await browser.wait(Until.elementIsVisible(By.css(styledNav)))
        await browser.click(By.visibleText(selector));
        await browser.wait(Until.elementIsVisible(By.css(headerTitle)));
    }

    step("Open Login Modal", async (browser) => {
        await browser.visit(url);

        // Comment the last 2 commands if running local phoenix event.
        let loginNavButtonEl = By.css(loginNavButton)
        if(loginNavButtonEl) {
            await browser.wait(Until.elementIsVisible(By.css(loginNavButton)));
            await browser.click(By.css(loginNavButton));
        }
    });

    step("Login", async(browser, row) => {
        // Input Email
        await browser.wait(Until.elementIsVisible(By.css(emailSelector)));
        await browser.focus(By.css(emailSelector));
        // await browser.type(By.css(emailSelector), credsEmail);
        await browser.type(By.css(emailSelector), row.email);
        
        // Input Password
        await browser.focus(By.css(passwordSelector));
        // await browser.type(By.css(passwordSelector), credsPassword);
        await browser.type(By.css(passwordSelector), row.password);
        // Click Login.
        // await browser.click(By.css(loginButton));
        // Login using enter because we can't select the login button.
        await browser.sendKeys("Enter")
    })

    step("Navigate to Welcome Page", async (browser) => {
        await Navigate(browser, "Welcome Page");
        await delay(3);
    })

    step("Navigate to Auditorium", async (browser) => {
        await Navigate(browser, "Auditorium");
        await delay(15);
    })

    step("Navigate to Schedule", async (browser) => {
        await Navigate(browser, "Schedule");
        await delay(5);
    })

    step("Navigate to Presenters", async (browser) => {
        await Navigate(browser, "Presenters");
        await delay(3);
    })

    step("Navigate to Virtual Exhibits", async (browser) => {
        await Navigate(browser, "Virtual Exhibits");
        await delay(3);
    })

    step("Navigate to Attendees", async (browser) => {
        await Navigate(browser, "Attendees");
        await delay(3);
    })

};