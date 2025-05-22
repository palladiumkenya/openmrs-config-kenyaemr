# browserslist-config-single-spa

A [shareable browserslist config](https://github.com/browserslist/browserslist#shareable-configs) for single-spa npm packages. This is intended for use in the single-spa npm packages, not in companys' applications.

## Installation

```sh
npm install --save-dev browserslist-config-single-spa

yarn add --dev browserslist-config-single-spa

pnpm install --save-dev browserslist-config-single-spa
```

Now in your package.json, add the following:

```json
{
  "browserslist": ["extends browserslist-config-single-spa"]
}
```

Now use babel preset env and/or autoprefixer, which each respect browserslist config when determining compilation targets.
