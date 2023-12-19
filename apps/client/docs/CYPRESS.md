# Run Cypress Tests

To run Cypress with the GUI and have access to E2E and Components Tests, from the Root `fastoapp/` run:

```
  yarn test:gui
```

To run Cypress on terminal and run E2E Tests only, from the Root `fastoapp/` run:

```
  yarn test
```

## E2E Tests

End-to-End (E2E) tests simulate real user interactions across an entire application. The following code is representing how a `login` flow can be tested and the code can be found here: `fastoapp/apps/client/cypress/e2e/fasto-e2e/business-login.cy.ts`

```js
describe('Login tests', () => {
	beforeEach(() => {
		// Cypress starts out with a blank slate for each test
		// so we must tell it to visit our website with the `cy.visit()` command.
		// Since we want to visit the same URL at the start of all our tests,
		// we include it in our beforeEach function so that it runs before each test
		cy.visit(appRoute.businessRoute.login);
	});

	it('Login Error', () => {
		cy.get('input[autocomplete="email"]').type('admin@admin.comm');
		cy.get('input[autocomplete="password"]').type('admin123');

		cy.get('div[role="button"][tabindex="0"]').click();
		cy.contains('Something went wrong!', { matchCase: false });
	});
});
```

## Component Test

Component tests assess the functionality of individual software components in isolation. The following code is representing how a `<PaymentTile/>` component can be tested and the code can be found here: `/fastoapp/apps/client/business-templates/Checkout/TableComponentsPaymentTile.cy.tsx`

```js
import React from 'react';
import { PaymentTile } from './TableComponents';
import { ThemeProvider } from '../../theme/ThemeProvider';

const componentProps: Parameters<typeof PaymentTile>[0] = {
	cta: 'Click Here',
	customer: 'Joen Doe',
	subtotal: '$120.00',
	tip: '$10.00',
	onPress: () => {},
	loading: false,
	disable: false,
};

describe('<PaymentTile />', () => {
	it('renders', () => {
		// see: https://on.cypress.io/mounting-react
		cy.mount(
			<ThemeProvider>
				<PaymentTile {...componentProps} />
			</ThemeProvider>,
		);

		cy.contains(componentProps.cta);
		cy.contains(componentProps.customer);
		cy.contains(componentProps.subtotal);
	});
});
```
