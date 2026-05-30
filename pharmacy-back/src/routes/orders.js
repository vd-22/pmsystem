const router = require('express').Router()
const pool = require('../db')

router.get('/branches', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM branch WHERE branch_type = 'pharmacy' ORDER BY branch_id`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/suppliers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM suppliers ORDER BY name')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY name')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/create', async (req, res) => {
  const { branchId, items } = req.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const orderRes = await client.query(
      `INSERT INTO orders (order_date, status) VALUES (CURRENT_DATE, 'pending') RETURNING order_id`
    )
    const orderId = orderRes.rows[0].order_id
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, supplier_id, quantity, purchase_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, item.supplierId, item.quantity, item.price]
      )
    }
    await client.query('COMMIT')
    res.json({ message: 'Замовлення створено', orderId })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ message: err.message })
  } finally {
    client.release()
  }
})

router.get('/list', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        o.order_id,
        o.order_date,
        o.status,
        COUNT(oi.order_item_id) as items_count,
        SUM(oi.quantity * oi.purchase_price) as total_amount
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/list/:orderId', async (req, res) => {
  const { orderId } = req.params
  try {
    const { rows } = await pool.query(
      `SELECT 
        oi.order_item_id,
        p.name as product_name,
        s.name as supplier_name,
        oi.quantity,
        oi.purchase_price,
        oi.quantity * oi.purchase_price as total
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       JOIN suppliers s ON oi.supplier_id = s.supplier_id
       WHERE oi.order_id = $1`, [orderId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/status/:orderId', async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body
  try {
    await pool.query(
      `UPDATE orders SET status = $1 WHERE order_id = $2`, [status, orderId]
    )
    res.json({ message: 'Статус оновлено' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router