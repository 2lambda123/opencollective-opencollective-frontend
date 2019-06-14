describe('Tier page', () => {
  // Collective created for this test
  let collective = null;
  let tierUrl = null;

  before(() => {
    cy.createHostedCollective().then(c => {
      collective = c;
      cy.visit(`/${collective.slug}/tiers`);
      cy.contains('[data-cy=tiers] a', 'contribute').then($a => {
        const splitUrl = $a.attr('href').split('/');
        const tierSlugDashId = splitUrl[splitUrl.length - 2];
        tierUrl = `/${collective.slug}/contribute/${tierSlugDashId}`;
      });
    });
  });

  it('Can edit tier name', () => {
    cy.login({ redirect: tierUrl });
    cy.get('[data-cy="InlineEditField-Trigger-name"]').click();
    cy.get('[data-cy="InlineEditField-Textarea-name"]').type('{selectall}Plant potatoes on the moon');
    cy.get('[data-cy="InlineEditField-Btn-Save"]').click();
    cy.get('[data-cy="TierName"]').should('contain', 'Plant potatoes on the moon');
  });

  it('Can edit short description', () => {
    cy.login({ redirect: tierUrl });
    cy.get('[data-cy="InlineEditField-Add-description"]').click();
    cy.get('[data-cy="InlineEditField-Textarea-description"]').type("Let's do dis!");
    cy.get('[data-cy="InlineEditField-Btn-Save"]').click();
    cy.get('[data-cy="shortDescription"]').should('contain', "Let's do dis!");
  });

  it('Can edit long description', () => {
    const richDescription = 'Hello{selectall}{ctrl}B{rightarrow}{ctrl}B world!';
    cy.login({ redirect: tierUrl });
    cy.get('[data-cy="Btn-Add-longDescription"]').click();
    cy.get('[data-cy="HTMLEditor"] .ql-editor').type(richDescription);
    cy.get('[data-cy="InlineEditField-Btn-Save"]').click();
    cy.get('[data-cy="longDescription"]').should('have.html', '<p><strong>Hello</strong> world!</p>');
  });

  it('Goes to the contribution flow when we click on "Contribute"', () => {
    cy.login({ redirect: tierUrl });
    cy.get('[data-cy="ContributeBtn"]').click();
    cy.location('pathname').should('equal', `${tierUrl}/checkout`);
  });
});
