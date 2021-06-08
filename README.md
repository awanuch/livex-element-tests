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
element run your-script.ts --no-headless
```

Running with the `--no-headless` flag will make an incognito chromium browser to run the test.

## Element's Docs
https://element.flood.io/docs/