const router = require("express").Router();
const express = require("express");
const { Product, Cart, Order } = require("../models");
const stripe = require("stripe")(process.env.STRIPE_KEY);

// High-performance in-memory cache for products
let productsCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 60000; // 60 seconds

// 1. CREATE A PRODUCT
router.post("/create", async (req, res) => {
  try {
    const id = Date.now().toString();
    const data = {
      productId: id,
      product_name: req.body.product_name,
      product_category: req.body.product_category,
      product_price: req.body.product_price,
      imageURL: req.body.imageURL,
    };

    const newProduct = await Product.create(data);
    productsCache = null; // Invalidate cache on new product
    return res.status(200).send({ success: true, data: newProduct });
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

// 2. GET ALL PRODUCTS (Cached in-memory for instant 0ms responses)
router.get("/all", async (req, res) => {
  try {
    const now = Date.now();
    if (productsCache && now - lastFetchTime < CACHE_TTL) {
      return res.status(200).send({ success: true, data: productsCache });
    }

    let products = await Product.find({}).sort({ createdAt: -1 });

    productsCache = products;
    lastFetchTime = now;
    return res.status(200).send({ success: true, data: products });
  } catch (err) {
    if (productsCache) {
      return res.status(200).send({ success: true, data: productsCache });
    }
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

// 3. DELETE A PRODUCT
router.delete("/delete/:productId", async (req, res) => {
  const productId = req.params.productId;
  try {
    const result = await Product.findOneAndDelete({ productId });
    productsCache = null; // Invalidate cache on deletion
    return res.status(200).send({ success: true, data: result });
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

// 3.1 DELETE ALL PRODUCTS OF A CATEGORY
router.delete("/deleteCategory/:categoryName", async (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase().trim();
  try {
    const result = await Product.deleteMany({ product_category: categoryName });
    productsCache = null; // Invalidate cache on category deletion
    return res.status(200).send({
      success: true,
      message: `Deleted ${result.deletedCount} products from category '${categoryName}'`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

// 4. ADD ITEM TO CART
router.post("/addToCart/:userId", async (req, res) => {
  const userId = req.params.userId;
  const productId = String(req.body.productId);

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.productId) === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId: productId,
        product_name: req.body.product_name,
        product_category: req.body.product_category,
        product_price: req.body.product_price,
        imageURL: req.body.imageURL,
        quantity: 1,
      });
    }

    const updatedCart = await cart.save();
    return res.status(200).send({ success: true, data: updatedCart.items });
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

// 5. GET ALL CART ITEMS FOR A USER
router.get("/getCartItems/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  try {
    const cart = await Cart.findOne({ userId });
    return res.status(200).send({ success: true, data: cart ? cart.items : [] });
  } catch (er) {
    return res.send({ success: false, msg: `Error: ${er}` });
  }
});

// 6. UPDATE CART QUANTITY (INCREMENT / DECREMENT)
router.post("/updateCart/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const productId = String(req.query.productId);
  const type = req.query.type;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).send({ success: true, data: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.productId) === productId
    );

    if (itemIndex > -1) {
      if (type === "increment") {
        cart.items[itemIndex].quantity += 1;
      } else {
        if (cart.items[itemIndex].quantity <= 1) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity -= 1;
        }
      }
      const updatedCart = await cart.save();
      return res.status(200).send({ success: true, data: updatedCart.items });
    }

    return res.status(200).send({ success: true, data: cart.items });
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

// 7. DIRECT ORDER PLACEMENT (Cash on delivery / Direct checkout)
router.post("/create-order", async (req, res) => {
  try {
    const { userId, cart, total, customer, shipping_details } = req.body;

    if (!userId || !cart || cart.length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "Cart is empty or user is missing" });
    }

    const orderId = Date.now().toString();
    const orderData = {
      orderId,
      userId,
      items: cart,
      total: Number(total),
      sts: "preparing",
      status: "paid",
      customer: customer || {},
      shipping_details: shipping_details || {
        name: customer?.name || "Customer",
        address: {
          line1: "Delivery Order",
          line2: "",
          country: "India",
          state: "Online",
          postal_code: "",
        },
      },
      intentId: "ORD_" + orderId,
    };

    const newOrder = await Order.create(orderData);
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    return res.status(200).json({
      success: true,
      data: newOrder,
      orderId,
      msg: "Order placed successfully!",
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error: ${err.message}` });
  }
});

// 8. CREATE STRIPE CHECKOUT SESSION
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { user, cart, total } = req.body.data;
    const userId = String(user?.user_id || "");
    const orderId = Date.now().toString();

    if (!cart || cart.length === 0) {
      return res.status(400).send({ success: false, msg: "Cart is empty" });
    }

    // Clean up any previous uncompleted/unpaid checkout drafts for this user
    await Order.deleteMany({ userId, status: "pending_payment" });

    // Pre-create the Order document in MongoDB so full items, names, prices,
    // and imageURLs are safely stored with zero character limitations.
    const newOrder = await Order.create({
      orderId,
      userId,
      items: cart,
      total: Number(total),
      sts: "preparing",
      status: "pending_payment",
      customer: {
        email: user?.email || "",
        name: user?.name || "Customer",
      },
      shipping_details: {
        name: user?.name || "Customer",
      },
      intentId: "",
    });

    // In Stripe customer metadata, store ONLY lightweight identifiers (<50 chars, Stripe limit is 500)
    const customer = await stripe.customers.create({
      metadata: {
        user_id: userId.slice(0, 500),
        order_id: String(orderId),
        total: String(total),
      },
    });

    // Safely format line items for Stripe:
    // Only pass images if it is a valid HTTP/HTTPS URL (Stripe rejects data: URIs)
    const line_items = cart.map((item) => {
      const validImages =
        item.imageURL &&
        typeof item.imageURL === "string" &&
        (item.imageURL.startsWith("http://") || item.imageURL.startsWith("https://"))
          ? [item.imageURL]
          : [];

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: String(item.product_name || "Food Item"),
            images: validImages,
            metadata: {
              id: String(item.productId || ""),
            },
          },
          unit_amount: Math.round(Number(item.product_price) * 100),
        },
        quantity: Number(item.quantity) || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: { allowed_countries: ["IN"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "inr" },
            display_name: "Free Shipping",
            delivery_estimate: {
              minimum: { unit: "hour", value: 2 },
              maximum: { unit: "hour", value: 4 },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      customer: customer.id,
      metadata: {
        order_id: String(orderId),
        user_id: userId,
      },
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success?order_id=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/?cancelled_order=${orderId}`,
    });

    newOrder.intentId = session.id;
    await newOrder.save();

    res.send({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).send({ success: false, msg: `Stripe Error: ${err.message}` });
  }
});

// CONFIRM ORDER UPON RETURNING FROM STRIPE (for local dev / immediate sync)
router.post("/confirm-order/:order_id", async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const order = await Order.findOne({ orderId });
    if (order) {
      order.status = "paid";
      await order.save();
      if (order.userId) {
        await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });
      }
      return res.status(200).json({ success: true, data: order });
    }
    return res.status(404).json({ success: false, msg: "Order not found" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error: ${err.message}` });
  }
});

// CANCEL UNPAID ORDER DRAFT
router.post("/cancel-order/:order_id", async (req, res) => {
  try {
    const orderId = req.params.order_id;
    await Order.deleteOne({ orderId, status: "pending_payment" });
    return res.status(200).json({ success: true, msg: "Pending draft removed" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error: ${err.message}` });
  }
});

// 8. STRIPE WEBHOOK
let endpointSecret = process.env.WEBHOOK_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let eventType;
    let data;

    if (endpointSecret) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        data = event.data.object;
        eventType = event.type;
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      data = req.body.data ? req.body.data.object : req.body;
      eventType = req.body.type;
    }

    if (eventType === "checkout.session.completed") {
      try {
        const customer = await stripe.customers.retrieve(data.customer);
        await createOrder(customer, data, res);
      } catch (e) {
        console.error("Webhook processing error:", e);
      }
    }

    res.send().end();
  }
);

const createOrder = async (customer, intent, res) => {
  try {
    const orderId =
      customer?.metadata?.order_id || intent?.metadata?.order_id;
    const userId =
      customer?.metadata?.user_id || intent?.metadata?.user_id;

    if (orderId) {
      const existing = await Order.findOne({ orderId });
      if (existing) {
        existing.status = "paid";
        existing.intentId = intent.id || intent.payment_intent || existing.intentId;
        if (intent.customer_details) existing.customer = intent.customer_details;
        if (intent.shipping_details) existing.shipping_details = intent.shipping_details;
        await existing.save();
      }
    } else {
      const legacyOrderId = Date.now().toString();
      let items = [];
      try {
        items = customer?.metadata?.cart ? JSON.parse(customer.metadata.cart) : [];
      } catch (e) {}
      await Order.create({
        intentId: intent.id || "",
        orderId: legacyOrderId,
        amount: intent.amount_total,
        payment_method_types: intent.payment_method_types,
        status: intent.payment_status || "paid",
        customer: intent.customer_details || {},
        shipping_details: intent.shipping_details || {},
        userId: userId,
        items: items,
        total: customer?.metadata?.total || 0,
        sts: "preparing",
      });
    }

    if (userId) {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
    }
    if (res && !res.headersSent) {
      return res.status(200).send({ success: true });
    }
  } catch (err) {
    console.error("Order creation error:", err);
  }
};

// 9. GET ALL CONFIRMED ORDERS (Excludes uncompleted pending checkout sessions)
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "pending_payment" } }).sort({
      createdAt: -1,
    });
    return res.status(200).send({ success: true, data: orders });
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

// 10. UPDATE ORDER STATUS
router.post("/updateOrder/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  const sts = req.query.sts;
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: order_id },
      { sts: sts },
      { returnDocument: "after", new: true }
    );
    return res.status(200).send({ success: true, data: updatedOrder });
  } catch (er) {
    return res.send({ success: false, msg: `Error: ${er}` });
  }
});

module.exports = router;
