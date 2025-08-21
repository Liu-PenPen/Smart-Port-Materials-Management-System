export const menuConfig = [
  {
    path: '/dashboard',
    name: '工作台',
    icon: 'DashboardOutlined',
  },
  {
    path: '/master-data',
    name: '渠道管理',
    icon: 'AppstoreOutlined',
    children: [
      {
        path: '/supplier',
        name: '供应商管理',
        icon: 'ShopOutlined',
      },
      {
        path: '/channel/group-supplier',
        name: '集采供应商',
        icon: 'BankOutlined',
      },
      {
        path: '/channel/supplier-assessment',
        name: '供应商年度考核',
        icon: 'TrophyOutlined',
      },

    ],
  },
  {
    path: '/cargo',
    name: '货物管理',
    icon: 'ContainerOutlined',
    children: [
      {
        path: '/cargo/material-request',
        name: '物资申请',
        icon: 'FileAddOutlined',
      },
      {
        path: '/cargo/material-purchase',
        name: '物资采购',
        icon: 'ShoppingCartOutlined',
      },
      {
        path: '/cargo/purchase-settlement',
        name: '物资采购结算',
        icon: 'AccountBookOutlined',
      },
      {
        path: '/cargo/arrival-management',
        name: '到货管理',
        icon: 'InboxOutlined',
      },
      {
        path: '/cargo/material-tracking',
        name: '物资追踪',
        icon: 'SearchOutlined',
      },
    ],
  },
  {
    path: '/storage',
    name: '仓储管理',
    icon: 'BankOutlined',
    children: [
      {
        path: '/storage/inbound',
        name: '入库管理',
        icon: 'ImportOutlined',
      },
      {
        path: '/storage/outbound',
        name: '出库管理',
        icon: 'ExportOutlined',
      },
      {
        path: '/storage/transfer',
        name: '移库管理',
        icon: 'SwapOutlined',
      },
    ],
  },
  {
    path: '/inventory',
    name: '库存管理',
    icon: 'InboxOutlined',
    children: [
      {
        path: '/inventory',
        name: '库存查询',
        icon: 'InboxOutlined',
      },
      {
        path: '/inventory/alert',
        name: '库存预警',
        icon: 'AlertOutlined',
      },
      {
        path: '/inventory/analysis',
        name: '库存分析',
        icon: 'BarChartOutlined',
      },
    ],
  },
  {
    path: '/report',
    name: '报表中心',
    icon: 'BarChartOutlined',
    children: [
      {
        path: '/reports/dashboard',
        name: '驾驶舱',
        icon: 'DashboardOutlined',
      },
    ],
  },
]
