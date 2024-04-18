import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_API_KEY || '';

export const stripe = new Stripe(stripeApiKey, {
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'ignews',
    version: '0.1.0',
  },
});