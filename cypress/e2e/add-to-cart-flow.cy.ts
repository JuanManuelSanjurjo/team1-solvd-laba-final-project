/// <reference types="cypress" />
describe("Add prodcuts to cart product flow", () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login();
  });
  it("should allow to add product to cart from the card", () => {
    cy.visit("/products");
    cy.contains("Add to cart").first().should("be.visible").click();
    cy.contains(/choose/i).click();
    cy.get("[data-value]").eq(2).click();
    cy.get("button").contains("Add").click();
    cy.visit("/cart");
    cy.contains(/checkout/i)
      .should("be.visible")
      .click({ force: true });
  });

  describe("will allow to add product to cart from the product page and complete flow", () => {
    beforeEach(() => {
      cy.visit("/products");
      cy.contains(/shoes/i).first().click({ force: true });
      cy.contains(/eu/i).first().should("be.visible").click({ force: true });
      cy.get("button").contains("Add to cart").click();
      cy.visit("/cart");
      cy.contains(/shoes/i).first().should("be.visible").click({ force: true });
      cy.contains(/checkout/i)
        .first()
        .click({ force: true });
    });
    it("clicking confirm will trigger all required fields, filling them will erase the error messages", () => {
      cy.contains(/confirm/i)
        .should("be.visible")
        .click();
      cy.contains(/name is required/i).should("be.visible");
      cy.contains(/surname is required/i).should("be.visible");
      cy.contains(/enter a valid email/i).should("be.visible");
      cy.contains(/phone is too short/i).should("be.visible");
      cy.contains(/country is required/i).should("be.visible");
      cy.contains(/city is required/i).should("be.visible");
      cy.contains(/state is required/i).should("be.visible");
      cy.contains(/enter a full address/i).should("be.visible");
      cy.contains(/valid zip/i).should("be.visible");
      // filling out the form will erase the error messages
      cy.get('[name="name"]').type("John");
      cy.get('[name="surname"]').type("Doe");
      cy.get('[name="email"]').type("john@doe.com");
      cy.get('[name="phone"]').type("123-456-7890");
      cy.get('[name="country"]').type("USA");
      cy.get('[name="city"]').type("Anytown");
      cy.get('[name="state"]').type("CA");
      cy.get('[name="address"]').type("123 Main St");
      cy.get('[name="zip"]').type("12345");
      cy.get('[name*="__privateStripeFrame"]').should("be.visible");
      cy.contains(/confirm/i).click();
      cy.contains(/name is required/i).should("not.exist");
      cy.contains(/surname is required/i).should("not.exist");
      cy.contains(/enter a valid email/i).should("not.exist");
      cy.contains(/phone is too short/i).should("not.exist");
      cy.contains(/country is required/i).should("not.exist");
      cy.contains(/city is required/i).should("not.exist");
      cy.contains(/state is required/i).should("not.exist");
      cy.contains(/enter a full address/i).should("not.exist");
      cy.contains(/valid zip/i).should("not.exist");
    });
  });
});
