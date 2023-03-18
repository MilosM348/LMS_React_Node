const stripe = require("stripe")(
  "sk_test_51IuCHsSJhHkg9TM38IKEtBQWRDIneUMI0cFrXdJVWSJqUBFGcLRlkhMzEvOnFPCjRqlvrQyzreBKKcbZuYOJWPHi00b6cm9nyk"
);
// const shortid = require("shortid");
const Razorpay = require("razorpay");
var razorpay = new Razorpay({
  key_id: "rzp_test_25fnOwAJlpuga5",
  key_secret: "dSy5vZBGj3JB1TMZWqiKoWDg",
});

module.exports = {
  stripeIntent: async function (req, res, next) {
    const { amount, currency, description, token, name, email } = req.body;
    const customer = stripe.customers.create({
      name: name,
      email: email,
      source: token.id,
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      description: description,
      customer: customer.id,
    });

    res.status(200).json({
      success: "success",
      url: req.url,
      body: { clientSecret: paymentIntent.client_secret },
    });
  },
  razorpayOrder: async function (req, res, next) {
    const { amount, currency } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      payment_capture: "1",
    };
    try {
      const response = await razorpay.orders.create(options);
      res.status(200).json({ success: "post call succeed!", order: response });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
    }
  },
};
