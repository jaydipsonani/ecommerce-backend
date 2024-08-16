const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51PoIYIEeQOdcAu01mUNNKdk9Mg4r1HLhfDocDnsyTTNxiI1XNv7dmCGlfOCxHeK7CxFSwmVyZB1kvYrhYibQDKJB00VhdvcgXY");

app.use(express.json());
app.use(cors());

//checkout api
app.post("/api/create-checkout-session", async (req, res) => {
    const { products } = req.body;

    const totalAmountInINR = products.reduce((acc, product) => acc + product.price * product.qnty, 0);

    if (totalAmountInINR < 41.50) {
        return res.status(400).json({ error: "The total amount must be at least ₹41.50." });
    }

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.dish
            },
            unit_amount: product.price * 100
        },
        quantity: product.qnty
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel"
    })

    res.json({ id: session.id })


})


app.listen(7000, () => {
    console.log("serer start in 7000")
})