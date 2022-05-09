describe('create a collective', () => {
  beforeEach(() => {
    cy.signup({ redirect: '/create' });
  });

  it('Picks a category and fills out the Create Collective Form', () => {
    cy.getByDataCy('ccf-category-picker-button-community').click();
    cy.getByDataCy('ccf-form-name').type('Bees are neat');
    cy.getByDataCy('ccf-form-slug')
      .first()
      .find('input')
      .invoke('val')
      .then(sometext => expect(sometext).to.equal('bees-are-neat'));
    cy.getByDataCy('ccf-form-description').type('We are going to save the bees');
    cy.get('[data-cy="custom-checkbox"').click();
    cy.get('[data-cy=ccf-form-submit]').click();
    cy.url().should('include', '/bees-are-neat/onboarding');
  });

  it('Cannot create a collective with a slug that is taken', () => {
    cy.getByDataCy('ccf-category-picker-button-community').click();
    cy.getByDataCy('ccf-form-name').type('Bees are neat');
    cy.getByDataCy('ccf-form-description').type('I just really like them');
    cy.get('[data-cy="custom-checkbox"').click();
    cy.get('[data-cy=ccf-form-submit]').click();
    cy.get('[data-cy=ccf-error-message]').contains(
      'The slug bees-are-neat is already taken. Please use another slug for your collective.',
    );
  });

  it('Can create a collective with tags', () => {
    cy.getByDataCy('ccf-category-picker-button-community').click();
    cy.getByDataCy('ccf-form-name').type('Bees are vicious');
    cy.getByDataCy('ccf-form-description').type('I do not like them');
    cy.get('[data-cy=styled-input-tags-open]').click();
    cy.get('[data-cy=styled-input-tags-add-suggestion-meetup]').click();
    cy.get('[data-cy=styled-input-tags-input]').type('opencollective-tag{enter}{esc}');
    cy.get('[data-cy=ccf-form-tags]').contains('opencollective-tag');
    cy.get('[data-cy="custom-checkbox"').click();
    cy.get('[data-cy=ccf-form-submit]').click();
  });
});
