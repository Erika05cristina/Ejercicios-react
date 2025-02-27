// describe('Blog app', function() {
//   beforeEach(function() {
//     cy.visit('http://localhost:5173')
//   })

//   it('Login form is shown', function() {
//     cy.contains('Log in to application')
//     cy.get('input[name="username"]')
//     cy.get('input[name="password"]')
//     cy.get('button').contains('Login')
//   })
// })

describe("Blog app", function () {
  beforeEach(function () {
    const user = {
      name: "villa",
      username: "villa",
      password: "villa",
    };
    cy.request("POST", "http://localhost:3003/api/users/register", user);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get('input[name="username"]').type("villa");
      cy.get('input[name="password"]').type("villa");
      cy.get("button").contains("Login").click();

      cy.contains("villa logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get('input[name="username"]').type("villa123");
      cy.get('input[name="password"]').type("123");
      cy.get("button").contains("Login").click();

      cy.contains("Invalid username or password").should(
        "have.css",
        "color",
        "rgb(255, 0, 0)"
      );
    });
  });
});
