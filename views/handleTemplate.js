const nunjucks = require("nunjucks");

function createEnv() {
  var opts = {
    watch: true,
    filters: {
      hex: function(n) {
        return "0x" + n.toString(16);
      }
    }
  };
  var autoescape = opts.autoescape === undefined ? true : opts.autoescape,
    noCache = opts.noCache || false,
    watch = opts.watch || false,
    throwOnUndefined = opts.throwOnUndefined || false,
    env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader("views/template", {
        noCache: noCache,
        watch: watch
      }),
      {
        autoescape: autoescape,
        throwOnUndefined: throwOnUndefined
      }
    );
  if (opts.filters) {
    for (var f in opts.filters) {
      env.addFilter(f, opts.filters[f]);
    }
  }
  return env;
}

module.exports = {
  createEnv
};
