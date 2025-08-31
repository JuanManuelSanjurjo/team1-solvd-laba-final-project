describe("Logged-in flow", () => {
  beforeEach(() => {
    cy.login();
  });
  describe("will access all basic authenticated routes", () => {
    it("should access my-products page", () => {
      cy.visit("/my-products");
      cy.url().should("include", "/my-products");
    });
    it("should access products page", () => {
      cy.visit("/products");
      cy.url().should("include", "/products");
    });
    it("should access order history page", () => {
      cy.visit("/order-history");
      cy.url().should("include", "/order-history");
    });
    it("should access profile page", () => {
      cy.visit("/update-profile");
      cy.url().should("include", "/update-profile");
    });
    it("should access cart page", () => {
      cy.visit("/cart");
      cy.url().should("include", "/cart");
    });
  });
});
