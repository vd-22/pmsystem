const router = require('express').Router()
const pool = require('../db')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1', [username]
    )

    const user = rows[0]
    if (!user) {
      return res.status(401).json({ message: 'Користувача не знайдено' })
    }

    if (password !== user.password_hash) {
      return res.status(401).json({ message: 'Невірний пароль' })
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role, branchId: user.branch_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router