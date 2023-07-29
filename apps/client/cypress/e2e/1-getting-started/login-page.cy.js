/// <reference types="cypress" />

describe('Login tests', () => {
	beforeEach(() => {
		// Cypress starts out with a blank slate for each test
		// so we must tell it to visit our website with the `cy.visit()` command.
		// Since we want to visit the same URL at the start of all our tests,
		// we include it in our beforeEach function so that it runs before each test
		cy.visit('http://localhost:3000/business/login');
	});

	it('Login Success', () => {
		cy.contains('Welcome to Fasto');
		cy.get('input[autocomplete="email"]').should('exist');
		cy.get('input[autocomplete="password"]').should('exist');

		cy.get('input[autocomplete="email"]').type('admin@admin.com');
		cy.get('input[autocomplete="password"]').type('admin123');

		cy.get('div[role="button"][tabindex="0"]').click();

		cy.url().should('eq', 'http://localhost:3000/business/admin/dashboard');
	});
});
