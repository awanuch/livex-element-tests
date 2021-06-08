import { step, TestSettings, Until, By, TestData } from "@flood/element";
import {
    name as fakeName,
    company as fakeJob
} from 'faker';

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
    // let url = "http://localhost:3000/?show=phoenix"; // Make sure you're running the master branch!
    // let url = "http://localhost:3000/?show=phoenixloadtesting"; // Make sure you're running the master branch!
    // let url = "https://venue.events-nextechar.com/landing?show=phoenix";
    let url = "https://venue.events-nextechar.com/landing?show=phoenixloadtesting";
    let loginNavButton = "button[width=max-content]";
    let styledNav = "[class*=Navbar__StyledNav"
    let headerTitle = "[class*=Header__Title]";

    let inputFirstName = "input[name=firstName]";
    let inputLastName = "input[name=lastName]";
    let inputCompanyName = "input[name=companyName]";
    let inputEmail = "input[name=email]";
    let inputPassword = "input[name=password]";

    // Fake Data
    let credFirstName = fakeName.firstName();
    let credLastName = fakeName.lastName();
    let credEmail = `${credFirstName.toLowerCase()}.${credLastName.toLowerCase()}@mailinator.com`;
    let credCompany = fakeJob.companyName();
    let credPassword = "TestPassword123!";

    TestData.fromData([
        { email: "test.user@nextechar.com", password: "TestPassword123!" },
    ])

    // Pauses the steps for x milliseconds.
    const delay = seconds => new Promise(res => setTimeout(res, seconds * 1000));

    // Reusable Navigator Function
    const Navigate = async (browser, selector) => {
        await browser.wait(Until.elementIsVisible(By.css(styledNav)))
        await browser.click(By.visibleText(selector));
        await browser.wait(Until.elementIsVisible(By.css(headerTitle)));
    }

    step("Register as New User", async (browser) => {

        await browser.visit(url);

        let loginNavButtonEl = By.css(loginNavButton)
        if (loginNavButtonEl) {
            await browser.wait(Until.elementIsVisible(By.css(loginNavButton)));
            await browser.click(By.css(loginNavButton));
        }

        await browser.click(By.visibleText("Register"));
        await browser.type(By.css(inputFirstName), credFirstName);
        await browser.type(By.css(inputLastName), credLastName);
        await browser.type(By.css(inputCompanyName), credCompany);
        await browser.type(By.css(inputEmail), credEmail);
        await browser.type(By.css(inputPassword), credPassword);
        await browser.sendKeys("Enter");

        // Wait until video loads and watch to the end.
        await browser.wait(Until.elementIsVisible(By.css(".motion-bg")))
        await delay(22);
    });

    step("Navigate to Home Page", async (browser) => {
        await Navigate(browser, "Home");
        await delay(3);
    })

    step("Navigate to Live Now Page", async (browser) => {
        await Navigate(browser, "Live Now");
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
        await Navigate(browser, "Exhibit Showcase");
        await delay(3);
    })

    step("Navigate to Attendees", async (browser) => {
        await Navigate(browser, "Attendees");
        await delay(3);
    })

};