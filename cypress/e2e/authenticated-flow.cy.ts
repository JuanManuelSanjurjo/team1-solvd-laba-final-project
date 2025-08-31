describe("Crud / wishlist / recently viewed flow", () => {
  beforeEach(() => {
    cy.login();
  });
  it("goes to my products and add a product", () => {
    cy.visit("/my-products");
    cy.contains(/add product/i)
      .should("be.visible")
      .click();
    cy.get('[name="name"]').type("Adidas test drive");
    cy.get('[name="price"]').type("150");
    cy.get('.MuiInputBase-root > [name="description"]').type(
      "My trusty adidas test shoes",
    );
    cy.contains(/eu/i).first().click({ force: true });
    cy.contains(/save/i).click();
  });

  it("goes to my products and sees the product added", () => {
    cy.visit("/my-products");
    cy.contains(/adidas test drive/i).should("be.visible");
  });

  it("goes to my products and edit the product", () => {
    cy.visit("/my-products");
    cy.contains(/adidas test drive/i)
      .parent()
      .find("button")
      .click();
    cy.contains(/edit/i).click();
    cy.get('[name="name"]').clear().type("NEW Adidas test drive");
    cy.get('[name="price"]').clear().type("150");
    cy.contains(/save/i).click();
    cy.contains(/NEW Adidas test drive/i).should("be.visible");
  });

  it("Check's that newly added item IS NOT in recently viewed", () => {
    cy.contains(/NEW Adidas test drive/i).should("not.exist");
    cy.visit("/recently-viewed");
  });

  it("should allow to add product to wishlist", () => {
    cy.visit("/my-products");
    cy.contains(/NEW Adidas test drive/i)
      .should("be.visible")
      .click();
    cy.contains(/add to wishlist/i)
      .should("be.visible")
      .click();
    cy.visit("/my-wishlist");
    cy.contains(/NEW Adidas test drive/i).should("be.visible");
  });

  it("Check's that newly added item IS in recently viewed", () => {
    cy.contains(/NEW Adidas test drive/i).should("not.exist");
    cy.visit("/recently-viewed");
  });

  it("goes to my products and delete the product", () => {
    cy.visit("/my-products");
    cy.contains(/adidas test drive/i)
      .parent()
      .find("button")
      .click();
    cy.contains(/delete/i).click();
    cy.contains(/are you sure to delete selected item/i)
      .should("be.visible")
      .parent()
      .find("button")
      .contains(/delete/i)
      .click();
  });
});
