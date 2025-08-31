/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("login", (email?: string, password?: string) => {
  const userEmail = email || Cypress.env("USER_EMAIL");
  const userPassword = password || Cypress.env("USER_PASSWORD");

  cy.session(
    "user-session",
    () => {
      cy.visit("/auth/sign-in");
      cy.get("input[name=email]").type(userEmail);
      cy.get("input[name=password]").type(userPassword);
      cy.get("button").click();
      cy.url().should("include", "/products");
    },
    {
      validate() {
        cy.getCookie("authjs.session-token").should("exist");
      },
    },
  );
});

Cypress.Commands.add("logout", () => {
  cy.clearCookie("authjs.session-token");
  cy.reload();
});
