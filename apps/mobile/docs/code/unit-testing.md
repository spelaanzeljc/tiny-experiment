# Unit testing

Unit testing is done using `jest` test runner and `@testing-library/*` testing framework. Additionally, we're using `nock` to intercept API requests and provide fake (mock) data without needing to mock any of the app functionality (like making a network request, displaying loading state, etc)

For more information about the tech stack used for testing you can refer to these links:

- [Jest](https://jestjs.io/)
- [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started)
- [@testing-library/react-hooks](https://react-hooks-testing-library.com/)
- [Expo guide to unit testing](https://docs.expo.dev/develop/unit-testing/)
- [Nock](https://github.com/nock/nock?tab=readme-ov-file#read-this---about-interceptors)

## Common testing patterns

Unit tests can be broken down into common categories:

- Simple (dumb) components
- Screens
- Hooks
- Utility functions

In this template you'll find examples for all of the mentioned above. Look for the tests in relevant folders (components, modules, data, utils,...)

## Why Nock?

We are using `Nock` to intercept network requests and provide data back to the client in testing setup. This approach is described as a "best practice" on `@tanstack/react-query` official docs as well.

In contrast to using interceptors, you'll often see network functionality being mocked all together by using something like `jest.mock('path/to/networkRequestMakingUtil, () => jest.fn().mockResolvedValue(whatWeWant))`. That works, but it has its shortcommings, most notably:

- we're taking control over the system and moving further away from the actual implementation
- loading/error states are harder to replicate
- side effects often can't be tested / asserted on

With the "don't mock, provide" approach (which is what Nock is doing), we're letting the system take its natural course, and only taking control over the data that (is supposed to be) returned from an external server.

Take a look at `modules/flowers/screens/FlowersList.test.tsx` to see this approach in action!

## What should be tested?

That's really up to you and your team's judgement / guidelines. You don't _have_ to test anything. Or, you can test _everything_. The optimal path is usually somewhere in between. Our recommendation is to test critical parts of the system/app.

### That's cool, I still don't need unit tests setup in my project

Roger that. You can either keep the existing setup _(won't do any real harm)_ or do the following:

- `yarn remove jest @testing-library/jest-native @testing-library/react-native @testing-library/react-hooks nock @types/jest jest-expo babel-jest`
- Delete the `jest.config.js` and `jest.setup.ts` files in the root of your project
- Delete all files including `.test.`
- Delete `src/testing` folder and all of its content
- Remove `test` script from `package.json` file

That's it, you're now test-free.
