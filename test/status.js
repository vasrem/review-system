var chai = require('chai')
var expect = require('chai').expect

chai.use(require('chai-http'))
chai.use(require('chai-as-promised'))

var app = require('../server.js')
describe('Connectivity', function() {
	it('should listen to port 3000', () => {
		return chai.request(app)
			.get('/')
			.then((res) => {
				expect(res).to.have.status(200)
			})
	})
	it('should connect to mongodb', () => {
		return expect(require('../lib/mongodb-controller').checkMongo()).to.be.fulfilled
	})
})
