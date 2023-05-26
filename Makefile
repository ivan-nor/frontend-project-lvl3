develop:
	npx webpack serve

install:
	npm install
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npx playwright test

lint:
	npx eslint .

.PHONY: test
