describe('apply to host', () => {
  it('as a new collective', () => {
    cy.visit('/brusselstogetherasbl');
    cy.get('#hosting h1').contains('We are fiscally hosting 2 Collectives');
    cy.get('.CollectiveCover button')
      .contains('Apply to create a collective')
      .click();
    cy.get('#email').type('testuser@opencollective.com');
    cy.wait(500);
    cy.get('[data-cy="signin-btn"]').click();
    cy.fillInputField('name', 'New collective');
    cy.fillInputField('description', 'short description for new collective');
    cy.fillInputField('website', 'https://xdamman.com');
    cy.get('.tos input[type="checkbox"]').click();
    cy.wait(300);
    cy.get('.actions button').click();
    cy.wait(1000);
    cy.get('.CollectivePage .CollectiveCover h1', { timeout: 10000 }).contains('New collective');
    cy.get('.CollectivePage .CollectiveCover .website').contains('xdamman.com');
    cy.get('.NotificationBar h1').contains('success');
    cy.get('.NotificationBar p').contains('BrusselsTogether ASBL');
    cy.url().then(currentUrl => {
      const CollectiveId = currentUrl.match(/CollectiveId=([0-9]+)/)[1];
      return cy.visit(`/brusselstogetherasbl/collectives/${CollectiveId}/approve`);
    });
    cy.get('.error .message').contains(
      'You need to be logged in as an admin of the host of this collective to approve it',
    );
  });
});
