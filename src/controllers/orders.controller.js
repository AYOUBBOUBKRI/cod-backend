const ordersService = require("../services/orders.service");

exports.create = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, qty, address, phone } = req.body;

    const order = await ordersService.createOrder({ userId, product_id, qty, address, phone });
    res.status(201).json({ ok: true, order });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await ordersService.getMyOrders(userId);
    res.json({ ok: true, orders: data });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const data = await ordersService.listOrders();
    res.json({ ok: true, orders: data });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};
