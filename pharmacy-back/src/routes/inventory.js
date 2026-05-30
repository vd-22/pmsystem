const router = require('express').Router()
const pool = require('../db')

router.get('/stats/:branchId', async (req, res) => {
  const { branchId } = req.params
  try {
    const total = await pool.query(
      `SELECT COUNT(*) FROM stock_amount WHERE branch_id = $1`, [branchId]
    )
    const low = await pool.query(
      `SELECT COUNT(*) FROM stock_amount 
       WHERE branch_id = $1 AND current_quantity <= min_level`, [branchId]
    )
    const expiring = await pool.query(
      `SELECT COUNT(*) FROM stock_amount sa
       JOIN batches b ON sa.batch_id = b.batch_id
       WHERE sa.branch_id = $1 
       AND b.expiration_date <= CURRENT_DATE + INTERVAL '30 days'
       AND b.expiration_date > CURRENT_DATE`, [branchId]
    )
    const expired = await pool.query(
      `SELECT COUNT(*) FROM stock_amount sa
       JOIN batches b ON sa.batch_id = b.batch_id
       WHERE sa.branch_id = $1 
       AND b.expiration_date < CURRENT_DATE`, [branchId]
    )

    res.json({
      total: parseInt(total.rows[0].count),
      low: parseInt(low.rows[0].count),
      expiring: parseInt(expiring.rows[0].count),
      expired: parseInt(expired.rows[0].count)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/branch/:branchId', async (req, res) => {
  const { branchId } = req.params
  try {
    const { rows } = await pool.query(
      `SELECT 
        sa.stock_id,
        p.name,
        p.category,
        p.manufacturer,
        sa.current_quantity,
        sa.min_level,
        sa.max_level,
        b.batch_number,
        b.expiration_date
       FROM stock_amount sa
       JOIN batches b ON sa.batch_id = b.batch_id
       JOIN products p ON b.product_id = p.product_id
       WHERE sa.branch_id = $1
       ORDER BY p.name`, [branchId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/branches', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM branch ORDER BY branch_id')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router