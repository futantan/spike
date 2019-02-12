class TestCase:
  def __init__(self, name):
    self.name = name

  def setUp(self):
    pass
  
  def run(self):
    self.setUp()
    method = getattr(self, self.name)
    method()

class WasRun(TestCase):
  def __init__(self, name):
    TestCase.__init__(self, name)

  def setUp(self):
    self.wasRun = None
    self.wasSetup = 1

  def testMethod(self):
    self.wasRun = 1

class TestCaseTest(TestCase):
  def run(self):
    self.test = WasRun("testMethod")

  def testSetup(self):
    test.run()
    assert(test.wasSetup)

  def testRunning(self):
    test.run()
    assert(test.wasRun)

TestCaseTest("testRunning").run()
TestCaseTest("testSetup").run()