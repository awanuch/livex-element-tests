import {
  step,
  TestSettings,
  Until,
  By,
  TestData,
  Condition,
  beforeEach,
  afterEach,
  afterAll,
  beforeAll
} from "@flood/element";
import * as assert from 'assert';
import {name as fakeName, company as fakeJob, random} from 'faker';

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
 *   - Opens Profile: Chetwynd Rodrigo
 *   - Bookmarks Chetwynd
 *   - Opens Profile: Yau Boon Lim
 *   - Bookmarks Yau
 *   - Opens Profile: Paul Duffy
 *   - Boomkarks Paul
 *   - Opens Profile: Rob Christie
 *   - Bookmarks Rob
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
  // loopCount: -1, // Runs Infinitely
  loopCount: -1,
  description: "WorkPride2021- Front-end Load Test - Register and navigate site.",
  screenshotOnFailure: true,
  disableCache: false,
  clearCache: true,
  clearCookies: true,
  consoleFilter: [
    "log", "info"
  ],
  actionDelay: 2,
  // stepDelay: 1,
  stepDelay: 6
};

export default() => {
  // Config
  // let url = "http://localhost:3000/?show=phoenix"; // Make sure you're running the master branch!
  // let url = "http://localhost:3000/?show=phoenixloadtesting"; // Make sure you're running the master branch!
  // let url = "https://venue.events-nextechar.com/landing?show=phoenix";
  let url = "https://venue.events-nextechar.com/landing?show=workpride2021";
  let loginNavButton = 'nav [class*=" Navbar__Login"]';
  let styledNav = "[class*='Navbar__StyledNav']"
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
  let credEmail = `loadtest.${
    credFirstName.toLowerCase()
  }.${
    credLastName.toLowerCase()
  }${
    random.number(999)
  }@mailinator.com`;
  let credCompany = fakeJob.companyName();
  let credPassword = "TestPassword123!";

  let credentialsCreated = false;

  let messages = []
  const log = (message) => {
    messages.push(message);
  }
  const printIssues = () => {
    for (let msg of messages) {
      console.log(msg);
    }
  }

  // Reusable Navigator Function
  const Navigate = async (browser, selector) => {
    await browser.click(By.css(selector));
  }

  beforeAll(async (browser) => {
    await browser.visit(url);
    await browser.wait(Until.elementIsVisible(By.visibleText('Log In')));
    await browser.click(By.css(loginNavButton));
  })

  step.unless(() => credentialsCreated == false, "Log into the platform", async (browser) => {
    await browser.type(By.css(inputEmail), credEmail);
    await browser.type(By.css(inputPassword), credPassword);
    await browser.sendKeys("Enter");
  })

  step.once("Register as New User", async (browser) => {
    await browser.click(By.xpath('/html/body/div/div[6]/div/div/div/div[4]/p[2]/a'));
    await browser.type(By.css(inputFirstName), credFirstName);
    await browser.type(By.css(inputLastName), credLastName);
    await browser.type(By.css(inputCompanyName), credCompany);
    await browser.type(By.css(inputEmail), credEmail);
    await browser.type(By.css(inputPassword), credPassword);
    await browser.sendKeys("Enter");

    // Wait until video loads and watch to the end.
    await browser.wait(Until.elementIsVisible(By.css(styledNav)));
    credentialsCreated = true;
  });

  step("Navigate to Live Now Page", async (browser) => {
    await Navigate(browser, '[class*="Navbar__StyledDiv"] div:nth-child(2)');
  })

  step("Navigate to Schedule", async (browser) => {
    await Navigate(browser, '[class*="Navbar__StyledDiv"] div:nth-child(3)');
  })

  step("Navigate to Exhibitors", async (browser) => {
    await Navigate(browser, '[class*="Navbar__StyledDiv"] div:nth-child(4)');
    await browser.wait(Until.elementIsVisible(By.css("button[class*=BookmarkIcon__BookmarkBtn]")));
  })

  step("Open Booth 1", async (browser) => {
    await browser.wait(Until.elementIsVisible(By.visibleText("Vi Living")));
    await browser.click(By.xpath('/html/body/div/main/div[2]/div[16]/div/div/a/button'));
  })


  step("Go back from Booth 1", async (browser) => {
    await browser.click(By.visibleText("Back"));
  })

  step("Open Booth 2", async (browser) => {
    await browser.wait(Until.elementIsVisible(By.visibleText("DAZN")));
    await browser.click(By.xpath("/html/body/div/main/div[2]/div[17]/div/div/a/button"));
  })


  step("Go back from Booth 2", async (browser) => {
    await browser.click(By.visibleText("Back"));
  })

  step("Open Booth 3", async (browser) => {
    await browser.wait(Until.elementIsVisible(By.visibleText("RS Components")));
    await browser.click(By.xpath("/html/body/div/main/div[2]/div[20]/div/div/a/button"));
  })

  step("Go back from Booth 3", async (browser) => {
    await browser.click(By.visibleText("Back"));
  })

  step("Open Booth 4", async (browser) => {
    await browser.wait(Until.elementIsVisible(By.visibleText("myGwork")));
    await browser.click(By.xpath("/html/body/div/main/div[2]/div[21]/div/div/a/button"));
  })

  step("Go back from Booth 4", async (browser) => {
    await browser.click(By.visibleText("Back"));
  })

  step("Log Out", async (browser) => {
    await browser.click(By.css(settingsOverlayButton));
    await browser.click(By.visibleText("Log Out"));
  })

  afterAll(async (browser) => {
    printIssues();
  })

};
