import { step, TestSettings, Until, By, TestData } from "@flood/element";
import {
    name as fakeName,
    company as fakeJob
} from 'faker';

export const settings: TestSettings = {
    loopCount: 1,
    description: "LiveX - Front-end Load Test - Register New User",
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

        // Wait until video loads then end the test.
        await browser.wait(Until.elementIsVisible(By.css(".motion-bg")))
        // await delay(22);
    });

};