import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from env or a dummy one for testing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-04-10',
});

const paymentsRouter: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post('/create-checkout-session', async (request, reply) => {
    try {
      // @ts-ignore
      const { priceId } = request.body;
      
      // We assume user is authenticated and we have their email.
      // Since we just swapped to Firebase, let's just get email from request body or jwt
      // @ts-ignore
      const userId = request.user?.id || 'anonymous';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId || 'price_1dummy_pro', // Fallback to a dummy price
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/terminal?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/`,
        client_reference_id: userId,
      });

      return { sessionId: session.id, url: session.url };
    } catch (err: any) {
      app.log.error(err);
      return reply.status(500).send({ error: err.message });
    }
  });
};

export default paymentsRouter;
