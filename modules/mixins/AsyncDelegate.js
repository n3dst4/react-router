var React = require('react');
var Promise = require('when/lib/Promise');

var AsyncDelegate = {

  childContextTypes: {
    asyncDelegate: React.PropTypes.any.isRequired
  },

  getChildContext: function () {
    return {
      asyncDelegate: this
    };
  },

  componentWillMount: function () {
    this.promises = [];
  },

  /**
   * Resolves all values in asyncState and calls the setState
   * function with new state as they resolve. Returns a promise
   * that resolves after all values are resolved.
   */
  resolveAsyncState: function (asyncState, setState) {
    if (asyncState == null)
      return Promise.resolve();

    var keys = Object.keys(asyncState);
    
    var promise = Promise.all(
      keys.map(function (key) {
        return Promise.resolve(asyncState[key]).then(function (value) {
          var newState = {};
          newState[key] = value;
          setState(newState);
        });
      })
    );

    this.promises.push(promise);

    return promise;
  },

  /**
   * Returns a promise that resolves when all async operations resolve.
   */
  resolveAll: function () {
    return Promise.all(this.promises);
  }

};

module.exports = AsyncDelegate;
