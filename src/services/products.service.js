const db = require("../db");

async function list({ page = 1, limit = 20 }) {
  page = Number(page); limit = Number(limit);
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    "SELECT id, supplier_id, name, description, price, stock, status, created_at, updated_at FROM products ORDER BY id DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [[countRow]] = await db.query("SELECT COUNT(*) AS total FROM products");
  return { page, limit, total: countRow.total, items: rows };
}

async function getById(id) {
  const [rows] = await db.query(
    "SELECT id, supplier_id, name, description, price, stock, status, created_at, updated_at FROM products WHERE id=?",
    [id]
  );
  return rows[0] || null;
}

async function create({ supplier_id, name, description, price, stock, status }) {
  const [result] = await db.query(
    `INSERT INTO products (supplier_id, name, description, price, stock, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [supplier_id, name, description ?? null, price, stock, status ?? "draft"]
  );

  const [rows] = await db.query(`SELECT * FROM products WHERE id = ?`, [result.insertId]);
  return rows[0];
}


async function update(id, { name, description, price, stock, status }) {
  await db.query(
    "UPDATE products SET name=?, description=?, price=?, stock=?, status=? WHERE id=?",
    [name, description || null, price, stock, status, id]
  );
  return getById(id);
}

async function remove(id) {
  const [r] = await db.query("DELETE FROM products WHERE id=?", [id]);
  return r.affectedRows > 0;
}

module.exports = { list, getById, create, update, remove };
