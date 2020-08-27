describe('New host page', () => {
  /**
   * About section is already tested in `04-collective.test.js`
   */
  before(() => {
    cy.visit('/opensourceorg');
  });

  describe('Contributions section', () => {
    // The rest of the contributions section is already tested in `05-user.test.js`
    it('Show fiscally hosted collectives', () => {
      cy.contains('[data-cy~="filter-button"]', 'Hosted Collectives').click();
      cy.contains('[data-cy=Contributions]', 'Open Source Collective');
      cy.contains('[data-cy=Contributions]', 'APEX');
      cy.contains('[data-cy=Contributions]', 'tipbox');
      cy.contains('[data-cy=Contributions]', 'Test Collective');
    });
  });

  describe('Contributors section', () => {
    it('Only shows core contributors without any filter', () => {
      cy.get('[data-cy=Contributors] button').should('not.exist');
      cy.contains('[data-cy=contributors-grid]', /(pia mancini|Xavier Damma|Open Source Host User)/);
    });
  });
});
