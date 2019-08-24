const expect = require('chai').expect
const sinon = require('sinon')
const fs = require('fs')
const Stockfetch = require('../src/stockfetch')

describe('Stockfetch tests', () => {
  let stockfetch
  let sandbox

  beforeEach(() => {
    stockfetch = new Stockfetch()
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should pass this canary test', () => {
    expect(true).to.be.true
  })

  it('read should invoke error handler for invalid file', (done) => {
    const onError = (err) => {
      expect(err).to.be.eq('Error reading file: InvalidFile')
      done();
    }

    sandbox.stub(fs, 'readFile', (fileName, callback) => {
      callback(new Error('failed'))
    })

    stockfetch.readTickersFile('InvalidFile', onError)
  })

  it('read should invoke processTickers for valid file', (done) => {
    const rawData = 'GOOG\nAAPL\nORCL\nMSFT'
    const parsedData = ['GOOG', 'APPL', 'ORCL', 'MSFT']

    sandbox.stub(stockfetch, 'parseTickers').withArgs(rawData).returns(parsedData)
    sandbox.stub(stockfetch, 'processTickers', (data) => {
      expect(data).to.be.eql(parsedData)
      done()
    })
    sandbox.stub(fs, 'readFile', (fileName, callback) => {
      callback(null, rawData)
    })

    stockfetch.readTickersFile('tickers.txt')
  })

  it('read should return error if given file is empty', (done) => {
    const onError = (err) => {
      expect(err).to.be.eql('File tickers.txt has invalid content')
      done()
    }

    sandbox.stub(stockfetch, 'parseTickers').withArgs('').returns([])
    sandbox.stub(fs, 'readFile', (fileName, callback) => {
      callback(null, '')
    })

    stockfetch.readTickersFile('tickers.txt', onError)
  })

  it('parseTickers should return tickers', () => {
    expect(stockfetch.parseTickers('A\nB\nC')).to.be.eql(['A', 'B', 'C'])
  })

  it('parseTickers should return empty array for empty content', () => {
    expect(stockfetch.parseTickers('')).to.be.eql([])
  })

  it('parseTickers should return empty array for white-space', () => {
    expect(stockfetch.parseTickers(' ')).to.be.eql([])
  })

  it('parseTickers should ignore unexpected format in content', () => {
    const rawData = 'APPL \nBla h\nGOOG\n\n'
    expect(stockfetch.parseTickers(rawData)).to.be.eql(['GOOG'])
  })

  it('processTickers should call getPrice for each ticker symbol', () => {
    const stockfetchMock = sandbox.mock(stockfetch)
    stockfetchMock.expects('getPrice').withArgs('A')
    stockfetchMock.expects('getPrice').withArgs('B')
    stockfetchMock.expects('getPrice').withArgs('C')

    stockfetch.processTickers(['A', 'B', 'C'])
    stockfetchMock.verify()
  })

  it('processTickers should save tickers count', () => {
    sandbox.stub(stockfetch, 'getPrice')

    stockfetch.processTickers(['A', 'B', 'C'])
    expect(stockfetch.tickersCount).to.be.eql(3)
  })

  it('getPrice should call get on http with valid URL', (done) => {
    const httpStub = sandbox.stub(stockfetch.http, 'get', (url) => {
      expect(url).to.be.eql('http://ichart.finance.yahoo.com/table.csv?s=GOOG')
      done()
      return {on: function() {}}
    })

    stockfetch.getPrice('GOOG')
  })

  it('getPrice should send a response handler to get', (done) => {
    const aHandler = function() {}

    sandbox.stub(stockfetch.processResponse, 'bind')
           .withArgs(stockfetch, 'GOOG')
           .returns(aHandler)

    const httpStub = sandbox.stub(stockfetch.http, 'get', (url, handler) => {
      expect(handler).to.be.eql(aHandler)
      done()
      return {on: () => {}}
    })

    stockfetch.getPrice('GOOG')
  })

  it('getPrice should register handler for failure to reach host', (done) => {
    const errorHandler = () => {}
    sandbox.stub(stockfetch.processHttpError, 'bind')
           .withArgs(stockfetch, 'GOOG')
           .returns(errorHandler)

    const onStub = (event, handler) => {
      expect(event).to.be.eql('error')
      expect(handler).to.be.eql(errorHandler)
      done()
    }
    sandbox.stub(stockfetch.http, 'get').returns({on: onStub})
    stockfetch.getPrice('GOOG')
  })

  it('processResponse should call parsePrice with valid data', () => {
    let dataFunction, endFunction
    const response = {
      statusCode: 200,
      on: function(event, handler) {
        if (event === 'data') dataFunction = handler
        if (event === 'end') endFunction = handler
      }
    }

    const parsePriceMock = sandbox.mock(stockfetch)
                                  .expects('parsePrice').withArgs('GOOG', 'some data')
    stockfetch.processResponse('GOOG', response)
    dataFunction('some ')
    dataFunction('data')
    endFunction()

    parsePriceMock.verify()
  })

  it('processResponse should call processError if response failed', () => {
    const response = { statusCode: 404 }
    const processErrorMock = sandbox.mock(stockfetch)
                                    .expects('processError')
                                    .withArgs('GOOG', 404)

    stockfetch.processResponse('GOOG', response)
    processErrorMock.verify()
  })

  it('processResponse should call processError only if response failed', () => {
    const response = {
      statusCode: 200,
      on: () => {}
    }
    const processErrorMock = sandbox.mock(stockfetch)
                                    .expects('processError')
                                    .never()

    stockfetch.processResponse('GOOG', response)
    processErrorMock.verify()
  })

  it('processHttpError should call processError with error details', () => {
    const processErrorMock = sandbox.mock(stockfetch)
                                    .expects('processError')
                                    .withArgs('GOOG', '...error code...')
    const error = {code: '...error code...'}
    stockfetch.processHttpError('GOOG', error)
    processErrorMock.verify()
  })

  const data = "Date,Open,High,Low,Close,Volume,Adj Close\n\2015-09-11,619.75,625.780029,617.419983,625.77002,1360900,625.77002\n\2015-09-10,613.099976,624.159973,611.429993,621.349976,1900500,621.349976";
  it('parsePrice should update prices', () => {
    stockfetch.parsePrice('GOOG', data)
    expect(stockfetch.prices.GOOG).to.be.eql('625.77002')
  })

  it('parsePrice should call printReport', () => {
    const printReportMock = sandbox.mock(stockfetch)
                                   .expects('printReport')
    stockfetch.parsePrice('GOOG', data)
    printReportMock.verify()
  })

  it('processError should update errors', () => {
    stockfetch.processError('GOOG', '...oops...')
    expect(stockfetch.errors.GOOG).to.be.eql('...oops...')
  })

  it('processError should call printReport', () => {
    const printReportMock = sandbox.mock(stockfetch).expects('printReport')
    stockfetch.processError('GOOG', '...oops...')
    printReportMock.verify()
  })

  it('printReport should send price, errors once all responses arrive', () => {
    stockfetch.prices = { 'GOOG': 12.34 }
    stockfetch.errors = { 'APPL': 'error' }
    stockfetch.tickersCount = 2
    const callbackMock = sandbox.mock(stockfetch)
                                .expects('reportCallback')
                                .withArgs([['GOOG', 12.34]], [['APPL', 'error']])
    stockfetch.printReport()
    callbackMock.verify()
  })

  it('printReport should not send before all responses arrive', () => {
    stockfetch.prices = { 'GOOG': 12.34 }
    stockfetch.errors = { 'AAPL': 'error' }
    stockfetch.tickersCount = 3
    const callbackMock = sandbox.mock(stockfetch)
                                .expects('reportCallback')
                                .never()
    stockfetch.printReport()
    callbackMock.verify()
  })

  it('printReport should call sortData once for prices, once for errors', () => {
    stockfetch.prices = { 'GOOG': 12.34 }
    stockfetch.errors = { 'AAPL': 'error' }
    stockfetch.tickersCount = 2
    const mock = sandbox.mock(stockfetch)
    mock.expects('sortData').withArgs(stockfetch.prices)
    mock.expects('sortData').withArgs(stockfetch.errors)

    stockfetch.printReport()
    mock.verify()
  })

  it('sortData should sort the data based on the symbols', () => {
    const dataToSort = {
      'GOOG': 1.2,
      'AAPL': 2.1
    }
    const result = stockfetch.sortData(dataToSort)
    expect(result).to.be.eql([['AAPL', 2.1], ['GOOG', 1.2]])
  })
})
