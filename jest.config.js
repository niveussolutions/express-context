module.exports = {
    verbose: false,
    collectCoverageFrom: [
        '**/*.js',
        '!jest.config.js',
        '!coverage/**/*',
    ],
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov'],
    testMatch: ['**/*.test.js'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
