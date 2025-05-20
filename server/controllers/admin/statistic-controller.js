const Product = require("../../models/Product");
const Order = require("../../models/Order");

const getProductStatistics = async (req, res) => {
  try {
    const products = await Product.find();
    console.log("Products count:", products.length);

    const orders = await Order.find({ orderStatus: { $regex: /^Delivered$/i } });
    // console.log("Orders with Delivered status count:", orders.length);


    const salesStats = {};

    orders.forEach((order, index) => {
    //   console.log(`Order ${index} cartItems count:`, order.cartItems?.length ?? 0);
      if (order.cartItems && order.cartItems.length > 0) {
        order.cartItems.forEach((item) => {
          const itemProductId = item.productId ? item.productId.toString() : null;
          if (!itemProductId) return;

          const quantity = Number(item.quantity) || 0;
          const price = Number(item.price) || 0;

          if (!salesStats[itemProductId]) {
            salesStats[itemProductId] = { sold: 0, revenue: 0 };
          }

          salesStats[itemProductId].sold += quantity;
          salesStats[itemProductId].revenue += quantity * price;
        });
      }
    });

    const stats = products.map((product) => {
      const id = product._id.toString();
      return {
        productId: product._id,
        title: product.title,
        sold: salesStats[id]?.sold || 0,
        revenue: salesStats[id]?.revenue || 0,
        stock: product.totalStock,
      };
    });

    res.json(stats);
  } catch (error) {
    console.error("Statistic error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProductStatistics,
};
