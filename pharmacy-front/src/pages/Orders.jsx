import { useState, useEffect } from 'react'
import axios from 'axios'

const statusColors = {
  pending: { label: 'Очікує', color: '#faad14', bg: '#fffbe6' },
  sent: { label: 'Відправлено', color: '#1890ff', bg: '#e6f7ff' },
  received: { label: 'Отримано', color: '#52c41a', bg: '#f6ffed' },
  cancelled: { label: 'Скасовано', color: '#f5222d', bg: '#fff2f0' },
}

function Orders() {
  const [tab, setTab] = useState('list')
  const [branches, setBranches] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState('')
  const [success, setSuccess] = useState(false)
  const [orders, setOrders] = useState([])
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [orderDetails, setOrderDetails] = useState({})
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    axios.get('${import.meta.env.VITE_API_URL}/api/orders/branches').then(r => {
      setBranches(r.data)
      setSelectedBranch(r.data[0]?.branch_id)
    })
    axios.get('${import.meta.env.VITE_API_URL}/api/orders/products').then(r => setProducts(r.data))
    axios.get('${import.meta.env.VITE_API_URL}/api/orders/suppliers').then(r => {
      setSuppliers(r.data)
      setSelectedSupplier(r.data[0]?.supplier_id)
    })
    loadOrders()
  }, [])

  useEffect(() => {
    if (products.length) setSelectedProduct(products[0]?.product_id)
  }, [products])

  const loadOrders = () => {
    axios.get('${import.meta.env.VITE_API_URL}/api/orders/list').then(r => setOrders(r.data))
  }

  const toggleOrder = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
      return
    }
    setExpandedOrder(orderId)
    if (!orderDetails[orderId]) {
      const r = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/list/${orderId}`)
      setOrderDetails({ ...orderDetails, [orderId]: r.data })
    }
  }

  const updateStatus = async (orderId, status) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/orders/status/${orderId}`, { status })
    loadOrders()
  }

  const total = orderItems.reduce((sum, i) => sum + i.quantity * i.price, 0)

  const addItem = () => {
    const product = products.find(p => p.product_id == selectedProduct)
    const supplier = suppliers.find(s => s.supplier_id == selectedSupplier)
    if (!product || !price) return
    setOrderItems([...orderItems, {
      productId: product.product_id,
      supplierId: supplier.supplier_id,
      productName: product.name,
      supplierName: supplier.name,
      quantity: parseInt(quantity),
      price: parseFloat(price)
    }])
    setQuantity(1)
    setPrice('')
  }

  const removeItem = (index) => setOrderItems(orderItems.filter((_, i) => i !== index))

  const submitOrder = async () => {
    if (!orderItems.length) return
    try {
      await axios.post('${import.meta.env.VITE_API_URL}/api/orders/create', {
        branchId: selectedBranch,
        items: orderItems
      })
      setOrderItems([])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      loadOrders()
      setTab('list')
    } catch (err) {
      console.error(err)
    }
  }

  const canCreate = ['branch_manager', 'purchase_manager', 'warehouse_manager', 'admin'].includes(user?.role)
  const canChangeStatus = ['warehouse_manager', 'admin'].includes(user?.role)

  return (
    <div>
      <h2 style={{ marginBottom: '4px' }}>Замовлення</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Управління замовленнями постачальникам</p>

      {success && (
        <div style={{
          background: '#f6ffed', border: '1px solid #b7eb8f',
          borderRadius: '8px', padding: '12px 16px',
          marginBottom: '16px', color: '#389e0d'
        }}>
          ✅ Замовлення успішно відправлено!
        </div>
      )}

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setTab('list')}
          style={{
            padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
            border: 'none', fontSize: '14px',
            background: tab === 'list' ? '#1890ff' : 'white',
            color: tab === 'list' ? 'white' : '#333',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}
        >
          Список замовлень
        </button>
        {canCreate && (
          <button
            onClick={() => setTab('create')}
            style={{
              padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
              border: 'none', fontSize: '14px',
              background: tab === 'create' ? '#1890ff' : 'white',
              color: tab === 'create' ? 'white' : '#333',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}
          >
            + Нове замовлення
          </button>
        )}
      </div>

      {/* Список замовлень */}
      {tab === 'list' && (
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                {['№', 'Дата', 'Кількість позицій', 'Сума', 'Статус', 'Дії'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '13px', color: '#888', fontWeight: '500'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const st = statusColors[order.status] || statusColors.pending
                return (
                  <>
                    <tr
                      key={order.order_id}
                      style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                      onClick={() => toggleOrder(order.order_id)}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: '500' }}>#{order.order_id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                        {new Date(order.order_date).toLocaleDateString('uk-UA')}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>{order.items_count} поз.</td>
                      <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1890ff' }}>
                        ₴{parseFloat(order.total_amount || 0).toLocaleString('uk-UA')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          background: st.bg, color: st.color,
                          padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {canChangeStatus && order.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => updateStatus(order.order_id, 'sent')}
                              style={{
                                padding: '4px 10px', fontSize: '12px', cursor: 'pointer',
                                background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px'
                              }}
                            >
                              Відправити
                            </button>
                            <button
                              onClick={() => updateStatus(order.order_id, 'cancelled')}
                              style={{
                                padding: '4px 10px', fontSize: '12px', cursor: 'pointer',
                                background: '#fff2f0', color: '#f5222d', border: '1px solid #ffccc7', borderRadius: '4px'
                              }}
                            >
                              Скасувати
                            </button>
                          </div>
                        )}
                        {canChangeStatus && order.status === 'sent' && (
                          <button
                            onClick={e => { e.stopPropagation(); updateStatus(order.order_id, 'received') }}
                            style={{
                              padding: '4px 10px', fontSize: '12px', cursor: 'pointer',
                              background: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f', borderRadius: '4px'
                            }}
                          >
                            Підтвердити отримання
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedOrder === order.order_id && orderDetails[order.order_id] && (
                      <tr key={`detail-${order.order_id}`}>
                        <td colSpan={6} style={{ padding: '0 16px 16px 32px', background: '#fafafa' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr>
                                {['Препарат', 'Постачальник', 'Кількість', 'Ціна', 'Сума'].map(h => (
                                  <th key={h} style={{
                                    padding: '8px 12px', textAlign: 'left',
                                    fontSize: '12px', color: '#888', fontWeight: '500'
                                  }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetails[order.order_id].map(item => (
                                <tr key={item.order_item_id}>
                                  <td style={{ padding: '8px 12px', fontSize: '13px' }}>{item.product_name}</td>
                                  <td style={{ padding: '8px 12px', fontSize: '13px', color: '#888' }}>{item.supplier_name}</td>
                                  <td style={{ padding: '8px 12px', fontSize: '13px' }}>{item.quantity}</td>
                                  <td style={{ padding: '8px 12px', fontSize: '13px' }}>₴{item.purchase_price}</td>
                                  <td style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '500', color: '#1890ff' }}>
                                    ₴{parseFloat(item.total).toLocaleString('uk-UA')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Нове замовлення */}
      {tab === 'create' && (
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ width: '260px', flexShrink: 0 }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Оберіть аптеку</h3>
              {branches.map(b => (
                <div
                  key={b.branch_id}
                  onClick={() => setSelectedBranch(b.branch_id)}
                  style={{
                    padding: '12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '8px',
                    border: selectedBranch == b.branch_id ? '2px solid #1890ff' : '2px solid #f0f0f0',
                    background: selectedBranch == b.branch_id ? '#e6f7ff' : 'white'
                  }}
                >
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{b.name}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{b.address}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '15px' }}>Додати препарат</h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Препарат</label>
                <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}>
                  {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Постачальник</label>
                <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}>
                  {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Ціна (грн)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Кількість</label>
                  <input type="number" value={quantity} min="1" onChange={e => setQuantity(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }} />
                </div>
              </div>
              <button onClick={addItem} style={{
                width: '100%', padding: '10px', background: '#52c41a',
                color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer'
              }}>
                + Додати препарат
              </button>
            </div>

            {orderItems.length > 0 && (
              <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Замовлення ({orderItems.length} позицій)</h3>
                {orderItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.productName}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                        {item.supplierName} · {item.quantity} шт · ₴{item.price}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <strong style={{ color: '#1890ff' }}>₴{(item.quantity * item.price).toFixed(2)}</strong>
                      <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#f5222d', cursor: 'pointer', fontSize: '13px' }}>
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <strong style={{ fontSize: '16px' }}>Загальна сума: ₴{total.toFixed(2)}</strong>
                  <button onClick={submitOrder} style={{
                    padding: '10px 24px', background: '#1890ff',
                    color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer'
                  }}>
                    Відправити замовлення
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders