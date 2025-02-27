describe("Blog app1", function () {
  beforeEach(function () {
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get("button").contains("Login");
  });
});

describe("Blog app", function () {
  beforeEach(function () {
    cy.session("villa-session", () => {
      cy.visit("http://localhost:5173");
      cy.get('input[name="username"]').type("villa");
      cy.get('input[name="password"]').type("villa");
      cy.get("button").contains("Login").click();
      cy.contains("villa logged in");
    });
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get("button").contains("Login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get('input[name="username"]').type("villa");
      cy.get('input[name="password"]').type("villa");
      cy.get("button").contains("Login").click();

      cy.contains("villa logged in");
    });

    // it("fails with wrong credentials", function () {
    //   cy.get('input[name="username"]').type("villa123");
    //   cy.get('input[name="password"]').type("123");
    //   cy.get("button").contains("Login").click();

    //   cy.contains("Invalid username or password").should(
    //     "have.css",
    //     "color",
    //     "rgb(255, 0, 0)"
    //   );
    // });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.visit("http://localhost:5173");
    });

    it("A blog can be created", function () {
      cy.contains("Create new blog").should("be.visible").click();

      cy.get('input[name="title"]').should("be.visible");

      cy.get('input[name="title"]').type("Cypress Testing");
      cy.get('input[name="author"]').type("villa");
      cy.get('input[name="url"]').type("https://cypress.io");
      cy.get("button").contains("Create").click();
      cy.contains("Cypress Testing villa");
    });

    it("User can like a blog", function () { 
      cy.contains("Cypress Testing villa")
        .parent()  
        .find("button")
        .contains("View")  
        .click();  
      cy.contains("Cypress Testing villa")
        .parent()
        .find("button")
        .contains("Like")
        .click();  
      cy.contains("Cypress Testing villa")
        .parent()
        .find(".likes")  
        .should("contain", "1");  
    });
  });
});
