module.exports = {
  html        : false,
  images      : true,
  fonts       : true,
  static      : false,
  svgSprite   : true,
  ghPages     : false,
  stylesheets : {
    autoprefixer: {
      browsers: "last 2 versions, > 5% in GB, ie >= 10, Safari >= 8"
    }
  },

  javascripts: {
    entry: {
      app: ["./app.js"]
    }
  },

  svgSprite: {
    svgstore: {
      inlineSvg: true
    }
  },

  browserSync: {
    proxy: 'http://localhost:3000/platform/web',
    path: 'app/themes/platform/assets',
    files: ['themes/platform/assets']
  },

  production: {
    rev: false
  }
}
