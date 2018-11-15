exports.config = {
  directConnect: true,
  
  baseUrl: 'https://www.google.co.uk',

/*  
  capabilities: {
    'browserName': ['firefox'] //default chrome
  },
*/

  framework: 'mocha',
  
  mochaOpts: {
    reporter: 'dot',
    timeout: 10000,
  },

  specs: ['test/integration/*.js'],
};
