# Developing

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project structure](#project-structure)
  - [Monorepo](#monorepo)
  - [Private packages](#private-packages)
- [Code style](#code-style)
- [Testing](#testing)
  - [Unit testing](#unit-testing)
    - [How it works](#how-it-works)
    - [How to run manually](#how-to-run-manually)
    - [How to update snapshots](#how-to-update-snapshots)
  - [Visual regression testing](#visual-regression-testing)
    - [How it works](#how-it-works-1)
    - [How to run manually](#how-to-run-manually-1)
- [Git commits](#git-commits)
- [Package versioning](#package-versioning)
  - [New package version](#new-package-version)
  - [Creating pre-releases](#creating-pre-releases)
- [Deployment](#deployment)
  - [Storybook](#storybook)
  - [Packages](#packages)
    - [New packages](#new-packages)
    - [Pre-releases](#pre-releases)
  - [How to deploy](#how-to-deploy)
- [Documentation](#documentation)
  - [Updating table of contents](#updating-table-of-contents)
- [How to fix an old release](#how-to-fix-an-old-release)
  - [Steps](#steps)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Prerequisites

The following dependencies must be available to be begin project development.

* [Unix-like][] operating system _— [Windows Subsystem for Linux][] also works_
* [Git][]
* [Node][] `^9.7.1`
* [Yarn][] `>=1.5.1`
* [Python][] `^2.7` _— Some dependencies require `node-gyp` which uses Python_

[Git]: https://git-scm.com/
[Node]: https://nodejs.org
[Python]: https://www.python.org
[Unix-like]: https://en.wikipedia.org/wiki/Unix-like
[Yarn]: https://yarnpkg.com
[Windows Subsystem for Linux]: https://docs.microsoft.com/en-us/windows/wsl/about

## Getting Started

To get set up, run the following commands:

```bash
git clone https://github.com/Autodesk/hig
cd hig
yarn
yarn build
```

## Project structure

### Monorepo

This project is structured as a [monorepo][], with each package residing within its own directory.

The monorepo uses [Yarn workspaces][] and [Lerna][] to manage the interdependencies between packages.

[Lerna]: https://lernajs.io/
[monorepo]: https://github.com/babel/babel/blob/master/doc/design/monorepo.md
[Yarn workspaces]: https://yarnpkg.com/lang/en/docs/workspaces/

### Private packages

Private packages are used to organize development tools and dependencies. For example, the [`@hig/scripts`][hig-scripts] package contains the build script that's used to build every component package.

[hig-scripts]: ./packages/scripts

## Code style

We use [ESLint][] and [Prettier][] to ensure consistency throughout the source code. Please view our [ESLint configuration][] for details on style rules.

[ESLint]: https://eslint.org/
[ESLint configuration]: ./packages/eslint-config
[Prettier]: https://prettier.io/

## Testing

### Unit testing

[Jest][] along with [Enzyme][] is used to run our unit testing suite. While we aim for the highest possible code coverage, every component should be covered with a [snapshot test][] at the very least.

[Enzyme]: http://airbnb.io/enzyme/
[Jest]: http://jestjs.io/
[snapshot test]: http://jestjs.io/docs/en/snapshot-testing.html

#### How it works

Unit tests reside within module specifications (`moduleName.test.js`), which are placed next to their respective modules. Jest runs all of the project's unit tests together, and evaluates code coverage on the project as a whole.

#### How to run manually

```bash
yarn test
```

#### How to update snapshots

```bash
yarn test -u
```

### Visual regression testing

To ensure that changes do not break the visual presentation of components, we run a suite of visual regression tests via [Gemini][].

[Gemini]: https://gemini-testing.github.io/

#### How it works

The tests are run upon a Storybook developed specifically for automated testing. Screenshots of each test are stored within the repository similar to unit test snapshots.

#### How to run manually

```bash
cd packages/storybook
yarn gemini-update  # Update snapshots
yarn gemini         # Check components against committed snapshots
```

## Git commits

Commit messages should adhere to the [Angular Git Commit Guidelines][].

## Package versioning

Package versioning is automated via [Semantic Release][] and determined by commit messages. Commit messages should adhere to [Angular Git Commit Guidelines][].

[Angular Git Commit Guidelines]: https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines
[Semantic Release]: https://github.com/semantic-release/semantic-release

### New package version

In general you don't have to worry about maintaining the version number of the package because Semantic Release will automate the process for you. However there may be situations where you are developing a package and don't want its changes to be pushed to other dependent packages (either for local development or via Greenkeeper). In such cases you may want to assign an explicit version and append an `"-alpha"` tag to indicate that the package is still in development.

Using the [example package documentation][package-example] as a reference, create a new package with the version `1.0.0-alpha`.

Per [Semantic Versioning 2.0.0][semver], the `"-alpha"` portion of the version labels the package as pre-release. Packages labeled as pre-release are ignored during deployment.

In concordance with this, you should make any inter-package dependencies explicit in each package's `package.json` file. Combined with Semantic Release and Greenkeeper, this will ensure that any nonbreaking package updates will be cascaded to any dependent packages, and notifications sent for breaking ones.

### Creating pre-releases

Packages that have already been published can have pre-releases as well.

For example, `@hig/button@1.0.0` can have a pre-release package by changing the version to `@hig/button@1.1.0-alpha`.
Subsequent pre-releases can be made by further changing the package version, e.g. `@hig/button@1.1.0-alpha.2`.

[package-example]: ./docs/package-example
[npm-publish]: https://docs.npmjs.com/cli/publish
[semver]: https://semver.org/

## Deployment

### Storybook

[Storybook][] is deployed when changes are merged into the `master` branch. [Storybook Staging][] is deployed when changes are merged into the `development` branch.

[Storybook]: http://storybook.hig.autodesk.com/
[Storybook Staging]: http://storybook-staging.hig.autodesk.com/

### Packages

Packages are published via [Semantic Release][].

#### New packages

New packages should be labeled as pre-release and are ignored during deployment.
For the deployment workflow to recognize them, the pre-release version must be changed to a stable version. For example, `1.0.0-alpha` should be changed to `1.0.0`.

#### Pre-releases

Packages labeled as pre-release are ignored during deployment, and must be published manually via the appropriate [CLI tools][npm-publish].

### How to deploy

1. Create a pull request (PR) to merge `development` into `master`.
   * Begin the PR title with `Release:` for consistency.
   * Add the `release` issue label for discovery.
1. Wait for the PR to receive approval and all automation to finish.
1. Merge the PR with a **merge commit**
   * Merging with a merge commit ensures there's no loss of commit information.

_Semantic Release will then:_

1. Create new Git tags
1. Create/update changelogs
1. Publish new package versions to NPM
1. Update the `master` branch
1. Create GitHub releases
1. Merge all changes into the `development` branch

### Configuring Semantic Release to deploy a package
A package must have the following properties defined in its `package.json` file in order to be published by Semantic Release

```json
  "devDependencies": {
    "@hig/scripts": "^x.x.x",
    "@hig/semantic-release-config": "^x.x.x",
  },
  "release": {
    "extends": "@hig/semantic-release-config"
  },
  "scripts": {
    "release": "hig-scripts-release"
  },
```

## Documentation

### Updating table of contents

Every table of contents is generated using [`doctoc`][doctoc].

[doctoc]: https://www.npmjs.com/package/doctoc

To update each document's table of contents run:

```bash
yarn docs
```

## How to fix an old release

Scenario: a consumer reports a critical bug for `@hig/button@0.1.0`, but the current package version is `@hig/button@1.0.0`. Additionally, upgrading to `@hig/button@1.0.0` isn't an option for the consumer.

We need to patch `@hig/button@0.1.0`, by releasing `@hig/button@0.1.1` with the fix.

### Steps

1. Checkout a new branch based on the tag for the respective version

```bash
git checkout @hig/button@0.1.0
git checkout -b fix/button
```

2. Update the working directory

```bash
yarn install
yarn run build
```

3. Make the necessary changes for the fix
4. Commit changes following the [Git commit guidelines](#git-commits)
5. Bump the package version

_`packages/button/package.json`_

```diff
{
  "name": "@hig/button",
- "version": "0.1.0",
+ "version": "0.1.1"
}
```

6. Update the `CHANGELOG.md`
    * Adhere to the existing format
7. Commit changes

```bash
git add packages/button/package.json
git add packages/button/CHANGELOG.md
git commit -m "chore(release): bump version to `@hig/button@0.1.1`"
```
8. Merge development branch and resolve conflicts

```bash
git merge development --no-ff
```

9. Follow standard pull request procedure
    * Wait for CI to successfully complete
    * Wait for pull request approval
    * Merge PR with merge commit
8. Publish package

```bash
cd ./packages/button
npm publish
```

9. Create a Git tag and release entry via GitHub
    * The tag should point to the commit with the `chore(release)` message
