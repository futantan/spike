class TestResult:
  def __init__(self):
    self.runCount = 0
    self.errorCount = 0
  
  def testFailed(self):
    self.errorCount = self.errorCount + 1

  def testStarted(self):
    self.runCount = self.runCount + 1

  def summary(self):
    return "%d run, %d failed" % (self.runCount, self.errorCount)

class TestCase:
  def __init__(self, name):
    self.name = name

  def setUp(self):
    pass
  
  def run(self):
    result = TestResult()
    result.testStarted()
    self.setUp()
    try:
      method = getattr(self, self.name)
      method()
    except:
      result.testFailed()
    self.tearDown()
    return result

  def tearDown(self):
    pass

class WasRun(TestCase):
  def __init__(self, name):
    TestCase.__init__(self, name)

  def setUp(self):
    self.wasRun = None
    self.log = "setUp "

  def testMethod(self):
    self.wasRun = 1
    self.log = self.log + "testMethod "
  
  def testBrokenMethod(self):
    raise Exception

  def tearDown(self):
    self.log = self.log + "tearDown "

class TestCaseTest(TestCase):
  def setUp(self):
    self.test = WasRun("testMethod")
  
  def testResult(self):
    test = WasRun("testMethod")
    result = self.test.run()
    assert("1 run, 0 failed" == result.summary())
  
  def testFailedResult(self):
    test = WasRun("testBrokenMethod")
    result = test.run()
    assert("1 run, 1 failed", result.summary())
    
  def testTemplateMethod(self):
    self.test.run()
    assert("setUp testMethod tearDown " == self.test.log)

  def testFailedResultFormatting(self):
    result = TestResult()
    result.testStarted()
    result.testFailed()
    assert("1 run, 1 failed" == result.summary())

TestCaseTest("testTemplateMethod").run()
TestCaseTest("testResult").run()
TestCaseTest("testFailedResultFormatting").run()