const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const inventoryRoutes = require('./routes/inventory')
app.use('/api/inventory', inventoryRoutes)

const usersRoutes = require('./routes/users')
app.use('/api/users', usersRoutes)

const ordersRoutes = require('./routes/orders')
app.use('/api/orders', ordersRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Сервер працює!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`)
})