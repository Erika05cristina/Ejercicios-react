describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')  
    cy.get('input[name="username"]') 
    cy.get('input[name="password"]') 
    cy.get('button').contains('Login') 
  })
})
