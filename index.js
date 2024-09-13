const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

require('dotenv').config();

// Server setup
const app = express();
const port = 4002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Customizing cors options to meet specific requirements
const corsOptions = {
    origin: ['http://localhost:8000'], // Update with your frontend origin
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGODB_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// // Backend Routes with /b2 prefix
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Server Gateway Response
if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is online on port ${process.env.PORT || 3000}`);
    });
}

module.exports = app;
