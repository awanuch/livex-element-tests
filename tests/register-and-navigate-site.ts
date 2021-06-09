import { step, TestSettings, Until, By, TestData, Condition, beforeEach, afterEach, afterAll, beforeAll } from "@flood/element";
import {
    name as fakeName,
    company as fakeJob,
    random
} from 'faker';

export const settings: TestSettings = {
    // loopCount: 15,
    loopCount: 1,
    description: "LiveX - Front-end Load Test - Register and navigate site.",
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

    let settingsOverlayButton = "img[src*=default_profile_picture]";

    // Fake Data
    let credFirstName = fakeName.firstName();
    let credLastName = fakeName.lastName();
    let credEmail = `${credFirstName.toLowerCase()}.${credLastName.toLowerCase()}@mailinator.com`;
    let credCompany = fakeJob.companyName();
    let credPassword = "TestPassword123!";

    let credentialsCreated = false;

    // Pauses the steps for x milliseconds.
    const delay = seconds => new Promise(res => setTimeout(res, seconds * 1000));

    // Randomly delays between min/max (10/20 default) seconds.
    const randDelay = (min = 10, max = 20) => new Promise(res => setTimeout(res, Math.floor(Math.random() * (max - min + 1) + min) * 1000));

    let messages = []
    const log = (message) => {
        messages.push(message);
    }
    const printIssues = () => {
        for(let msg of messages) {
            console.log(msg);
        }
    }

    // Reusable Navigator Function
    const Navigate = async (browser, selector) => {
        await browser.wait(Until.elementIsVisible(By.css(styledNav)))
        await browser.click(By.visibleText(selector));
        await browser.wait(Until.elementIsVisible(By.css(headerTitle)));
    }

    const PickPresenter = async (browser, presenter) => {
        await browser.click(By.visibleText(presenter));
        await browser.wait(Until.elementIsVisible(By.visibleText("Back")));
        await randDelay(4, 8);
        let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
        await browser.click(By.css(selector))
        await randDelay(1, 3);
        await browser.click(By.visibleText("Back"));
        await randDelay(1, 3);
        await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
        await randDelay(1, 3);
    }

    beforeAll(async (browser) => {
        await browser.visit(url);
        let loginNavButtonEl = By.css(loginNavButton)
        if (loginNavButtonEl) {
            await browser.wait(Until.elementIsVisible(By.css(loginNavButton)));
            await browser.click(By.css(loginNavButton));
        }
    })

    step.unless(() => credentialsCreated == false, "Log into the platform", async (browser) => {
        await browser.type(By.css(inputEmail), credEmail);
        await browser.type(By.css(inputPassword), credPassword);
        await browser.sendKeys("Enter");
    })

    step.once("Register as New User", async (browser) => {

        await browser.click(By.visibleText("Register"));
        await browser.type(By.css(inputFirstName), credFirstName);
        await browser.type(By.css(inputLastName), credLastName);
        await browser.type(By.css(inputCompanyName), credCompany);
        await browser.type(By.css(inputEmail), credEmail);
        await browser.type(By.css(inputPassword), credPassword);
        await browser.sendKeys("Enter");

        // Wait until video loads and watch to the end.
        await browser.wait(Until.elementIsVisible(By.css(".motion-bg")))
        credentialsCreated = true;
        // await delay(22);
        await delay(1);
    });

    step("Navigate to Home Page", async (browser) => {
        await Navigate(browser, "Home");
        await randDelay(1, 2);
    })

    step("Navigate to Live Now Page", async (browser) => {
        await Navigate(browser, "Live Now");
        await randDelay(3, 5);
    })

    step.once("Interact with Poll", async (browser) => {
        // Interact with the poll
        let randomChoice = (random.number(4) + 1)
        // let element = await browser.findElement(By.attr("input", "id", "Choice_"+randomChoice));
        let element = await browser.findElement(By.visibleText(randomChoice.toString()));
        try {
            await browser.click(element);
            await randDelay(1, 3);
            await browser.click(By.visibleText("Submit"));
            await randDelay(3, 5);
            await browser.click(By.visibleText("Next"));
        } catch (e) {
            log("Poll interaction failed. Probably no poll.");
        }
        await randDelay(3, 5);
    })

    step("Navigate to Schedule", async (browser) => {
        await Navigate(browser, "Schedule");

        // Bookmark events
        await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
        for (let i = 1; i < 4; i++) {
            let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
            await browser.click(By.css(selector))
            await delay(2);
        }

        await browser.wait(Until.elementIsVisible(By.visibleText("Check In")));
        await browser.click(By.visibleText("Check In"))

        await randDelay(5, 10);
    })

    step("Navigate to Presenters", async (browser) => {
        await Navigate(browser, "Presenters");

        // Bookmark and view presenters
        await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
        let presenters = [
            "Chetwynd Rodrigo",
            "Yau Boon Lim",
            "Paul Duffy",
            "Rob Christie"
        ]
        for(let presenter of presenters) {
            try {
                await PickPresenter(browser, presenter);
            } catch(e) {
                log("Couldn't select presenter: "+presenter);
            }
        }

        await randDelay(5, 10);
    })

    step("Navigate to Virtual Exhibits", async (browser) => {
        await Navigate(browser, "Exhibit Showcase");

        // Bookmark booths
        await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
        for (let i = 1; i < 4; i++) {
            let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
            await browser.click(By.css(selector))
            await delay(2);
        }

        await browser.click(By.visibleText("Learn More"));
        await browser.wait(Until.elementIsVisible(By.visibleText("Back")));
        await browser.click(By.visibleText("Back"));

        await randDelay();
    })

    step("Navigate to Attendees", async (browser) => {
        await Navigate(browser, "Attendees");

        // Bookmark and view presenters
        await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
        let attendees = [
            "Christopher Galano",
            "Vincent Palermo",
            "Tyler McCarthy",
            "Connie Cay-Santos"
        ]
        for(let attendee of attendees) {
            try {
                await PickPresenter(browser, attendee);
            } catch(e) {
                log("Couldn't select attendee: "+attendee);
            }
        }

        await randDelay();
    })

    afterAll(async (browser) => {
        await browser.click(By.css(settingsOverlayButton));
        delay(1);
        await browser.click(By.visibleText("Log Out"));
        await randDelay();
        printIssues();
    })

};