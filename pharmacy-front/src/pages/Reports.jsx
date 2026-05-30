import { useState, useEffect } from 'react'
import axios from 'axios'

function Reports() {
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('${import.meta.env.VITE_API_URL}/api/inventory/branches')
      .then(r => {
        setBranches(r.data)
        setSelectedBranch(r.data[0]?.branch_id)
      })
  }, [])

  const generateStockReport = async () => {
    setLoading(true)
    const branch = branches.find(b => b.branch_id == selectedBranch)
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventory/branch/${selectedBranch}`)

    const date = new Date().toLocaleDateString('uk-UA')
    const html = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
          .header-right { text-align: right; font-size: 11px; margin-bottom: 20px; }
          h2 { text-align: center; font-size: 16px; text-transform: uppercase; margin: 20px 0; }
          .info { margin-bottom: 16px; }
          .info p { margin: 4px 0; }
          .params { border: 1px solid #ccc; padding: 10px; margin-bottom: 16px; background: #f9f9f9; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #4472c4; color: white; padding: 6px; text-align: center; font-size: 11px; border: 1px solid #ccc; }
          td { padding: 5px 6px; border: 1px solid #ccc; font-size: 11px; }
          tr:nth-child(even) { background: #f2f2f2; }
          .expired { background: #ffcccc !important; }
          .low { background: #fff3cc !important; }
          .total { font-weight: bold; text-align: right; margin-top: 10px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header-right">
          Форма № ___________<br>
          Затверджено наказом № _____ від ___________
        </div>

        <h2>Звіт про поточні залишки</h2>
        <hr>

        <div class="info">
          <p><strong>Назва закладу:</strong> ${branch?.name}</p>
          <p><strong>Адреса:</strong> ${branch?.address}</p>
          <p><strong>Телефон:</strong> ${branch?.phone || '_______________'}</p>
        </div>

        <div class="params">
          <strong>Параметри звіту:</strong><br>
          Станом на: ${date}<br>
          Відповідальна особа: ${branch?.manager_name || '_______________'}
        </div>

        <table>
          <thead>
            <tr>
              <th>№ п/п</th>
              <th>Найменування товару</th>
              <th>Серія</th>
              <th>Термін придатності</th>
              <th>Кількість</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((item, i) => {
              const exp = new Date(item.expiration_date)
              const now = new Date()
              const isExpired = exp < now
              const isLow = item.current_quantity <= item.min_level
              const rowClass = isExpired ? 'expired' : isLow ? 'low' : ''
              return `
                <tr class="${rowClass}">
                  <td style="text-align:center">${i + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.batch_number}</td>
                  <td style="text-align:center">${exp.toLocaleDateString('uk-UA')}</td>
                  <td style="text-align:center">${item.current_quantity}</td>
                  <td style="text-align:center">${isExpired ? 'Прострочено' : isLow ? 'Мало' : 'Норма'}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>

        <p class="total">Всього позицій: ${data.length}</p>

        <br><br>
        <p>Склав: _______________  Дата: ${date}</p>
        <button onclick="window.print()" style="margin-top:20px; padding:10px 20px; background:#1890ff; color:white; border:none; border-radius:4px; cursor:pointer; font-size:14px;">
           Друкувати / Зберегти PDF
        </button>
      </body>
      </html>
    `
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    setLoading(false)
  }

  const generateOrderReport = async () => {
    setLoading(true)
    const branch = branches.find(b => b.branch_id == selectedBranch)
    const { data: orders } = await axios.get('${import.meta.env.VITE_API_URL}/api/orders/list')
    const date = new Date().toLocaleDateString('uk-UA')

    let allItems = []
    for (const order of orders.slice(0, 5)) {
      const { data: items } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/list/${order.order_id}`)
      allItems = [...allItems, ...items.map(i => ({ ...i, orderId: order.order_id, orderDate: order.order_date }))]
    }

    const html = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
          h2 { text-align: center; font-size: 16px; text-transform: uppercase; margin: 20px 0; }
          .num { text-align: center; margin-bottom: 20px; }
          .two-col { display: flex; gap: 20px; margin-bottom: 16px; }
          .box { flex: 1; border: 1px solid #ccc; padding: 12px; }
          .box h3 { text-align: center; background: #d9d9d9; margin: -12px -12px 10px; padding: 6px; font-size: 12px; }
          .box p { margin: 4px 0; font-size: 11px; }
          .params { border: 1px solid #ccc; padding: 10px; margin-bottom: 16px; font-size: 11px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #4472c4; color: white; padding: 6px; text-align: center; font-size: 11px; border: 1px solid #ccc; }
          td { padding: 5px 6px; border: 1px solid #ccc; font-size: 11px; }
          tr:nth-child(even) { background: #f2f2f2; }
          .total-row { font-weight: bold; background: #e8e8e8 !important; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h2>Замовлення постачальнику</h2>
        <hr>
        <p class="num">№ _________ від "${date}"</p>

        <div class="two-col">
          <div class="box">
            <h3>ЗАМОВНИК</h3>
            <p><strong>Назва:</strong> ${branch?.name}</p>
            <p><strong>Адреса:</strong> ${branch?.address}</p>
            <p><strong>Тел.:</strong> ${branch?.phone || '_______________'}</p>
            <p><strong>Керівник:</strong> ${branch?.manager_name || '_______________'}</p>
          </div>
          <div class="box">
            <h3>ПОСТАЧАЛЬНИК</h3>
            <p><strong>Назва:</strong> _______________</p>
            <p><strong>Адреса:</strong> _______________</p>
            <p><strong>Тел.:</strong> _______________</p>
            <p><strong>Email:</strong> _______________</p>
          </div>
        </div>

        <div class="params">
          Деталі замовлення:<br>
          Термін постачання: з "___" ___________ 20__ р. по "___" ___________ 20__ р.<br>
          Умови оплати: _______________<br>
          Форма оплати: □ Готівка □ Безготівковий розрахунок
        </div>

        <table>
          <thead>
            <tr>
              <th>№ п/п</th>
              <th>Найменування товару</th>
              <th>Постачальник</th>
              <th>Кількість</th>
              <th>Ціна, грн</th>
              <th>Сума, грн</th>
            </tr>
          </thead>
          <tbody>
            ${allItems.map((item, i) => `
              <tr>
                <td style="text-align:center">${i + 1}</td>
                <td>${item.product_name}</td>
                <td>${item.supplier_name}</td>
                <td style="text-align:center">${item.quantity}</td>
                <td style="text-align:right">${parseFloat(item.purchase_price).toFixed(2)}</td>
                <td style="text-align:right">${parseFloat(item.total).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="5" style="text-align:right">Всього:</td>
              <td style="text-align:right">
                ${allItems.reduce((sum, i) => sum + parseFloat(i.total), 0).toFixed(2)} грн
              </td>
            </tr>
          </tbody>
        </table>

        <br><br>
        <p>Керівник: _______________  Дата: ${date}</p>
        <button onclick="window.print()" style="margin-top:20px; padding:10px 20px; background:#1890ff; color:white; border:none; border-radius:4px; cursor:pointer; font-size:14px;">
           Друкувати / Зберегти PDF
        </button>
      </body>
      </html>
    `
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    setLoading(false)
  }

  const generateLowStockRequest = async () => {
    setLoading(true)
    const branch = branches.find(b => b.branch_id == selectedBranch)
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/inventory/branch/${selectedBranch}`)
    const lowItems = data.filter(i => i.current_quantity <= i.min_level)
    const date = new Date().toLocaleDateString('uk-UA')

    const html = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
          h2 { text-align: center; font-size: 16px; text-transform: uppercase; margin: 20px 0; }
          .num { text-align: center; margin-bottom: 20px; }
          .two-col { display: flex; gap: 20px; margin-bottom: 16px; }
          .box { flex: 1; border: 1px solid #ccc; padding: 12px; }
          .box h3 { text-align: center; background: #d9d9d9; margin: -12px -12px 10px; padding: 6px; font-size: 12px; }
          .box p { margin: 4px 0; font-size: 11px; }
          .priority { border: 1px solid #ccc; padding: 10px; margin-bottom: 16px; background: #fff3cc; font-size: 11px; text-align: center; }
          .params { border: 1px solid #ccc; padding: 10px; margin-bottom: 16px; font-size: 11px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #4472c4; color: white; padding: 6px; text-align: center; font-size: 11px; border: 1px solid #ccc; }
          td { padding: 5px 6px; border: 1px solid #ccc; font-size: 11px; }
          tr:nth-child(even) { background: #f2f2f2; }
          .urgent { background: #ffcccc !important; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h2>Заявка на поповнення запасів від аптеки</h2>
        <hr>
        <p class="num">№ _________ від "${date}"</p>

        <div class="two-col">
          <div class="box">
            <h3>ЗАЯВНИК (АПТЕКА)</h3>
            <p><strong>Назва:</strong> ${branch?.name}</p>
            <p><strong>Адреса:</strong> ${branch?.address}</p>
            <p><strong>Тел.:</strong> ${branch?.phone || '_______________'}</p>
            <p><strong>Завідувач:</strong> ${branch?.manager_name || '_______________'}</p>
          </div>
          <div class="box">
            <h3>ОДЕРЖУВАЧ ЗАЯВКИ</h3>
            <p><strong>Назва:</strong> Центральний склад</p>
            <p><strong>Відділ:</strong> _______________</p>
            <p><strong>Тел.:</strong> _______________</p>
            <p><strong>Відповідальна особа:</strong> _______________</p>
          </div>
        </div>

        <div class="priority">
          Пріоритет заявки: □ ТЕРМІНОВО (1-2 дні) □ ВИСОКИЙ (3-5 днів) □ ЗВИЧАЙНИЙ (до 7 днів)
        </div>

        <div class="params">
          Деталі заявки:<br>
          Бажана дата постачання: "___" ___________ 20__ р.<br>
          Підстава для замовлення: □ Планове поповнення □ Низький залишок □ Високий попит □ Сезонна потреба<br>
          Спосіб доставки: □ Самовивіз □ Доставка кур'єром □ Транспортною компанією
        </div>

        <table>
          <thead>
            <tr>
              <th>№ п/п</th>
              <th>Найменування товару</th>
              <th>Поточний залишок</th>
              <th>Мінімальний запас</th>
              <th>Запитувана кількість</th>
              <th>Примітка</th>
            </tr>
          </thead>
          <tbody>
            ${lowItems.map((item, i) => `
              <tr class="${item.current_quantity === 0 ? 'urgent' : ''}">
                <td style="text-align:center">${i + 1}</td>
                <td>${item.name}</td>
                <td style="text-align:center">${item.current_quantity}</td>
                <td style="text-align:center">${item.min_level}</td>
                <td style="text-align:center">${item.max_level - item.current_quantity}</td>
                <td>${item.current_quantity === 0 ? 'ТЕРМІНОВО' : 'Низький залишок'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <br><br>
        <p>Завідувач аптеки: _______________  Дата: ${date}</p>
        <button onclick="window.print()" style="margin-top:20px; padding:10px 20px; background:#1890ff; color:white; border:none; border-radius:4px; cursor:pointer; font-size:14px;">
           Друкувати / Зберегти PDF
        </button>
      </body>
      </html>
    `
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    setLoading(false)
  }

  const reports = [
    {
      title: 'Звіт про поточні залишки',
      desc: 'Список всіх препаратів філіалу з кількістю та терміном придатності',
      color: '#1890ff',
      action: generateStockReport
    },
    {
      title: 'Замовлення постачальнику',
      desc: 'Документ замовлення товарів у постачальника',
      color: '#52c41a',
      action: generateOrderReport
    },
    {
      title: 'Заявка на поповнення запасів',
      desc: 'Список препаратів з низькими залишками для поповнення зі складу',
      color: '#fa8c16',
      action: generateLowStockRequest
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '4px' }}>Звіти</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>Формування та друк документів</p>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
          Філіал:
        </label>
        <select
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: '6px',
            border: '1px solid #ddd', fontSize: '14px', width: '300px'
          }}
        >
          {branches.map(b => (
            <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reports.map(report => (
          <div key={report.title} style={{
            background: 'white', borderRadius: '8px',
            padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: `4px solid ${report.color}`
          }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px' }}>{report.title}</h3>
              <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{report.desc}</p>
            </div>
            <button
              onClick={report.action}
              disabled={loading}
              style={{
                padding: '10px 20px', background: report.color,
                color: 'white', border: 'none', borderRadius: '6px',
                fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
               Сформувати
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reports