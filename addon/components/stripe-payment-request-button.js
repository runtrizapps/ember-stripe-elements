import StripeElement from './stripe-element';
import layout from '../templates/components/stripe-payment-request-button';
import { computed, get, set } from '@ember/object';
import Ember from 'ember';

const { merge } = Ember;

export default StripeElement.extend({
  layout,

  classNames: ['ember-stripe-payment-request-button'],

  isLoading: true,
  canMakePayment: false,

  notSupported: computed('isLoading', 'canMakePayment', function() {
    return !get(this, 'isLoading') && !get(this, 'canMakePayment');
  }),

  didInsertElement() {
    const stripe = this.get('stripev3');
    const elements = get(this, 'stripev3.elements')();

    // Fetch user options
    const options = get(this, 'options');
    const paymentOptions = get(this, 'paymentOptions');

    const paymentRequest = stripe.paymentRequest(merge({ country: 'US', currency: 'usd' }, paymentOptions)); // TODO remove default

    // `stripeElement` instead of `element` to distinguish from `this.element`
    const stripeElement = elements.create('paymentRequestButton', merge({ paymentRequest }, options));

    // Make the paymentRequest and element available to the component
    set(this, 'paymentRequest', paymentRequest);
    set(this, 'stripeElement', stripeElement);

    this.checkForPayment();
  },

  checkForPayment() {
    return get(this, 'paymentRequest').canMakePayment()
      .then((canMakePayment) => {
        if (this.get('isDestroyed')) {
          return;
        }

        set(this, 'isLoading', false);
        set(this, 'canMakePayment', !!canMakePayment);
        if (canMakePayment) {
          this.setEventListeners();
          this.mount();
        }
      });
  },

  setEventListeners() {
    const paymentRequest = get(this, 'paymentRequest');
    paymentRequest.on('token',  (event) => this.sendAction('token', paymentRequest, event));
    paymentRequest.on('cancel', (event) => this.sendAction('cancel', paymentRequest, event));
    paymentRequest.on('shippingaddresschange', (event) => this.sendAction('shippingaddresschange', paymentRequest, event));
    paymentRequest.on('shippingoptionchange',  (event) => this.sendAction('shippingoptionchange', paymentRequest, event));
  },

  mount() {
    // Mount the Stripe Element onto the mount point
    get(this, 'stripeElement').mount(this.element.querySelector('[role="mount-point"]'));
  }
});
