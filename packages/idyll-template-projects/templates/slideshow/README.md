# idyll-post

Template for a single Idyll post.

## Installation

- Make sure you have `idyll` installed (`npm i -g idyll`).
- Clone this repo and run `npm install`.

## Developing a post locally

Run `idyll`.

## Building a post for production

Run `idyll build`. The output will appear in the top-level `build` folder. To change the output location, change the `output` option in `package.json`.

## Deploying

Make sure your post has been built, then deploy the docs folder via any static hosting service.

## Dependencies

You can install custom dependencies by running `npm install <package-name> --save`. Note that any collaborators will also need download the package locally by running `npm install` after pulling the changes.
