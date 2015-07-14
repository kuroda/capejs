"use strict";

describe('CollectionAgent', function() {
  describe('constructor', function() {
    it('should take resource name as the first argument', function() {
      var form, agent;

      form = { id: 123 };
      agent = new Cape.CollectionAgent('users');

      expect(agent.resourceName).to.equal('users');
    })

    it('should take an object (options) as the second argument', function() {
      var form, options, agent;

      form = { id: 123 };
      options = { pathPrefix: '/api/' }
      agent = new Cape.CollectionAgent('users', options);

      expect(agent.options).to.equal(options);
    })

    it('should call agent adapter', function() {
      var form, options, agent;

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();

      form = { id: 123 };
      options = { adapter: 'foo_bar' }
      new Cape.CollectionAgent('user', options);

      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true;

      Cape.AgentAdapters.FooBarAdapter = undefined;
    })
  })
})
