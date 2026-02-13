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



exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!status || !allowed.includes(status)) {
      return res.status(422).json({ ok: false, error: "Invalid status" });
    }

    const updated = await ordersService.updateStatus(id, status);
    if (!updated) return res.status(404).json({ ok: false, error: "Order not found" });

    return res.json({ ok: true, order: updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
