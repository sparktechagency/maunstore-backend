"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("../../config/stripe"));
class StripeService {
    // Create a connected account for the vendor
    createConnectedAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield stripe_1.default.accounts.create({
                type: 'express', // Choose 'express' or 'custom' based on your needs
                email,
                capabilities: {
                    transfers: { requested: true },
                    card_payments: { requested: true },
                },
            });
            return account;
        });
    }
    // Generate the account onboarding link for the vendor
    createAccountLink(accountId, returnUrl, refreshUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountLink = yield stripe_1.default.accountLinks.create({
                account: accountId,
                refresh_url: refreshUrl,
                return_url: returnUrl,
                type: 'account_onboarding',
            });
            return accountLink.url;
        });
    }
    // Create a checkout session for the customer payment
    createCheckoutSession(customerEmail, amount, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield stripe_1.default.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Service Payment',
                                description: 'Payment for vendor service',
                            },
                            unit_amount: Math.round(Number(amount) * 100), // Amount in cents
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: 'https://yourapp.com/success',
                cancel_url: 'https://yourapp.com/cancel',
                payment_intent_data: {},
                metadata: {
                    customer_email: customerEmail,
                    amount: Math.round(Number(amount)).toString(),
                    orderId: orderId,
                },
            });
            return { sessionId: session.id, url: session.url };
        });
    }
    // Generate a login link for the connected user's Express Dashboard
    createLoginLink(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginLink = yield stripe_1.default.accounts.createLoginLink(accountId);
            return loginLink.url;
        });
    }
}
exports.default = new StripeService();
