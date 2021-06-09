# Installing

You need to install element-cli to run the tests.

Note: Element 1.5.1's compiler is broken (at least on Windows). They recommend that you use the beta release.
Note: They also recommend using yarn over NPM. They have NPM support in their docs, but I got this working with yarn.

```bash
yarn global add @element-cli@beta
yarn install
```

To run a test, navigate to the directory where your test script is at and run:

```bash
element run ./tests/your-script.ts --no-headless
```

Running with the `--no-headless` flag will make an incognito chromium browser to run the test. 
Running without it will only print the results to your console.

**Note:** If you're running on local, your console is going to be flooded with HubProtocol tokens because LiveX console.logs it and it causes a weird display glitch. The test should continue to work fine, but you won't often be able to read the output. This is true for VS Code's terminal and Powershell. I haven't tested on Linux's terminal or MacOS's terminal.

## Element's Docs
https://element.flood.io/docs/

## Note About Building Tests
Don't build the test to run multiple instances. Flood will do that for you with their virtual users.

In other words, build all of your tests from the perspective of a single user.

# Running Tests On Flood
## Creating Your Stream
Log into https://app.flood.io/ and navigate to your streams.

If you're not using the Default project, make sure you select the correct project.

Click on "Create Stream" to create a new one or choose an existing one to modify or run again.

## Configuring Your Stream

1. Enter a name for your stream. 
2. Upload the script and any other resources you want to use in your test.
3. Select "Element" in the Tool Configuration section.
4. Click "Configure Service Level Objectives"

## Configuring SLOs (Service Level Objectives)

There's quite a few ways for you to configure how flood reads your dataset.

You should refer [Flood's guide](https://guides.flood.io/results-analysis/service-level-objectives) on setting these up.

I would recommend setting a hard limit on fails. For example, if the platform crashes and you get more than 1000 errors a minute,
kill the test so you're not running up your VUHs (Virtual User Hours).

## Launching Your Flood
- Select "Demand" for your Infrastructure Type
- Select which regions you want test users to run from. This is useful if you're testing latency on a heavy load.
- Set your UPR (Users Per Region). **IMPORTANT:** This will *multiply* your VUHs (Virtual User Hours) per region.
- Set your duration. This is how long the test will run for. This is for indefinite testing.
- Set your ramp. This will ramp up the users over a period of specified minutes. 
- An estimated VUH usage will be shown to you in the summary section. 
- If you're happy with your configuration, click "Launch Test". 

## Notes about testing
It can take several minutes for Flood to set up the Virtual User grids. Once that's done, Flood will queue your test.
Depending where you are in queue, the test may take long time to start. 

In a small 7 user test, it took about:
- 2 minutes to set up the grids,
- 1 minute to get through the queue, and 
- 4 minutes to get the first data points to appear on the grid.