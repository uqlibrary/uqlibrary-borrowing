# uqlibrary-borrowing

[![Codeship Status for uqlibrary/uqlibrary-borrowing](https://app.codeship.com/projects/6dded590-8426-0132-db87-4a95a2d7e957/status?branch=polymer1.0)](https://app.codeship.com/projects/58328)
[![Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-borrowing.svg)](https://david-dm.org/uqlibrary/uqlibrary-borrowing)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-borrowing/dev-status.svg)](https://david-dm.org/uqlibrary/uqlibrary-borrowing?type=dev)

uqlibrary-borrowing displays academic borrowing to the end user

The full documentation can be found in [GitHub Pages](http://uqlibrary.github.io/uqlibrary-borrowing/uqlibrary-borrowing/).

## Requirements

Java 8 is required, as are `node` and `npm`. Check `package.json` for required versions.

## Dev Setup

Add dev-app.library.uq.edu.au to your /etc/hosts or equivalent file.

### Installing dependencies

```bash
npm install -g gulp-cli web-component-tester bower polymer-cli
npm install
bower install
```

## Development

Run `gulp serve` to start a live-reloading web server and display the page in the default browser.

* Please adhere to the Polymer code style guide provided at [Style Guide](http://polymerelements.github.io/style-guide/).
* Colors and common styles are imported (bower install) from [uqlibrary-styles](http://github.com/uqlibrary/uqlibrary-styles).
* The docs can be viewed locally by running `npm start`. Use the second URL from the command output.
* GitHub pages should be updated after every commit to `polymer1.0` branch by running `bin/generate-gh-pages.sh`

## Testing

Run `npm test` to run local tests with `web-component-tester`. You can also run `wct` directly.