const usersService = require("../services/user.service");

exports.pending = async (req, res) => {
  try {
    const users = await usersService.listPending();
    return res.json({ ok: true, users });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const adminId = req.user.id;
    const userId = req.params.id;

    const user = await usersService.approveUser({ userId, adminId });
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });

    return res.json({ ok: true, user });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};