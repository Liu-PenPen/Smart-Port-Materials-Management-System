import React from 'react'
import { Card, Descriptions, Button, Space, Tag, Drawer, Table, Image } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FullscreenOutlined, 
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { GROUP_SUPPLIER_STATUS_CONFIG } from '@/constants'
import type { GroupSupplier, SupplyCatalogItem } from '@/types'

const GroupSupplierDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取集采供应商详情（模拟）
  const { data: groupSupplier, isLoading } = useQuery({
    queryKey: ['group-supplier-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟集采供应商详情数据
      const mockData: GroupSupplier = {
        id: Number(id),
        supplierCode: 'GS001',
        supplierName: '中远海运港口设备有限公司',
        socialCreditCode: '91110000123456789A',
        companyAddress: '北京市朝阳区建国门外大街1号国贸大厦A座',
        contactPerson: '张经理',
        contactPhone: '010-12345678',
        contactEmail: 'zhang@cosco.com',
        businessLicense: 'BL202501001',
        licenseExpiryDate: '2026-12-31',
        registeredCapital: 50000000,
        businessScope: '港口设备制造、销售、维修；港口机械租赁；技术咨询服务',
        status: 'ACTIVE',
        isUsed: true,
        managedBy: 1,
        manager: { 
          id: 1, 
          name: '李部长',
          phone: '010-87654321',
          email: 'li@group.com'
        } as any,
        supplyCatalog: [
          {
            id: 1,
            groupSupplierId: Number(id),
            materialCategoryId: 1,
            materialCategory: { id: 1, categoryName: '港口机械' } as any,
            materialName: '门式起重机',
            specification: '40吨双梁门式起重机',
            unit: '台',
            unitPrice: 2500000,
            minOrderQuantity: 1,
            deliveryDays: 180,
            qualityStandard: 'GB/T 14406-2017',
            isMainSupplier: true,
            effectiveDate: '2025-01-01',
            expiryDate: '2025-12-31',
            status: 'ACTIVE',
            createdBy: 1,
            createdTime: '2025-01-01T10:00:00',
            version: 1
          },
          {
            id: 2,
            groupSupplierId: Number(id),
            materialCategoryId: 2,
            materialCategory: { id: 2, categoryName: '配件耗材' } as any,
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m 抗拉强度1770MPa',
            unit: '根',
            unitPrice: 1500,
            minOrderQuantity: 10,
            deliveryDays: 15,
            qualityStandard: 'GB 8918-2006',
            isMainSupplier: false,
            effectiveDate: '2025-01-01',
            expiryDate: '2025-12-31',
            status: 'ACTIVE',
            createdBy: 1,
            createdTime: '2025-01-01T10:00:00',
            version: 1
          }
        ],
        remarks: '集团重要合作伙伴，具有丰富的港口设备制造经验，产品质量可靠',
        createdBy: 1,
        createdTime: '2025-01-01T10:00:00',
        version: 1
      }
      
      return mockData
    },
  })

  // 供应清单表格列
  const catalogColumns = [
    {
      title: '物料类别',
      dataIndex: ['materialCategory', 'categoryName'],
      key: 'materialCategoryId',
      width: 120,
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150,
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 200,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (value: number) => `¥${formatMoney(value)}`,
    },
    {
      title: '最小订购量',
      dataIndex: 'minOrderQuantity',
      key: 'minOrderQuantity',
      width: 100,
    },
    {
      title: '交货周期',
      dataIndex: 'deliveryDays',
      key: 'deliveryDays',
      width: 100,
      render: (value: number) => `${value}天`,
    },
    {
      title: '质量标准',
      dataIndex: 'qualityStandard',
      key: 'qualityStandard',
      width: 150,
    },
    {
      title: '主供应商',
      dataIndex: 'isMainSupplier',
      key: 'isMainSupplier',
      width: 100,
      render: (value: boolean) => (
        <Tag color={value ? 'gold' : 'default'}>
          {value ? '主供应商' : '备选'}
        </Tag>
      ),
    },
    {
      title: '有效期',
      key: 'validity',
      width: 180,
      render: (_, record: SupplyCatalogItem) => (
        <Space direction="vertical" size={0}>
          <span>开始：{formatDate(record.effectiveDate)}</span>
          <span>结束：{record.expiryDate ? formatDate(record.expiryDate) : '长期有效'}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (value: string) => (
        <Tag color={value === 'ACTIVE' ? 'green' : 'default'}>
          {value === 'ACTIVE' ? '有效' : '无效'}
        </Tag>
      ),
    },
  ]

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 基本信息 */}
      <Card 
        title="基本信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="供应商编号">
            {groupSupplier?.supplierCode}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            <Space>
              <BankOutlined style={{ color: '#1890ff' }} />
              {groupSupplier?.supplierName}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {groupSupplier && (
              <Tag color={GROUP_SUPPLIER_STATUS_CONFIG[groupSupplier.status]?.color}>
                {GROUP_SUPPLIER_STATUS_CONFIG[groupSupplier.status]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="社会信用编码">
            {groupSupplier?.socialCreditCode}
          </Descriptions.Item>
          <Descriptions.Item label="营业执照号">
            <Space>
              <SafetyCertificateOutlined style={{ color: '#fa8c16' }} />
              {groupSupplier?.businessLicense}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="执照到期日">
            {groupSupplier?.licenseExpiryDate && (
              <Tag color={new Date(groupSupplier.licenseExpiryDate) < new Date() ? 'red' : 'green'}>
                {formatDate(groupSupplier.licenseExpiryDate)}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="注册资本">
            {groupSupplier?.registeredCapital && `¥${formatMoney(groupSupplier.registeredCapital)}`}
          </Descriptions.Item>
          <Descriptions.Item label="使用状态">
            <Tag color={groupSupplier?.isUsed ? 'green' : 'default'}>
              {groupSupplier?.isUsed ? '已使用' : '未使用'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="管理部门">
            {groupSupplier?.manager?.name}
          </Descriptions.Item>
          <Descriptions.Item label="公司地址" span={isFullscreen ? 3 : 2}>
            {groupSupplier?.companyAddress}
          </Descriptions.Item>
          <Descriptions.Item label="经营范围" span={isFullscreen ? 3 : 2}>
            {groupSupplier?.businessScope}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={isFullscreen ? 3 : 2}>
            {groupSupplier?.remarks}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 联系信息 */}
      <Card 
        title="联系信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="联系人">
            {groupSupplier?.contactPerson}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            <Space>
              <PhoneOutlined style={{ color: '#52c41a' }} />
              {groupSupplier?.contactPhone}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {groupSupplier?.contactEmail && (
              <Space>
                <MailOutlined style={{ color: '#1890ff' }} />
                {groupSupplier.contactEmail}
              </Space>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 供应清单 */}
      <Card 
        title="供应清单" 
        size={isFullscreen ? 'default' : 'small'}
        extra={
          <Space>
            <Button 
              type="link" 
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => navigate(`/channel/group-supplier/${id}/catalog`)}
            >
              管理清单
            </Button>
            <Button type="link" size="small">
              导出清单
            </Button>
          </Space>
        }
      >
        <Table
          columns={catalogColumns}
          dataSource={groupSupplier?.supplyCatalog || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  )

  return (
    <>
      <div className="page-container">
        <Card
          title={
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/channel/group-supplier')}
              >
                返回
              </Button>
              集采供应商详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              <Button 
                icon={<EditOutlined />}
                onClick={() => navigate(`/channel/group-supplier/edit/${id}`)}
              >
                编辑
              </Button>
              <Button 
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
              >
                打印
              </Button>
              <Button 
                icon={<FullscreenOutlined />}
                onClick={() => setIsFullscreen(true)}
              >
                全屏查看
              </Button>
            </Space>
          }
        >
          <DetailContent />
        </Card>
      </div>

      {/* 全屏抽屉 */}
      <Drawer
        title="集采供应商详情"
        placement="right"
        size="large"
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        extra={
          <Space>
            <Button 
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
            >
              打印
            </Button>
            <Button 
              type="primary"
              onClick={() => setIsFullscreen(false)}
            >
              确定
            </Button>
          </Space>
        }
        styles={{
          body: { padding: 0 }
        }}
      >
        <DetailContent />
      </Drawer>
    </>
  )
}

export default GroupSupplierDetail
