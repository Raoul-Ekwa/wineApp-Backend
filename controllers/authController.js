const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User.js");

// ✅ Inscription (Register)
const registerUser = async (req, res) => {
  try {
    const { name, email, telephone, password } = req.body;

    if (!name || !telephone || !password) {
      return res.status(400).json({
        message: "Name, téléphone et mot de passe sont obligatoires !",
      });
    }

    const userExists = await User.findOne({
      where: {
        [Op.or]: [...(email ? [{ email }] : []), { telephone }],
      },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email ou téléphone déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email || null,
      telephone,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ✅ Connexion (Login) par email ou téléphone
const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs !" });
    }

    const user = await User.findOne({
      where: { [Op.or]: [{ email: login }, { telephone: login }] },
    });

    if (!user)
      return res.status(400).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, email: user.email, telephone: user.telephone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ✅ Demande de réinitialisation du mot de passe
const passwordResetRequest = async (req, res) => {
  const { telephone } = req.body;
  try {
    const user = await User.findOne({ where: { telephone } });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const token = jwt.sign(
      { id: user.id, telephone: user.telephone },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await user.update({
      passwordResetToken: token,
      passwordResetExpires: Date.now() + 3600000, // 1h
    });

    res.status(200).json({
      message: "Token de réinitialisation simulé pour dev",
      simulatedToken: token, // ⚠️ token complet
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ✅ Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
  const { token } = req.params; // ✅ token depuis l'URL
  const { newPassword } = req.body; // mot de passe depuis le corps

  try {
    const user = await User.findOne({ where: { passwordResetToken: token } });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (user.passwordResetExpires < Date.now())
      return res.status(400).json({ message: "Token expiré" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  passwordResetRequest,
  resetPassword,
};
