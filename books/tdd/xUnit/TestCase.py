class TestCase:
  def __init__(self, name):
    self.name = name

  def setUp(self):
    pass
  
  def run(self):
    self.setUp()
    method = getattr(self, self.name)
    method()
    self.tearDown()

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

  def tearDown(self):
    self.log = self.log + "tearDown "

class TestCaseTest(TestCase):
  def run(self):
    self.test = WasRun("testMethod")

  def testTemplateMethod(self):
    self.test.run()
    assert("setUp testMethod tearDown " == self.test.log)

TestCaseTest("testTemplateMethod").run()