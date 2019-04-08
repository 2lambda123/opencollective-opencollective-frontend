describe('event.createOrder page', () => {
  it('makes an order for a free ticket as an existing user', () => {
    cy.login({ redirect: '/opensource/events/webpack-webinar' });
    cy.get('#free.tier .btn.increase').click();
    cy.get('#free.tier .ctabtn').click();
    cy.location().should(location => {
      expect(location.pathname).to.eq('/opensource/events/webpack-webinar/order/78');
      expect(location.search).to.eq('?quantity=2&totalAmount=0');
    });

    cy.contains('Next step').click();

    // Free per default
    cy.get('input[type=number][name=custom-amount]').should('have.value', '0');
    cy.get('input[type=number][name=quantity]').should('have.value', '2');
    cy.contains('.step-details', 'Free');

    // Has truncated event details
    cy.contains("Time: Oct 9 at 5PM, US Pacific time. That's 8PM Eastern.");
    cy.contains('Ask Sean questions about how to grow your com...');
    cy.contains('Show more');

    // Can submit freely
    cy.contains('Next step').click();
    cy.contains('This is a free ticket, you can submit your order directly.');

    cy.contains('Make contribution').click();
    cy.contains(
      'Test User Admin has registered for the event Webinar: How Webpack Reached $400K+/year in Sponsorship & Crowdfunding (Free)',
    );
  });

  it('makes an order for a paying ticket as an existing user', () => {
    cy.signup({ redirect: '/opensource/events/webpack-webinar' });
    cy.get('#silver-sponsor.tier .btn.increase').click();
    cy.get('#silver-sponsor.tier .ctabtn').click();
    cy.location().should(location => {
      expect(location.pathname).to.eq('/opensource/events/webpack-webinar/order/77');
      expect(location.search).to.eq('?quantity=2&totalAmount=50000');
    });

    cy.contains('Next step').click();

    cy.get('input[type=number][name=custom-amount]').should('have.value', '250');
    cy.get('input[type=number][name=quantity]').should('have.value', '2');
    cy.contains('.step-details', '$250.00 x 2');

    // Submit
    cy.contains('Next step').click();
    cy.contains('You’ll contribute with the amount of $500.00.');
    cy.wait(1000); // Wait for stripe to be loaded
    cy.fillStripeInput();
    cy.contains('button', 'Make contribution').click();

    cy.get('#page-order-success', { timeout: 20000 }).contains('$500.00');
    cy.contains(
      "You've registered for the event Webinar: How Webpack Reached $400K+/year in Sponsorship & Crowdfunding (Silver Sponsor)",
    );
  });

  it('makes an order for tickets with VAT', () => {
    cy.signup({ redirect: '/brusselstogether/events/meetup-2/order/2' });
    cy.contains('button', 'Next step').click();
    cy.get('input[type=number][name=quantity]').type('{selectall}8');
    cy.contains('button', 'Next step').click();
    cy.useAnyPaymentMethod();
    cy.contains('button', 'Next step').click();

    // Check step summary
    cy.contains('.breakdown-line', 'Item price').contains('€10.00');
    cy.contains('.breakdown-line', 'Quantity').contains('8');
    cy.contains('.breakdown-line', 'Your contribution').contains('€80.00');

    // Algeria should not have taxes
    cy.wait(500);
    cy.get('div[name=country]').click();
    cy.wait(250);
    cy.contains('ul[role=listbox] li', 'Algeria').click();
    cy.contains('.breakdown-line', 'VAT').contains('+ €0.00');
    cy.contains('.breakdown-line', 'TOTAL').contains('€80.00');
    cy.contains('button', 'Make contribution').should('not.be.disabled');

    // French should have taxes
    cy.get('div[name=country]').click();
    cy.wait(250);
    cy.get('ul[role=listbox] > div').scrollTo(0, 2250);
    cy.contains('ul[role=listbox] li', 'France - FR').click();
    cy.contains('.breakdown-line', 'VAT').contains('+ €16.80');
    cy.contains('.breakdown-line', 'TOTAL').contains('€96.80');
    cy.contains('button', 'Make contribution').should('not.be.disabled');

    // ...except if they can provide a valid VAT number
    cy.contains('div', 'Enter VAT number (if you have one)').click();

    // Submit is disabled while form is active
    cy.contains('button', 'Make contribution').should('be.disabled');
    cy.get('.cf-tax-form .close').click();
    cy.contains('button', 'Make contribution').should('not.be.disabled');

    // Must provide a valid VAT number
    cy.contains('div', 'Enter VAT number (if you have one)').click();
    cy.contains('.cf-tax-form button', 'Done').should('be.disabled');
    cy.get('input[name=taxIndentificationNumber]').type('424242');
    cy.contains('.cf-tax-form button', 'Done').click();
    cy.contains('Invalid VAT number');
    cy.get('input[name=taxIndentificationNumber]').type('{selectall}FR-XX999999999');
    cy.contains('.cf-tax-form button', 'Done').click();

    // Values should be updated
    cy.contains('button', 'Make contribution').should('not.be.disabled');
    cy.contains('FRXX999999999'); // Number is properly formatted
    cy.contains('.breakdown-line', 'VAT').contains('+ €0.00');
    cy.contains('.breakdown-line', 'TOTAL').contains('€80.00');

    // User can update the number
    cy.contains('div', 'Change VAT number').click();
    cy.get('input[name=taxIndentificationNumber]').should('have.value', 'FRXX999999999');
    cy.get('input[name=taxIndentificationNumber]').type('{selectall}FR-XX-999999998');
    cy.contains('.cf-tax-form button', 'Done').click();
    cy.contains('FRXX999999998'); // Number is properly formatted

    // However if it's the same country than the collective than VAT should still apply,
    // even if the contributor is an organization
    cy.get('div[name=country]').click();
    cy.wait(250);
    cy.get('ul[role=listbox] > div').scrollTo(0, 500);
    cy.contains('ul[role=listbox] li', 'Belgium - BE').click();
    cy.contains('.breakdown-line', 'VAT').contains('+ €16.80');
    cy.contains('.breakdown-line', 'TOTAL').contains('€96.80');
    cy.contains('div', 'Enter VAT number (if you have one)').click();
    cy.get('input[name=taxIndentificationNumber]').type('FRXX999999998');
    cy.contains('.cf-tax-form button', 'Done').click();
    // Tried to use a french VAT number with Belgium
    cy.contains("The VAT number doesn't match the country");
    cy.get('input[name=taxIndentificationNumber]').type('{selectall}BE-0414445663');
    cy.contains('.cf-tax-form button', 'Done').click();
    cy.contains('BE0414445663'); // Number is properly formatted
    cy.contains('.breakdown-line', 'VAT').contains('+ €16.80');
    cy.contains('.breakdown-line', 'TOTAL').contains('€96.80');

    // Let's submit this order!
    cy.contains('button', 'Make contribution').click();
    cy.contains("You've registered for the event BrusselsTogether Meetup 2 (donate)");
  });
});
