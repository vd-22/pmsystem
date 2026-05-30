const router = require('express').Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.user_id, u.username, u.role, u.branch_id, b.name as branch_name
       FROM users u
       LEFT JOIN branch b ON u.branch_id = b.branch_id
       ORDER BY u.user_id`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/create', async (req, res) => {
  const { username, password, role, branchId } = req.body
  try {
    const exists = await pool.query(
      'SELECT * FROM users WHERE username = $1', [username]
    )
    if (exists.rows.length) {
      return res.status(400).json({ message: 'Користувач з таким логіном вже існує' })
    }
    await pool.query(
      `INSERT INTO users (username, password_hash, role, branch_id)
       VALUES ($1, $2, $3, $4)`,
      [username, password, role, branchId || null]
    )
    res.json({ message: 'Користувача створено' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    await pool.query('DELETE FROM users WHERE user_id = $1', [userId])
    res.json({ message: 'Користувача видалено' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router