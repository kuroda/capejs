"use strict";

function stubFetchAPI(spy, data) {
  data = data || {};
  sinon.stub(global, 'fetch', function(path, options) {
    return {
      then: function(callback1) {
        callback1.call(this, { json: spy });
        return {
          then: function(callback2) {
            callback2.call(this, data);
            return {
              catch: function(callback3) {
                callback3.call(this, new Error(''));
              }
            }
          }
        }
      }
    }
  });
}

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

  describe('#ajax GET', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent('users');
      sinon.stub(agent, 'refresh');

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.ajax('GET', '/users', { page: 1, per_page: 20 }, spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.refresh.called).to.be.false;

      global.fetch.restore();
    })
  })

  describe('#ajax POST', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent('users');
      sinon.stub(agent, 'refresh');

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.ajax('POST', '/users', { name: 'X', password: 'Y' }, spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.refresh.called).to.be.true;

      global.fetch.restore();
    })

    it('should not call agent.refresh()', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent('users', { autoRefresh: false });
      sinon.stub(agent, 'refresh');

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.ajax('POST', '/users', { name: 'X', password: 'Y' }, spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.refresh.called).to.be.false;

      global.fetch.restore();
    })
  })

  describe('#refresh', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy1, spy2, spy3;

      spy1 = sinon.spy();
      stubFetchAPI(spy1, { users: [ {}, {} ] });
      agent = new Cape.CollectionAgent('users');
      sinon.stub(agent, 'defaultErrorHandler');
      agent.refresh();
      expect(spy1.called).to.be.true;
      expect(agent.objects.length).to.equal(2);
      global.fetch.restore();
    })
  })
})
