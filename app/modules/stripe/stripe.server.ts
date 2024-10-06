import Stripe from 'stripe'
// import { ERRORS } from '#app/utils/constants/errors'

// TODO: Enable this before pushing to production
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error(`Stripe - ${ERRORS.ENVS_NOT_INITIALIZED})`)
// }

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
