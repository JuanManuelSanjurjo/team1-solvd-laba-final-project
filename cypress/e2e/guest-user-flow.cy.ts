describe("Guest user flow", () => {
  describe("Will access all basic authenticated routes", () => {
    it("should access products page successfully", () => {
      cy.visit("/products");
      cy.url().should("include", "/products");
    });
    it("should acces single product page and should not be able to add to car/wishlist or touch sizes", () => {
      cy.visit("/products");
      cy.contains(/shoes/i).first().click({ force: true });
      cy.get("button").contains("Add to cart").should("be.disabled");
      cy.get("button")
        .contains(/wishlist/i)
        .should("be.disabled");
    });
  });
  describe("Will be denied access and redirected from authenticated pages", () => {
    it("should not access my-products page", () => {
      cy.visit("/my-products");
      cy.url().should("not.include", "/my-products");
    });
    it("should not access recently-viewed page", () => {
      cy.visit("/recently-viewed");
      cy.url().should("not.include", "/recently-viewed");
    });
    it("should not access wishlist page", () => {
      cy.visit("/my-wishlist");
      cy.url().should("not.include", "/my-wishlist");
    });
    it("should not access order history page", () => {
      cy.visit("/order-history");
      cy.url().should("not.include", "/order-history");
    });
    it("should not access profile page", () => {
      cy.visit("/update-profile");
      cy.url().should("not.include", "/update-profile");
    });
    it("should not access cart page", () => {
      cy.visit("/cart");
      cy.url().should("not.include", "/cart");
    });
  });
});
