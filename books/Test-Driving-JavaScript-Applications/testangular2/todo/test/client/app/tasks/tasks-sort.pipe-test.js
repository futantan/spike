/***
 * Excerpted from "Test-Driving JavaScript Applications",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/vsjavas for more book information.
***/
describe('tasks-sort pipe test', function() {

  var sortPipe;
  
  beforeEach(function() {
    sortPipe = new app.TasksSortPipe();
  });
            
  it('should have the pipe`s name set to sort', function() {
    var annotations = 
      Reflect.getMetadata('annotations', app.TasksSortPipe)[0];

    expect(annotations.name).to.be.eql('sort');
  });

  it('should sort tasks based on year', function() {
    var task1 = { name: 'task a', month: 1, day: 10, year: 2017};
    var task2 = { name: 'task b', month: 1, day: 10, year: 2016};
    
    var sorted = sortPipe.transform([task1, task2]);
    expect(sorted).to.be.eql([task2, task1]);
  });

  it('should sort tasks based on year, then month', function() {
    var task1 = { name: 'task a', month: 2, day: 10, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 10, year: 2016};
    var task3 = { name: 'task b', month: 1, day: 10, year: 2017};
    
    var sorted = sortPipe.transform([task1, task2, task3]);
    expect(sorted).to.be.eql([task2, task3, task1]);
  });
             
  it('should sort tasks based on year, month, then day', function() {
    var task1 = { name: 'task a', month: 1, day: 20, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 14, year: 2017};
    var task3 = { name: 'task b', month: 1, day: 9, year: 2017};
    
    var sorted = sortPipe.transform([task1, task2, task3]);
    expect(sorted).to.be.eql([task3, task2, task1]);
  });
             
  it('should sort tasks based on year, month, day, then name', function() {
    var task1 = { name: 'task a', month: 1, day: 14, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 14, year: 2017};
    var task3 = { name: 'task b', month: 1, day: 14, year: 2017};
    
    var sorted = sortPipe.transform([task1, task2, task3]);
    expect(sorted).to.be.eql([task1, task3, task2]);
  });

  it('should not mutate the given input', function() {
    var task1 = { name: 'task a', month: 1, day: 14, year: 2017};
    var task2 = { name: 'task b', month: 1, day: 14, year: 2017};
    
    var input = [task2, task1];
    
    sortPipe.transform(input);
    expect(input[0]).to.be.eql(task2);
  });
           
});
