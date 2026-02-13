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
