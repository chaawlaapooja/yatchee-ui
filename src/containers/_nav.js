export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Admin Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Payments']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Refund Cancelled Payments',
    to: '/payments/refund',
    icon: 'cil-euro',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pay Vendors',
    to: '/payments/vendor',
    icon: 'cil-euro',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Utils']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Wash Types',
    to: '/utils/washtypes',
    icon: 'cil-notes',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Services',
    to: '/utils/services',
    icon: 'cil-globe-alt',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Checkup Cost',
    to: '/utils/checkupcost',
    icon: 'cil-check-circle',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Analytics']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/analytics/users',
    icon: 'cil-user',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Vendors',
    to: '/analytics/vendors',
    icon: 'cil-asterisk',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Washes',
    to: '/analytics/washes',
    icon: 'cil-task',
  },
]

