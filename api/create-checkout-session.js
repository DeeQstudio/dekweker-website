const Stripe = require('stripe');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY env var' });
    }

    const stripe = Stripe(secret);

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : req.body || {};

    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) {
      return res.status(400).json({ error: 'No items' });
    }

    const lineItems = items.map((item) => {
      const qty = Math.max(1, Number(item.qty || 1));
      const name = String(item.name || 'Item');
      const price = Number(item.price || 0);
      const unitAmount = Math.round(price * 100);

      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        throw new Error(`Invalid price for item "${name}" (${price})`);
      }

      return {
        quantity: qty,
        price_data: {
          currency: 'eur',
          unit_amount: unitAmount,
          product_data: {
            name
          }
        }
      };
    });

    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const origin = `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['BE']
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'Ophaling (gratis)'
          }
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 700, currency: 'eur' },
            display_name: 'Verzending (BE)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 }
            }
          }
        }
      ],
      success_url: `${origin}/site.html?success=1&sid={CHECKOUT_SESSION_ID}#catalogus`,
      cancel_url: `${origin}/site.html?canceled=1#catalogus`
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error && error.message ? error.message : 'Unknown error'
    });
  }
};
