export default {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
