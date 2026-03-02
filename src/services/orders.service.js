const pool = require("../db");

exports.createOrder = async ({ userId, product_id, qty, address, phone }) => {
  if (!product_id || !qty || qty <= 0) throw new Error("Invalid product_id or qty");
  if (!address || !phone) throw new Error("Address and phone are required");

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) get product
    const [products] = await conn.query(
      "SELECT id, price, stock, status FROM products WHERE id = ? LIMIT 1",
      [product_id]
    );
    if (products.length === 0) throw new Error("Product not found");

    const p = products[0];
    if (p.status !== "active") throw new Error("Product not active");
    if (p.stock < qty) throw new Error("Not enough stock");

    const unitPrice = Number(p.price);
    const total = unitPrice * Number(qty);

    // 2) create order
    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, total, status, address, phone) VALUES (?, ?, 'pending', ?, ?)",
      [userId, total, address, phone]
    );
    const orderId = orderResult.insertId;

    // 3) order items
    await conn.query(
      "INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)",
      [orderId, product_id, qty, unitPrice]
    );

    // 4) update stock
    await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [qty, product_id]);

    await conn.commit();
    return { id: orderId, total, status: "pending" };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

exports.getMyOrders = async (userId) => {
  const [rows] = await pool.query(
    "SELECT id, total, status, address, phone, created_at FROM orders WHERE user_id = ? ORDER BY id DESC",
    [userId]
  );
  return rows;
};

exports.listOrders = async () => {
  const [rows] = await pool.query(
    "SELECT id, user_id, total, status, address, phone, created_at FROM orders ORDER BY id DESC"
  );
  return rows;
};

exports.updateStatus = async (orderId, status) => {
  const [r] = await pool.query(
    "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, orderId]
  );
  if (r.affectedRows === 0) return null;

  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [orderId]);
  return rows[0];
};




exports.getOrderDetails = async ({ orderId, userId, role }) => {
  // 1) fetch order
  const [orders] = await pool.query(
    "SELECT * FROM orders WHERE id = ? LIMIT 1",
    [orderId]
  );
  if (orders.length === 0) return null;

  const order = orders[0];

  // 2) permission checks
  if (role === "acheteur") {
    if (Number(order.user_id) !== Number(userId)) return null;
  }

  if (role === "fournisseur") {
    // fournisseur can view only if order contains at least one product of this supplier
    const [rows] = await pool.query(
      `
      SELECT oi.id
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ? AND p.supplier_id = ?
      LIMIT 1
      `,
      [orderId, userId]
    );
    if (rows.length === 0) return null;
  }

  // 3) items details
  const [items] = await pool.query(
    `
    SELECT 
      oi.id,
      oi.order_id,
      oi.product_id,
      oi.qty,
      oi.price,
      p.name AS product_name,
      p.supplier_id
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
    ORDER BY oi.id ASC
    `,
    [orderId]
  );

  return { order, items };
};




