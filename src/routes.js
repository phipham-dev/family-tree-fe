import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdHome, MdLock } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import DataTables from 'views/admin/dataTables';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: (
      <Icon
        as={MdHome}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: MainDashboard,
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: (
      <Icon
        as={MdBarChart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: '/data-tables',
    component: DataTables,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: (
      <Icon
        as={MdLock}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: SignInCentered,
  },
];

export default routes;
