# uqlibrary-borrowing

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
npm install -g gulp-cli web-component-tester bower
npm install
bower install
```

## Development

Run `gulp serve` to start a live-reloading web server and display the page in the default browser.

* Please adhere to the Polymer code style guide provided at [Style Guide](http://polymerelements.github.io/style-guide/).
* Colors and common styles are imported (bower install) from [uqlibrary-styles](http://github.com/uqlibrary/uqlibrary-styles).
* GitHub pages should be updated after every commit to `polymer1.0` branch by running `bin/generate-gh-pages.sh`

## Testing

Run `npm test` to run local tests with `web-component-tester`. You can also run `wct` directly.