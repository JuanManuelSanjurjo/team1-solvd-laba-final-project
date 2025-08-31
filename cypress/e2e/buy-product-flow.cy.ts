describe("Buy product flow", () => {
  beforeEach(() => {
    cy.login();
  });
  // it("should allow to add product to cart from the card", () => {
  //   cy.visit("/products");
  //   cy.contains("Add to cart").first().click();
  //   cy.contains(/choose/i).click();
  //   cy.get("[data-value]").eq(2).click();
  //   cy.get("button").contains("Add").click();
  //   cy.visit("/cart");
  //   cy.contains(/shoes/i).first().click({ force: true });
  // });

  it("will allow to add product to cart from the product page and complete flow", () => {
    cy.visit("/products");
    cy.contains(/shoes/i).first().click({ force: true });
    cy.contains(/eu/i).first().click({ force: true });
    cy.get("button").contains("Add to cart").click();
    cy.visit("/cart");
    cy.contains(/shoes/i).first().click({ force: true });
    cy.contains(/checkout/i)
      .first()
      .click({ force: true });
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

    // Interactúa con los campos dentro del iframe
    cy.get("iframe").each(($iframe) => {
      cy.log(
        "Iframe found:",
        $iframe.attr("name"),
        $iframe.attr("title"),
        $iframe.attr("componentName"),
      );
    });

    cy.getStripeElement("numberInput").should("exist");
    cy.get("#Field-expiryInput").find(".StripeElement").should("exist");
    cy.get("#Field-cvcInput").find(".StripeElement").should("exist");

    cy.get('[title="Campo de entrada seguro para el pago"]', { timeout: 30000 })
      .should("be.visible")
      .and("have.length", 1);

    // Interact with fields inside the iframe
    cy.iframe('[title="Campo de entrada seguro para el pago"]')
      .find("#Field-numberInput")
      .type("4242424242424242", { force: true });

    cy.iframe('[title="Campo de entrada seguro para el pago"]')
      .find("#Field-expiryInput")
      .type("0730", { force: true });

    cy.iframe('[title="Campo de entrada seguro para el pago"]')
      .find("#Field-cvcInput")
      .type("123", { force: true });

    // cy.get('[id="Field-numberInput"]').click().type("4242424242424242");
    // cy.get('[id="Field-expiryInput"]').type("0730");
    // cy.get('[id="Field-cvcInput"]').type("123");
    // cy.contains(/confirm/i).click();
  });
});
