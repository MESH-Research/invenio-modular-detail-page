module.exports = {
  verbose: false,
  testEnvironment: "jsdom",
  roots: [
    "<rootDir>/invenio_modular_detail_page/assets/semantic-ui/js/invenio_modular_detail_page",
  ],
  moduleFileExtensions: ["js", "jsx", "json"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "^@translations/invenio_modular_detail_page/i18next$":
      "<rootDir>/invenio_modular_detail_page/assets/semantic-ui/translations/invenio_modular_detail_page/i18next.js",
    "^@js/invenio_modular_detail_page/(.*)$":
      "<rootDir>/invenio_modular_detail_page/assets/semantic-ui/js/invenio_modular_detail_page/$1",
    // Prefer this package's install over nested translation/node_modules trees.
    "^i18next$": "<rootDir>/node_modules/i18next",
    "^i18next-browser-languagedetector$":
      "<rootDir>/node_modules/i18next-browser-languagedetector",
    "^react-i18next$": "<rootDir>/node_modules/react-i18next",
    "^react$": "<rootDir>/node_modules/react",
    "^react-dom$": "<rootDir>/node_modules/react-dom",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    // pnpm: allowlist must match the package after the optional
    // .pnpm/<pkg>@ver/node_modules/ prefix (see root jest.config.js).
    "/node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?(react-invenio-forms|react-searchkit|axios|semantic-ui-react|@babel|@inveniosoftware)(/|$))",
  ],
  testMatch: ["**/*.test.js", "**/*.test.jsx", "**/*.spec.js", "**/*.spec.jsx"],
  testPathIgnorePatterns: ["/node_modules/", "/\\.venv/", "/tests/"],
  // Empty suite is expected until UI tests are added.
  passWithNoTests: true,
  collectCoverageFrom: [
    "invenio_modular_detail_page/assets/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/*.test.{js,jsx}",
    "!**/*.spec.{js,jsx}",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  resetMocks: true,
  restoreMocks: true,
};
