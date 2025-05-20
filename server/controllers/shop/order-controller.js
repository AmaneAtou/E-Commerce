const { client } = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;
    const totalAmountNum = parseFloat(totalAmount);

    
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmountNum.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmountNum.toFixed(2),
              },
            },
          },          
          items: cartItems.map((item) => ({
            name: item.title,
            sku: item.productId,
            unit_amount: {
              currency_code: "USD",
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
    });
    

    const response = await client().execute(request);
    const orderIdPaypal = response.result.id;

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: orderIdPaypal,
    });

    await newOrder.save();

    const approvalUrl = response.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.status(201).json({
      success: true,
      approvalURL: approvalUrl,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating PayPal order",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId, payerId } = req.body;

    // Tìm kiếm đơn hàng từ database
    const order = await Order.findById(orderId);
    if (!order || !order.paymentId) {
      return res.status(404).json({
        success: false,
        message: "Order not found or invalid PayPal order ID",
      });
    }

    // Kiểm tra sự tồn tại của paymentId trong đơn hàng
    if (paymentId !== order.paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID mismatch",
      });
    }

    // Tạo request capture cho PayPal
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(order.paymentId);
    request.requestBody({});

    // Thực thi capture payment
    const captureResponse = await client().execute(request);
    console.log('Capture Response:', captureResponse);

    // Kiểm tra response từ PayPal để xác nhận thanh toán đã thành công
    if (captureResponse.result.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: "Payment capture failed",
      });
    }

    // Cập nhật trạng thái đơn hàng
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    // Cập nhật số lượng sản phẩm trong kho
    for (const item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    // Xóa cart sau khi thanh toán thành công
    await Cart.findByIdAndDelete(order.cartId);

    // Lưu đơn hàng đã cập nhật
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured and order confirmed",
      data: order,
    });
  } catch (error) {
    console.error("capturePayment error:", error);
    res.status(500).json({
      success: false,
      message: "Error while capturing payment",
    });
  }
};


const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
