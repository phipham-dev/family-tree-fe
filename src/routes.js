import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdHome, MdLock, MdAccountTree } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import DataTables from 'views/admin/dataTables';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import Branch from 'views/admin/branch/index.jsx';

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
    path: '/data-tables',
    component: DataTables,
    icon: (
      <Icon
        as={MdBarChart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
  },
  {
    name: 'Chi',
    layout: '/admin',
    path: '/branch',
    component: Branch,
    icon: (
      <Icon
        as={MdAccountTree}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
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
