Simple test web components to explore Remote Component features ([IFI-2013](https://issues.liferay.com/browse/IFI-2013)).

Components can be found in the `packages/` directory.

## Setup

Install `n`:

`curl -L https://git.io/n-install | bash`

Refresh `.bashrc`:

Install latest nodejs
```
n latest
```

Add corporate registry. Edit `.npmrc` add:

```
registry=https://artifacts.cfzcea.dev.desjardins.com/artifactory/api/npm/npm-virtual/
registry=http://registry.npmjs.org/
```

Install [Yarn](https://classic.yarnpkg.com/)

`npm install -g yarn`

## Building

Resolve/Install dependencies by running from the repo root:

```bash
yarn

# If you have issues of any kind then try
yarn install --legacy-peer-deps
```

Most components don't have an build process, because the JavaScript is ready to be consumed as-is.

You can build components that have an actual build step by running `yarn build` from the component's directory, or you can run `yarn build` from the top-level to build them all. For example:

```sh
# Build the `<simple-react-app>` component.
(cd packages/simple-react-app && yarn build)

# Build the Angular component.
(cd packages/angular && yarn build)

# Build all components.
yarn build
```

For convenience, these `build` scripts create a commit with the generated files, so that they can be published to GitHub pages with a `git push`. To skip the commit, you can run `yarn build:nocommit` instead.

## Run service with all components

Install http-server

```bash
yarn global add http-server
```

from the root of the repo run:

```bash
http-server -p 8090
```

## Configure Liferay

Build and deploy the module from https://github.com/rotty3000/remote-web-component-poc

Once installed, copy the files from `configs` into `${liferay-workspace}/bundles/osgi/configs`

You should notice some widgets in the menu.