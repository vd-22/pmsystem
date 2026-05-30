export const ROLES = {
  PHARMACIST: 'pharmacist',
  BRANCH_MANAGER: 'branch_manager',
  PURCHASE_MANAGER: 'purchase_manager',
  WAREHOUSE_MANAGER: 'warehouse_manager',
  ADMIN: 'admin'
}

export const menuByRole = {
  pharmacist: [
    { path: '/dashboard', label: 'Головна' },
    { path: '/inventory', label: 'Управління запасами' },
  ],
  branch_manager: [
    { path: '/dashboard', label: 'Головна' },
    { path: '/inventory', label: 'Управління запасами' },
    { path: '/orders', label: 'Замовлення' },
    { path: '/analytics', label: 'Аналітика' },
    { path: '/reports', label: 'Звіти' },
  ],
  purchase_manager: [
    { path: '/dashboard', label: 'Головна' },
    { path: '/inventory', label: 'Управління запасами' },
    { path: '/orders', label: 'Замовлення' },
    { path: '/network', label: 'Мережа філіалів' },
    { path: '/analytics', label: 'Аналітика' },
    { path: '/reports', label: 'Звіти' },
  ],
  warehouse_manager: [
    { path: '/dashboard', label: 'Головна' },
    { path: '/inventory', label: 'Управління запасами' },
    { path: '/orders', label: 'Замовлення' },
    { path: '/network', label: 'Мережа філіалів' },
    { path: '/analytics', label: 'Аналітика' },
    { path: '/reports', label: 'Звіти' },
  ],
  admin: [
  { path: '/dashboard', label: 'Головна' },
  { path: '/inventory', label: 'Управління запасами' },
  { path: '/orders', label: 'Замовлення' },
  { path: '/network', label: 'Мережа філіалів' },
  { path: '/analytics', label: 'Аналітика' },
  { path: '/users', label: 'Користувачі' },
  { path: '/reports', label: 'Звіти' },
  ]
}

export const canAccess = (role, path) => {
  const allowed = menuByRole[role] || []
  return allowed.some(item => item.path === path)
}