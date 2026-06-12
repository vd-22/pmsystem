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

router.get('/revenue/:branchId', async (req, res) => {
  const { branchId } = req.params
  try {
    const { rows } = await pool.query(
      `SELECT year, month, revenue 
       FROM branch_revenue 
       WHERE branch_id = $1 
       ORDER BY year, month`, [branchId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/revenue-summary', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        b.branch_id,
        b.name,
        SUM(br.revenue) as total_revenue,
        MAX(br.revenue) as max_monthly_revenue
       FROM branch b
       LEFT JOIN branch_revenue br ON b.branch_id = br.branch_id
       WHERE b.branch_type = 'pharmacy'
       GROUP BY b.branch_id, b.name
       ORDER BY b.branch_id`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router