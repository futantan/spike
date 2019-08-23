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
})
