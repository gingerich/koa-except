# Koa Except

Bypass koa middleware under certain conditions.

## Install

	npm i koa-except -S

## Usage

With existing middlewares:

```javascript
var except = require('koa-except');
var serve  = require('koa-static');

var static = serve(__dirname + '/public');
static.except = except;

app.use(static.except({ method: 'OPTIONS' }));
```

If you are authoring a middleware you can support except as follow:

```javascript
module.exports = function () {
  var mymid = function(ctx, next) {
	// Do something
  };

  mymid.except = require('koa-except');

  return mymid;
};
```

## Current options

-  `method` it could be an string or an array of strings. If the request method match the middleware will not run.
-  `path` it could be an string, a regexp or an array of any of those. If the request path match, the middleware will not run.
-  `ext` it could be an string or an array of strings. If the request path ends with one of these extensions the middleware will not run.
-  `custom` it must be a function that returns `true` / `false`. If the function returns true for the given request, ithe middleware will not run. The function will have access to Koa's context via `this`
-  `useOriginalUrl` it should be `true` or `false`, default is `true`. if false, `path` will match against `ctx.url` instead of `ctx.originalUrl`.


## Examples

Require authentication for every request except the path is index.html.

```javascript
app.use(requiresAuth.except({ path: ['/index.html', '/'] }))
```

Avoid a fstat for request to routes doesnt end with a given extension.

```javascript
app.use(static.except(function () {
  var ext = url.parse(this.originalUrl).pathname.substr(-4);
  return !~['.jpg', '.html', '.css', '.js'].indexOf(ext);
}));
```

## Credits

This library was directly inspired by [Jesús Rodríguez](https://github.com/Foxandxss) who published [koa-unless](https://github.com/Foxandxss/koa-unless) based on [José F. Romaniello's](https://github.com/jfromaniello) implementation of the original [express version](https://github.com/jfromaniello/express-except).

## License

MIT 2016 - Marlin Gingerich
