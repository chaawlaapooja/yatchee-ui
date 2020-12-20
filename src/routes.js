import React from 'react';

const Admin = React.lazy(()=>import('./views/admin/Admin'))
const WashTypes = React.lazy(()=>import('./views/utils/WashTypes'))
const Services = React.lazy(()=>import('./views/utils/Services'))
const CheckupCost = React.lazy(()=>import('./views/utils/CheckupCost'))
const Users = React.lazy(()=>import('./views/analytics/Users'))
const Vendors = React.lazy(()=>import('./views/analytics/Vendors'))
const Washes = React.lazy(()=>import('./views/analytics/Washes'))
const RefundPayment = React.lazy(()=>import('./views/payments/RefundPayment'))
const MakePayment = React.lazy(()=>import('./views/payments/MakePayment'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Admin Dashboard', component: Admin },
  { path: '/payments', name: 'Payments', component: RefundPayment, exact: true },
  { path: '/payments/refund', name: 'Refund Payments', component: RefundPayment },
  { path: '/payments/vendor', name: 'Vendor Payments', component: MakePayment },
  { path: '/utils', name: 'Utils', component: WashTypes, exact: true },
  { path: '/utils/washtypes', name: 'Wash Types', component: WashTypes },
  { path: '/utils/services', name: 'Services', component: Services },
  { path: '/utils/checkupcost', name: 'Checkup Cost', component: CheckupCost },
  { path: '/analytics', name: 'Analytics', component: Users, exact: true },
  { path: '/analytics/users', name: 'Users', component: Users },
  { path: '/analytics/vendors', name: 'Vendors', component: Vendors },
  { path: '/analytics/washes', name: 'Washes', component: Washes },
];

export default routes;
