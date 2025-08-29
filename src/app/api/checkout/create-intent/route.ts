import { auth } from "@/auth";
import { getStripe } from "@/lib/get-stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

interface CreatePaymentIntentRequest {
  amount: number;
  customer: string;
  items: {
    id: number;
    quantity: number;
    price: number;
  }[];
}

/**
 * POST /api/checkout/create-intent
 *
 * This endpoint creates a payment intent for the user.
 * It requires the user to be authenticated and the amount, items, and customer to be provided in the request body.
 *
 * @component
 *
 * @param {Request} req - The request object
 * @returns {Promise<NextResponse>} The response object
 */
export async function POST(req: Request) {
  const stripe = getStripe();

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: CreatePaymentIntentRequest = await req.json();
    const { amount, items, customer } = body;

    if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      customer: customer,
      automatic_payment_methods: { enabled: true },
      metadata: {
        strapi_user_id: session?.user?.id,
        items: JSON.stringify(items),
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
