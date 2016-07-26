'use strict'
var url = require('url')

function except (options) {
  var parent = this

  var opts = typeof options === 'function' ? [{custom: options}] : coerceToArray(options)

  function middleware (ctx, next) {
    var skip = opts.reduce(function (result, opts) {
      opts.useOriginalUrl = (typeof opts.useOriginalUrl === 'undefined') ? true : opts.useOriginalUrl
      var requestedUrl = url.parse((opts.useOriginalUrl ? ctx.originalUrl : ctx.url) || '', true)

      var skip = true

      if (opts.custom) {
        skip = skip && opts.custom(ctx)
      }

      var paths = opts.path && coerceToArray(opts.path)

      if (paths) {
        skip = skip && paths.some(function (p) {
          return (typeof p === 'string' && p === requestedUrl.pathname) ||
            (p instanceof RegExp && !!p.exec(requestedUrl.pathname))
        })
      }

      var exts = opts.ext && coerceToArray(opts.ext)

      if (exts) {
        skip = skip && exts.some(function (ext) {
          return requestedUrl.pathname.substr(ext.length * -1) === ext
        })
      }

      var methods = opts.method && coerceToArray(opts.method)

      if (methods) {
        skip = skip && !!~methods.indexOf(ctx.method)
      }

      return skip || result
    }, false)

    if (skip) {
      return next()
    }

    return parent(ctx, next)
  }

  middleware.and = except
  return middleware
}

function coerceToArray (val) {
  return Array.isArray(val) ? val : [val]
}

module.exports = except
