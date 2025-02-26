import React from 'react';

import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdHome, MdLock, MdAccountTree, MdOutlineExtension } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import DataTables from 'views/admin/dataTables';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import Branch from 'views/admin/branch/index.jsx';
import Group from 'views/admin/group/index.jsx';
import Person from 'views/admin/person/index.jsx';
import CreatePerson from 'views/admin/person/components/CreatePerson.js';
import EditPerson from 'views/admin/person/components/EditPerson.js';
import FamilyChart from 'views/admin/chart/index.jsx';
import DrawVerticalFamilyTree from 'views/admin/chart/components/DrawVerticalFamilyTree.js';

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
    name: 'Phái',
    layout: '/admin',
    path: '/group',
    component: Group,
    icon: (
      <Icon
        as={MdOutlineExtension}
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
    name: 'Tạo thành viên',
    layout: '/admin',
    path: '/person/create',
    component: CreatePerson,
    hidden: true,
  },
  {
    name: 'Chỉnh sửa thành viên',
    layout: '/admin',
    path: '/person/edit',
    component: EditPerson,
    hidden: true,
  },
  {
    name: 'Thành viên',
    layout: '/admin',
    path: '/person',
    component: Person,
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
    name: 'Vẽ cây gia phả theo chiều dọc',
    layout: '/admin',
    path: '/chart/vertical-family',
    component: DrawVerticalFamilyTree,
    hidden: true,
  },
  {
    name: 'Cây gia phả',
    layout: '/admin',
    path: '/chart',
    component: FamilyChart,
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
    path: '/login',
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
