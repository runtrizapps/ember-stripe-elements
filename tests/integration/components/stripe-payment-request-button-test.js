import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import StripeMock from 'ember-stripe-elements/utils/stripe-mock';
import env from 'dummy/config/environment';

moduleForComponent('stripe-payment-request-button', 'Integration | Component | stripe payment request button', {
  integration: true,
  beforeEach() {
    window.Stripe = StripeMock;

    let config = {
      mock: true,
      publishableKey: env.stripe.publishableKey
    };

    this.register('config:stripe', config, { instantiate: false });
    this.inject.service('stripev3', 'config', 'config:stripe');
  }
});

test('it renders', function(assert) {
  // Template block usage:
  this.render(hbs`
    {{#stripe-payment-request-button
      paymentOptions=(hash total=(hash amount=1000))
    }}
      template block text
    {{/stripe-payment-request-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
