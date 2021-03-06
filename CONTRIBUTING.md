Hi collaborator!

We use **pull request** based approach to development.

**Have a fix or a new feature**? Search for corresponding issues first then
create a new one.

If you have a new **API proposal** or change, create an issue describing it precisely:
- JavaScript example
- Resulting DOM/effect

## Workflow
- **assign** the task to yourself
- **create a branch** starting from the **develop** branch, name it like feat/blabla, fix/blabla, refactor/blabla
- see the [development workflow](#development-workflow)
- use our [commit message guidelines](#commit-message-guidelines) to provide a meaningful commit message: it will be inserted into the changelog automatically
- add a [#fix #issue](https://help.github.com/articles/closing-issues-via-commit-messages/) when relevant, in the commit body
- **submit** your pull request to the develop branch
- wait for **review**
- do the necessary changes, do not rebase right away so that we can iterate
- once you are good, **rebase** your pull request to avoid commits like "fix dangling comma in bro.js", "fix after review"
  - basically everything that can be merged should be merged, example:
    - `feat(widget): new feature blabla..`
    - `refactor new feature blablabla...` (bad, not following our [commit message guidelines](#commit-message-guidelines)
  - **both commits should be merged* in a single commit: `feat(widget) ..`
- when **updating** your feature branch on develop, **always use rebase instead of merge**

# Development workflow

Rapidly iterate with our example app:

```sh
npm install
npm run dev
```

Run the tests and lint:

```sh
npm test
```

# Adding/Updating a package

```sh
npm install package --save[-dev]
npm run shrinkwrap
```

# Removing a package

```sh
npm remove package --save[-dev]
npm run shrinkwrap
```

# Commit message guidelines

We use [conventional changelog](https://github.com/ajoslin/conventional-changelog),
please [follow the rules for committing](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md), it helps reducing the commit noise.

Examples:

- feat(slider): add new range option
- fix(refinementList): send the full algolia result to the noResults template

# Milestones

- `next` => Ideas, questions, refactors, bugs that were discuseed, turned into clear actions by the maintainers
- `x.x.x` => selected `next` actions to be done in a release
- no milestone => Still need investigation / discussion

# Labels

Most labels are obvious, some of them not

- `needs api proposal` => good idea, now in need of a clear API proposal (example: https://github.com/algolia/instantsearch.js/issues/331)
- `new widget` => proposal accepted
- `question` => anything that's not a confirmed bug/new feature
