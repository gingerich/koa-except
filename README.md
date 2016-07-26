# Koa Except

Bypass koa middleware under certain conditions.

## Install

	npm i koa-except -S

## Usage

With existing middlewares:
You can add multiple exceptions using the `and()` method.

```javascript
const jwt = require('koa-jwt')()
jwt.except = require('koa-except')

app.use(jwt
	.except({ method: 'POST', path: /\/auth$/ })
	.and({ path: /\/health$/ }))
```

Equivalently, you can pass multiple conditions as an array.
To be technical, the array should be in [Disjuntive Normal Form](https://en.wikipedia.org/wiki/Disjunctive_normal_form) (DNF), where Objects act as conjunctions and Arrays act as clauses.

```javascript
const jwt = require('koa-jwt')()
jwt.except = require('koa-except')

app.use(jwt.except([
    { method: 'POST', path: /\/auth$/ },
	{ path: /\/health$/ }
]))
```

If you are authoring a middleware you can support except as follows:

```javascript
module.exports = function () {
  function middleware (ctx, next) {
  	// Do something
  }

  middleware.except = require('koa-except')
  return middleware
}
```

## Current options

- opts: {Object|Array} 
	-  `method` it could be an string or an array of strings. If the request method match the middleware will not run.
	-  `path` it could be an string, a regexp or an array of either. If the request path match, the middleware will not run.
	-  `ext` it could be an string or an array of strings. If the request path ends with one of these extensions the middleware will not run.
	-  `custom` it must be a function that returns `true` / `false`. If the function returns true for the given request, ithe middleware will not run. The function will have access to Koa's context via `this`
	-  `useOriginalUrl` it should be `true` or `false`, default is `true`. if false, `path` will match against `ctx.url` instead of `ctx.originalUrl`.

koa-except returns a koa middleware function that also exposes an `and(opts)` method for chaining

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

Serve static files except when OPTIONS request is made

```javascript
const except = require('koa-except')
const serve  = require('koa-static')

const static = serve(__dirname + '/public')
static.except = except;

app.use(static.except({ method: 'OPTIONS' }))
```

## Credits

This library was directly inspired by [Jesús Rodríguez](https://github.com/Foxandxss) who published [koa-unless](https://github.com/Foxandxss/koa-unless) based on [José F. Romaniello's](https://github.com/jfromaniello) implementation of the original [express version](https://github.com/jfromaniello/express-except).

## License

MIT 2016 - Marlin Gingerich
