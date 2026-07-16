# Paystack and LumiPool safe-hold setup

## Test safe-hold

Paystack Test Mode processes simulated payments only. After the server verifies a buyer contribution and its exact amount, LumiPool creates a Firestore `safe_holds` record with status `held`. This is a test workflow ledger, not a bank or regulated escrow account.

In live mode, Paystack settles funds according to the merchant account configuration. Before advertising real escrow, LumiPool must agree a compliant custody and payout structure with Paystack and qualified Nigerian legal/compliance advisers.

## Netlify variables

Add these under **Project configuration > Environment variables**:

- `PAYSTACK_SECRET_KEY`: start with the test secret (`sk_test_...`). Never use a `VITE_` prefix.
- `PAYSTACK_BUYER_POOL_AMOUNT`: `8500000` (NGN 85,000 in kobo).
- `PAYSTACK_MAINTENANCE_AMOUNT`: `1500000` (temporary NGN 15,000 default).
- `PAYSTACK_SUPPLIER_ONBOARDING_AMOUNT`: `5000000` (temporary NGN 50,000 default).
- `PAYSTACK_INSTALLER_ONBOARDING_AMOUNT`: `2500000` (temporary NGN 25,000 default).

Change the temporary business fees before launch. The server owns all amounts; the browser cannot choose them.

## Webhook

In Paystack Test Mode, set the webhook URL to:

`https://YOUR-NETLIFY-DOMAIN/.netlify/functions/paystack-webhook`

The webhook validates Paystack's `x-paystack-signature`. The current test implementation logs verified events. Before live payouts, persist webhook events with server-admin Firestore credentials and make fulfillment idempotent.

## Local testing

`npm run dev` does not run Netlify Functions. Use `npx netlify dev`, open the URL it prints, and use Paystack test cards only.

## Release flow

1. Buyer pays the pool contribution.
2. Server verifies status, currency, and exact amount.
3. Firestore creates immutable `safe_holds/{reference}` with status `held`.
4. Supplier delivery and installer evidence are completed.
5. Buyer confirms installation or reports an issue.
6. A future admin-only release function changes the ledger to `released` and initiates transfers to verified recipients.

Never allow clients to initiate releases or hold Paystack secret keys.
