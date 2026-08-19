/* oxlint-disable jest/no-untyped-mock-factory, jest/prefer-ending-with-an-expect, jest/prefer-importing-jest-globals, vitest/prefer-import-in-mock */
import { loadProjectEnv } from "@expo/env";
import "react-native-gesture-handler/jestSetup";

require("react-native-reanimated").setUpTests();
// Add global mocks here (for example, reanimated components, or safe area context, etc)
jest.mock("react-native-gesture-handler", () => {});

loadProjectEnv(process.cwd(), { silent: true });
