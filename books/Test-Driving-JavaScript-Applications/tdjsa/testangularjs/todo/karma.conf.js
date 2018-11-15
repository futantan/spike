// Karma configuration
// Generated on Wed Jan 06 2016 07:51:31 GMT-0700 (MST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter

//START:CHANGED
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

    // list of files / patterns to load in the browser

    files: [
      'public/javascripts/jquery-2.1.4.js',
      'public/javascripts/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      './test/client/**/*.js',
      './public/javascripts/src/todoapp.js',
      './public/javascripts/src/services/tasks-service.js',
      './public/javascripts/src/controllers/tasks-controller.js',
      './public/javascripts/**/*.js',
    ],
//END:CHANGED

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
//START:COVERAGE
    preprocessors: {
      './public/javascripts/src/*.js': 'coverage'
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