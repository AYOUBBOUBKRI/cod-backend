const service = require("../services/products.service");

function bad(res, msg) {
  return res.status(400).json({ ok: false, error: msg });
}

exports.list = async (req, res) => {
  try {
    const data = await service.list(req.query);
    res.json({ ok: true, ...data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await service.getById(req.params.id);
    if (!item) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, item });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, stock, status } = req.body;

    if (!name) return bad(res, "name required");
    if (price == null) return bad(res, "price required");

    // supplier_id: إذا admin يقدر يمررو، إلا fournisseur ناخدو من التوكن
    const supplier_id =
      req.user.role === "admin" && req.body.supplier_id
        ? Number(req.body.supplier_id)
        : req.user.id;

    const item = await service.create({
      supplier_id,
      name,
      description,
      price: Number(price),
      stock: Number(stock || 0),
      status,
    });

    res.status(201).json({ ok: true, item });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await service.getById(req.params.id);
    if (!existing) return res.status(404).json({ ok: false, error: "Not found" });

    // fournisseur يقدر يعدل غير منتجاتو
    if (req.user.role === "fournisseur" && existing.supplier_id !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }

    const item = await service.update(req.params.id, {
      name: req.body.name ?? existing.name,
      description: req.body.description ?? existing.description,
      price: req.body.price ?? existing.price,
      stock: req.body.stock ?? existing.stock,
      status: req.body.status ?? existing.status,
    });

    res.json({ ok: true, item });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const existing = await service.getById(req.params.id);
    if (!existing) return res.status(404).json({ ok: false, error: "Not found" });

    if (req.user.role === "fournisseur" && existing.supplier_id !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }

    const ok = await service.remove(req.params.id);
    res.json({ ok: true, deleted: ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};
