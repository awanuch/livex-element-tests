import { step, TestSettings, Until, By, TestData, Condition, beforeEach, afterEach, afterAll, beforeAll, RecoverWith } from "@flood/element";
import * as assert from 'assert';
import {
    name as fakeName,
    company as fakeJob,
    random
} from 'faker';

/** READABLE EXPECTED WORKFLOW
 * 
 *   - Opens Login Modal
 * 
 *   [If] it's the first run,
 *   - Clicks "Register"
 *   - Enters Credentials
 *   - Registers & Logs In
 *   [Endif]
 *   [If] it's not the first run
 *   - Enters Credentials
 *   - Logs In
 *   [Endif]
 * 
 *   - Navigates to "Home"
 * 
 *   - Navigates to Live Now
 *   - Interacts with Poll
 * 
 *   - Navigates to Schedule
 *   - Clicks the first bookmark 4 times
 *   - Clicks "Check In" button

 *   - Navigates to Presenters
 *   - Opens Profile: Rapunzel Princess
 *   - Bookmarks Rapunzel Princess
 *   
 *   - Navigates to Virtual Exhibits
 *   - Clicks the first bookmark button 4 times (takes 8 seconds)
 *   - Clicks the first "Learn More" button
 *   - Clicks "Back"
 * 
 *   - Navigates to Attendees
 *   - Opens Profile: Christopher Galano
 *   - Bookmarks Christopher
 *   - Opens Profile: Vincent Pelermo
 *   - Bookmarks Vincent
 *   - Opens Profile: Tyler McCarthy
 *   - Bookmarks Tyler
 *   - Opens Profile: Connie Cay-Santos
 *   - Bookmarks Connie
 * 
 *   - Clicks on Profile Dropdown
 *   - Logs Out
 */

export const settings: TestSettings = {
    loopCount: -1, // Runs Infinitely
    // loopCount: 1,
    description: "LiveX - Front-end Load Test - Register and navigate site.",
    screenshotOnFailure: true,
    disableCache: true,
    clearCache: true,
    clearCookies: true,
    consoleFilter: ["log", "info"],
    actionDelay: 1,
    stepDelay: 1,
};

export default () => {
    // Config 
    // let url = "http://localhost:3000/?show=phoenix"; // Make sure you're running the master branch!
    // let url = "http://localhost:3000/?show=phoenixloadtesting"; // Make sure you're running the master branch!
    // let url = "https://venue.events-nextechar.com/landing?show=phoenix";
    let url = "https://test.venue.events-nextechar.com/?show=phoenix";
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
        await browser.takeScreenshot();
    }

    beforeAll(async (browser) => {
        await browser.visit(url);
        // let loginNavButtonEl = By.css(loginNavButton)
        // if (loginNavButtonEl) {
        //     await browser.wait(Until.elementIsVisible(By.css(loginNavButton)));
        //     await browser.click(By.css(loginNavButton));
        // }
    })

    step("Register as New User", async (browser) => {
        // Fake Data
        let credFirstName = fakeName.firstName();
        let credLastName = fakeName.lastName();
        let credEmail = `${credFirstName.toLowerCase()}.${credLastName.toLowerCase()}@mailinator.com`;
        let credCompany = fakeJob.companyName();
        let credPassword = "TestPassword123!";

        await browser.click(By.visibleText("Register"));
        await browser.type(By.css(inputFirstName), credFirstName);
        await browser.type(By.css(inputLastName), credLastName);
        await browser.type(By.css(inputCompanyName), credCompany);
        await browser.type(By.css(inputEmail), credEmail);
        await browser.type(By.css(inputPassword), credPassword);
        await browser.sendKeys("Enter");

        // Wait until video loads and watch to the end.
        await browser.wait(Until.elementIsVisible(By.css(styledNav)))
        // await browser.wait(Until.elementIsVisible(By.css(".motion-bg")))
    });

    step("Navigate to Home Page", async (browser) => {
        await Navigate(browser, "Welcome Page");
    })

    step("Navigate to Live Now Page", async (browser) => {
        await Navigate(browser, "Auditorium");
    })

    step.skip("Select Poll Options", async (browser) => {
        // Interact with the poll
        let randomChoice = (random.number(4) + 1)
        // let element = await browser.findElement(By.attr("input", "id", "Choice_"+randomChoice));
        await browser.wait(Until.elementIsVisible(By.visibleText(randomChoice.toString())))
        let element = await browser.findElement(By.visibleText(randomChoice.toString()));
        await browser.click(element);
    })

    step.skip("Submit Poll", async(browser) => {
        await browser.click(By.visibleText("Submit"));
        await browser.takeScreenshot();
    }) 

    step.skip("Check Poll Results", async(browser) => {
        await browser.click(By.visibleText("Next"));
    })

    step("Navigate to Schedule", async (browser) => {
        await Navigate(browser, "Schedule");
    })

    step("Bookmark Event", async (browser) => {
        await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
        let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
        await browser.click(By.css(selector))
    })

    step.skip("Check In At Event", async (browser) => {
        await browser.wait(Until.elementIsVisible(By.visibleText("Check In")));
        await browser.click(By.visibleText("Check In"))
    })

    step("Navigate to Presenters", async (browser) => {
        await Navigate(browser, "Presenters");
    })

    step("Open Rapunzel Princess", async(browser) => {
        await browser.wait(Until.elementIsVisible(By.visibleText("Rapunzel Princess")));
        await browser.click(By.visibleText("Rapunzel Princess"));
    })

    step("Bookmark Rapunzel Princess", async(browser) => {
        let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
        await browser.click(By.css(selector))
        await browser.takeScreenshot();
    })

    step("Go back from Rapunzel Princess", async (browser) => {
        await browser.click(By.visibleText("Back"));
    })
    step("Navigate to Virtual Exhibits", async (browser) => {
        await Navigate(browser, "Virtual Exhibits");
        await browser.wait(Until.elementIsVisible(By.visibleText("Dell Technologies")));
    })

    step("Bookmark Virtual Exhibit", async (browser) => {
        await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
        let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
        await browser.click(By.css(selector))
    })

    step("Open Virtual Exhibit", async (browser) => {
        await browser.click(By.visibleText("Learn More"));
        await browser.wait(Until.elementIsVisible(By.visibleText("Back")));
    })

    step("Go Back", async(browser) => {
        await browser.click(By.visibleText("Back"));
        await browser.wait(Until.elementIsVisible(By.visibleText("Dell Technologies")));
    })

    step("Navigate to Attendees", async (browser) => {
        await Navigate(browser, "Attendees");
        await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
    })

    step("Open Christopher Galano", async(browser) => {
        await browser.wait(Until.elementIsVisible(By.visibleText("Christopher Galano")));
        await browser.click(By.visibleText("Christopher Galano"));
    })

    step("Bookmark Christopher Galano", async(browser) => {
        let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
        await browser.click(By.css(selector))
        await browser.takeScreenshot();
    })

    step("Go back from Christopher Galano", async (browser) => {
        await browser.click(By.visibleText("Back"));
        await browser.wait(Until.elementIsVisible(By.visibleText("Lane Gibbs")));
    })

    step("Open Vincent Palermo", async(browser) => {
        await browser.wait(Until.elementIsVisible(By.visibleText("Vincent Palermo")));
        await browser.click(By.visibleText("Vincent Palermo"));
    })

    step("Bookmark Vincent Palermo", async(browser) => {
        let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
        await browser.click(By.css(selector))
        await browser.takeScreenshot();
    })

    step("Go back from Vincent Palermo", async (browser) => {
        await browser.click(By.visibleText("Back"));
        await browser.wait(Until.elementIsVisible(By.visibleText("Lane Gibbs")));
    })

    step("Open Tyler McCarthy", async(browser) => {
        await browser.wait(Until.elementIsVisible(By.visibleText("Tyler McCarthy")));
        await browser.click(By.visibleText("Tyler McCarthy"));
    })

    step("Bookmark Tyler McCarthy", async(browser) => {
        let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
        await browser.click(By.css(selector))
        await browser.takeScreenshot();
    })

    step("Go back from Tyler McCarthy", async (browser) => {
        await browser.click(By.visibleText("Back"));
        await browser.wait(Until.elementIsVisible(By.visibleText("Lane Gibbs")));
    })

    step("Open Connie Cay-Santos", async(browser) => {
        await browser.wait(Until.elementIsVisible(By.visibleText("Connie Cay-Santos")));
        await browser.click(By.visibleText("Connie Cay-Santos"));
    })

    step("Bookmark Connie Cay-Santos", async(browser) => {
        let selector = "button[class*=BookmarkIcon__BookmarkBtn]"
        await browser.click(By.css(selector))
        await browser.takeScreenshot();
    })

    step("Go back from Connie Cay-Santos", async (browser) => {
        await browser.click(By.visibleText("Back"));
        await browser.wait(Until.elementIsVisible(By.visibleText("Lane Gibbs")));
    })

    step("Log Out", async (browser) => {
        await browser.click(By.css(settingsOverlayButton));
        await browser.click(By.visibleText("Log Out"));
    })

    afterAll(async (browser) => {
        printIssues();
    })

};