"use strict";

describe('CollectionAgent', function() {
  describe('constructor', function() {
    it('should take resource name as the first argument', function() {
      var agent;

      agent = new Cape.CollectionAgent('users');

      expect(agent.resourceName).to.equal('users');
    })

    it('should take an object (options) as the second argument', function() {
      var options, agent;

      options = { pathPrefix: '/api/' }
      agent = new Cape.CollectionAgent('users', options);

      expect(agent.options).to.equal(options);
    })

    it('should call agent adapter', function() {
      var options, agent;

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();

      options = { adapter: 'foo_bar' }
      new Cape.CollectionAgent('user', options);

      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true;

      Cape.AgentAdapters.FooBarAdapter = undefined;
    })
  })


  describe('#collectionPath', function() {
    it('should return standard values', function() {
      var agent;

      agent = new Cape.CollectionAgent('users');

      expect(agent.collectionPath()).to.equal('/users');
    })

    it('should add prefix to the paths', function() {
      var agent;

      agent = new Cape.CollectionAgent('users', { pathPrefix: '/api/' });

      expect(agent.collectionPath()).to.equal('/api/users');
    })
  })

  describe('#memberPath', function() {
    it('should return standard values', function() {
      var agent;

      agent = new Cape.CollectionAgent('users');

      expect(agent.memberPath(123)).to.equal('/users/123');
    })

    it('should add prefix to the paths', function() {
      var agent;

      agent = new Cape.CollectionAgent('users', { pathPrefix: '/api/' });

      expect(agent.memberPath(123)).to.equal('/api/users/123');
    })
  })
})
