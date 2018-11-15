// Karma configuration
// Generated on Wed Jan 06 2016 07:51:31 GMT-0700 (MST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter

    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

    // list of files / patterns to load in the browser

    files: [
      'node_modules/angular2/bundles/angular2-polyfills.js',      
      'node_modules/rxjs/bundles/Rx.umd.js',
      'node_modules/angular2/bundles/angular2-all.umd.js',
      './test/client/**/*.js',
    ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
//START:COVERAGE
    preprocessors: {
      './public/src/**/*.js': 'coverage'
    },
//END:COVERAGE


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
//START:COVERAGE
    reporters: ['progress', 'coverage'],
//END:COVERAGE


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};