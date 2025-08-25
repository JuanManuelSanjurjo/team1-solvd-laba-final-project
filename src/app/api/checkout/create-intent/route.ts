import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initiate Stripe in the server
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CreatePaymentIntentRequest {
  amount: number;
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: CreatePaymentIntentRequest = await req.json();
    const { amount } = body;

    console.log("body", body);

    if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        strapi_user_id: session?.user?.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: paymentIntent.id,
    });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      console.log("error", err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    console.log("Error");
    return NextResponse.json(
      { error: "Unknown server error" },
      { status: 500 }
    );
  }
}
