import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initiate Stripe in the server
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CreatePaymentIntentRequest {
  amount: number;
}

export async function POST(req: Request) {
  try {
    // Read the body of the request
    const body: CreatePaymentIntentRequest = await req.json();
    const { amount } = body;

    // 2. Creamos el PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), //Turned into cents as Stripe requires
      currency: "usd",
      automatic_payment_methods: { enabled: true }, //Stripe handles what payment methods to show
    });

    // Return the client secret key
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    //Handling errors: Stripe and non Stripe ones
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unknown server error" },
      { status: 500 }
    );
  }
}
