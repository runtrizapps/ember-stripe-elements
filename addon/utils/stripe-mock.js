import Ember from 'ember';

const {
  RSVP: { Promise }
} = Ember;

let StripeMock = function(publishableKey) {
  this.publishableKey = publishableKey;
}

StripeMock.prototype.elements = function() {
  return {
    create: function() {
      return {
        mount: function() {},
        on: function() {},
        unmount: function() {}
      }
    }
  };
}
StripeMock.prototype.createToken = function() {}
StripeMock.prototype.createSource = function() {}
StripeMock.prototype.retrieveSource = function() {}
StripeMock.prototype.paymentRequest = function() {
  return {
    on: function() {},
    canMakePayment: () => Promise.resolve(true)
  }
}

export default StripeMock;
