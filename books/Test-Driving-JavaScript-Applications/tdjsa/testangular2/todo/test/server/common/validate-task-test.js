//START:SETUP
var expect = require('chai').expect;
var validateTask = 
  require('../../../public/javascripts/common/validate-task');

describe('validate task tests', function() {
  var sampleTask;

  var expectFailForProperty = function(property, value) {
    sampleTask[property] = value;
    expect(validateTask(sampleTask)).to.be.false;
  };
  
  beforeEach(function() {
    sampleTask = {name: 'a new task', month: 12, day: 10, year: 2016};    
  });
//END:SETUP

//START:ONE  
  it('should return true for valid task', function() {
    expect(validateTask(sampleTask)).to.be.true;
  });
//END:ONE  

//START:TWO  
  it('should return false for undefined task', function() {
    expect(validateTask()).to.be.false;
  });
//END:TWO
//START:THREE
  it('should return false for null task', function() {
    expect(validateTask(null)).to.be.false;
  });
//END:THREE
//START:FOUR
  it('should return false for undefined name', function() {
    expectFailForProperty('name');
  });
//END:FOUR
//START:FIVE
  it('should return false for null name', function() {
    expectFailForProperty('name', null);
  });
//END:FIVE
//START:SIX
  it('should return false for empty name', function() {
    expectFailForProperty('name', '');
  });
//END:SIX

/*
//START:SEVEN
  ['month'].forEach(function(property) {
    it('should return false for undefined ' + property, function() {
      expectFailForProperty(property);
    });

    it('should return false for null ' + property, function() {
      expectFailForProperty(property, null);
    });

    it('should return false for non number ' + property, function() {
      expectFailForProperty(property, 'text');
    });    
  });
//END:SEVEN
*/

//START:EIGHT
  ['month', 'day', 'year'].forEach(function(property) {
//END:EIGHT
    it('should return false for undefined ' + property, function() {
      expectFailForProperty(property);
    });

    it('should return false for null ' + property, function() {
      expectFailForProperty(property, null);
    });

    it('should return false for non number ' + property, function() {
      expectFailForProperty(property, 'text');
    });    
  });
//START:SETUP
});
//END:SETUP