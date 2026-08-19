module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { caller: { preserveEnvVars: true } }],
    "^.+\\.(ts|tsx)?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
  // Keep these packages transpiled by Babel/ts-jest with Bun's hoisted node_modules.
  transformIgnorePatterns: [
    "node_modules/(?!(?:(jest-)?react-native|react-native-animatable|react-native-reanimated|react-clone-referenced-element|@react-native-picker|axios|@react-native-community|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|react-native-svg|react-native-toastable|react-native-ui-datepicker|react-native-web|react-native-worklets|expo(nent)?|@expo(nent)?/.*|@react-native.*|@react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|i18n-js|@shopify/restyle|@gorhom/.*|@dev-plugins/.*|@testing-library/react-native))",
  ],
  testPathIgnorePatterns: [],
  coveragePathIgnorePatterns: [],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)", "**/?(*.)+(spec|test).js?(x)"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "@/assets/icons/(.*)$": "<rootDir>/assets/icons/$1.tsx",
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/../../packages/fake-be/src/$1",
  },
};
