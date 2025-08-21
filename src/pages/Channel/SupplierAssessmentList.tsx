import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Progress, Tooltip, Select } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  StarOutlined,
  TrophyOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatDate, getCurrentYear } from '@/utils'
import { ASSESSMENT_RESULT_CONFIG, ASSESSMENT_STATUS_CONFIG } from '@/constants'
import type { SupplierAnnualAssessment } from '@/types'

const { Option } = Select

const SupplierAssessmentList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()
  const [selectedYear, setSelectedYear] = useState<string>(getCurrentYear())

  // 供应商年度考核服务API（模拟）
  const assessmentService = {
    getAssessments: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟供应商年度考核数据
      const mockData: SupplierAnnualAssessment[] = [
        {
          id: 1,
          assessmentYear: '2024',
          groupSupplierId: 1,
          groupSupplier: {
            id: 1,
            supplierName: '中远海运港口设备有限公司',
            supplierCode: 'GS001'
          } as any,
          overallScore: 92.5,
          assessmentResult: 'EXCELLENT',
          isQualified: true,
          assessmentStatus: 'COMPLETED',
          headquartersReviewBy: 1,
          headquartersReviewer: { id: 1, name: '李部长' } as any,
          headquartersReviewTime: '2024-12-15T10:00:00',
          finalRemarks: '表现优秀，建议继续合作',
          areaAssessments: [
            {
              id: 1,
              areaId: 1,
              area: { id: 1, departmentName: '码头作业区A' } as any,
              totalScore: 95,
              weight: 0.4,
              weightedScore: 38,
              canModify: false
            } as any,
            {
              id: 2,
              areaId: 2,
              area: { id: 2, departmentName: '码头作业区B' } as any,
              totalScore: 90,
              weight: 0.6,
              weightedScore: 54,
              canModify: false
            } as any
          ],
          createdBy: 1,
          createdTime: '2024-11-01T10:00:00',
          version: 1
        },
        {
          id: 2,
          assessmentYear: '2024',
          groupSupplierId: 2,
          groupSupplier: {
            id: 2,
            supplierName: '上海振华重工（集团）股份有限公司',
            supplierCode: 'GS002'
          } as any,
          overallScore: 85.8,
          assessmentResult: 'GOOD',
          isQualified: true,
          assessmentStatus: 'HEADQUARTERS_REVIEWING',
          headquartersReviewBy: undefined,
          headquartersReviewer: undefined,
          headquartersReviewTime: undefined,
          finalRemarks: undefined,
          areaAssessments: [
            {
              id: 3,
              areaId: 1,
              area: { id: 1, departmentName: '码头作业区A' } as any,
              totalScore: 88,
              weight: 0.5,
              weightedScore: 44,
              canModify: false
            } as any,
            {
              id: 4,
              areaId: 2,
              area: { id: 2, departmentName: '码头作业区B' } as any,
              totalScore: 84,
              weight: 0.5,
              weightedScore: 42,
              canModify: false
            } as any
          ],
          createdBy: 1,
          createdTime: '2024-11-01T10:00:00',
          version: 1
        },
        {
          id: 3,
          assessmentYear: '2024',
          groupSupplierId: 3,
          groupSupplier: {
            id: 3,
            supplierName: '青岛港务机械制造有限公司',
            supplierCode: 'GS003'
          } as any,
          overallScore: 68.5,
          assessmentResult: 'UNQUALIFIED',
          isQualified: false,
          assessmentStatus: 'COMPLETED',
          headquartersReviewBy: 1,
          headquartersReviewer: { id: 1, name: '李部长' } as any,
          headquartersReviewTime: '2024-12-10T10:00:00',
          finalRemarks: '服务质量有待提升，建议整改后重新评估',
          areaAssessments: [
            {
              id: 5,
              areaId: 1,
              area: { id: 1, departmentName: '码头作业区A' } as any,
              totalScore: 70,
              weight: 0.3,
              weightedScore: 21,
              canModify: false
            } as any,
            {
              id: 6,
              areaId: 2,
              area: { id: 2, departmentName: '码头作业区B' } as any,
              totalScore: 67,
              weight: 0.7,
              weightedScore: 46.9,
              canModify: false
            } as any
          ],
          createdBy: 1,
          createdTime: '2024-11-01T10:00:00',
          version: 1
        }
      ]

      // 按年度过滤
      let filteredData = mockData.filter(item => item.assessmentYear === params.assessmentYear)
      
      // 其他过滤条件
      if (params.supplierName) {
        filteredData = filteredData.filter(item => 
          item.groupSupplier?.supplierName.includes(params.supplierName)
        )
      }
      if (params.assessmentResult) {
        filteredData = filteredData.filter(item => 
          item.assessmentResult === params.assessmentResult
        )
      }
      if (params.assessmentStatus) {
        filteredData = filteredData.filter(item => 
          item.assessmentStatus === params.assessmentStatus
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },
    
    deleteAssessment: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    submitToHeadquarters: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    headquartersReview: async (id: number, approved: boolean, remarks?: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }
  }

  // 删除考核
  const deleteMutation = useMutation({
    mutationFn: assessmentService.deleteAssessment,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 提交总部审核
  const submitMutation = useMutation({
    mutationFn: assessmentService.submitToHeadquarters,
    onSuccess: () => {
      message.success('已提交总部审核')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('提交失败')
    },
  })

  // 总部审核
  const reviewMutation = useMutation({
    mutationFn: ({ id, approved, remarks }: { id: number; approved: boolean; remarks?: string }) =>
      assessmentService.headquartersReview(id, approved, remarks),
    onSuccess: () => {
      message.success('审核完成')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('审核失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<SupplierAnnualAssessment>[] = [
    {
      title: '供应商编号',
      dataIndex: ['groupSupplier', 'supplierCode'],
      key: 'supplierCode',
      width: 120,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '供应商名称',
      dataIndex: ['groupSupplier', 'supplierName'],
      key: 'supplierName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '考核年度',
      dataIndex: 'assessmentYear',
      key: 'assessmentYear',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '总分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      width: 120,
      hideInSearch: true,
      render: (value: number) => (
        <Space>
          <Progress
            type="circle"
            size={40}
            percent={value}
            format={(percent) => `${percent}`}
            strokeColor={
              value >= 90 ? '#52c41a' :
              value >= 80 ? '#1890ff' :
              value >= 70 ? '#fa8c16' : '#ff4d4f'
            }
          />
          <span style={{ fontWeight: 'bold' }}>{value}分</span>
        </Space>
      ),
    },
    {
      title: '考核结果',
      dataIndex: 'assessmentResult',
      key: 'assessmentResult',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'EXCELLENT': { text: '优秀' },
        'GOOD': { text: '良好' },
        'QUALIFIED': { text: '合格' },
        'UNQUALIFIED': { text: '不合格' },
      },
      render: (_, record) => {
        const config = ASSESSMENT_RESULT_CONFIG[record.assessmentResult]
        const icon = record.assessmentResult === 'EXCELLENT' ? <TrophyOutlined /> :
                    record.assessmentResult === 'GOOD' ? <StarOutlined /> :
                    record.assessmentResult === 'UNQUALIFIED' ? <WarningOutlined /> : null
        return <Tag color={config.color} icon={icon}>{config.text}</Tag>
      },
    },
    {
      title: '合格状态',
      dataIndex: 'isQualified',
      key: 'isQualified',
      width: 100,
      hideInSearch: true,
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'} icon={value ? <CheckOutlined /> : <CloseOutlined />}>
          {value ? '合格' : '不合格'}
        </Tag>
      ),
    },
    {
      title: '考核状态',
      dataIndex: 'assessmentStatus',
      key: 'assessmentStatus',
      width: 120,
      valueType: 'select',
      valueEnum: {
        'DRAFT': { text: '草稿' },
        'AREA_SUBMITTED': { text: '作业区已提交' },
        'HEADQUARTERS_REVIEWING': { text: '总部审核中' },
        'COMPLETED': { text: '已完成' },
      },
      render: (_, record) => {
        const config = ASSESSMENT_STATUS_CONFIG[record.assessmentStatus]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '作业区评分',
      key: 'areaScores',
      width: 200,
      hideInSearch: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.areaAssessments.map((area, index) => (
            <div key={area.id} style={{ fontSize: '12px' }}>
              <span>{area.area?.departmentName}: </span>
              <span style={{ fontWeight: 'bold' }}>{area.totalScore}分</span>
              <span style={{ color: '#999' }}> (权重{(area.weight * 100).toFixed(0)}%)</span>
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: '总部审核人',
      dataIndex: ['headquartersReviewer', 'name'],
      key: 'headquartersReviewBy',
      width: 120,
      hideInSearch: true,
      render: (text: string, record) => 
        record.headquartersReviewTime ? text : <Tag color="orange">待审核</Tag>,
    },
    {
      title: '审核时间',
      dataIndex: 'headquartersReviewTime',
      key: 'headquartersReviewTime',
      width: 150,
      hideInSearch: true,
      render: (value: string) => value ? formatDate(value) : '-',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 250,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="detail"
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/channel/supplier-assessment/${record.id}`)}
        >
          详情
        </Button>,
        record.assessmentStatus === 'DRAFT' && (
          <Button
            key="edit"
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/channel/supplier-assessment/edit/${record.id}`)}
          >
            编辑
          </Button>
        ),
        record.assessmentStatus === 'AREA_SUBMITTED' && (
          <Button
            key="submit"
            type="link"
            size="small"
            onClick={() => handleSubmitToHeadquarters(record)}
            loading={submitMutation.isPending}
          >
            提交总部
          </Button>
        ),
        record.assessmentStatus === 'HEADQUARTERS_REVIEWING' && (
          <Space key="review">
            <Button
              type="link"
              size="small"
              onClick={() => handleHeadquartersReview(record, true)}
              loading={reviewMutation.isPending}
            >
              通过
            </Button>
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleHeadquartersReview(record, false)}
              loading={reviewMutation.isPending}
            >
              驳回
            </Button>
          </Space>
        ),
        record.assessmentStatus === 'DRAFT' && (
          <Button
            key="delete"
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            loading={deleteMutation.isPending}
          >
            删除
          </Button>
        ),
      ].filter(Boolean),
    },
  ]

  // 处理提交总部审核
  const handleSubmitToHeadquarters = (record: SupplierAnnualAssessment) => {
    Modal.confirm({
      title: '提交总部审核',
      content: `确定要将"${record.groupSupplier?.supplierName}"的年度考核提交给总部审核吗？`,
      onOk: () => submitMutation.mutate(record.id),
    })
  }

  // 处理总部审核
  const handleHeadquartersReview = (record: SupplierAnnualAssessment, approved: boolean) => {
    Modal.confirm({
      title: approved ? '审核通过' : '审核驳回',
      content: `确定要${approved ? '通过' : '驳回'}"${record.groupSupplier?.supplierName}"的年度考核吗？`,
      onOk: () => reviewMutation.mutate({ id: record.id, approved }),
    })
  }

  // 处理删除
  const handleDelete = (record: SupplierAnnualAssessment) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除"${record.groupSupplier?.supplierName}"的年度考核吗？删除后不可恢复。`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  // 生成年度选项
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i.toString())
    }
    return years
  }

  return (
    <div className="page-container">
      <ProTable<SupplierAnnualAssessment>
        headerTitle={
          <Space>
            <span>供应商年度考核</span>
            <Select
              value={selectedYear}
              onChange={(value) => {
                setSelectedYear(value)
                actionRef.current?.reload()
              }}
              style={{ width: 120 }}
            >
              {generateYearOptions().map(year => (
                <Option key={year} value={year}>{year}年</Option>
              ))}
            </Select>
          </Space>
        }
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1600 }}
        toolBarRender={() => [
          <Button
            key="export"
            icon={<ExportOutlined />}
            onClick={() => message.info('导出功能开发中')}
          >
            导出
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/channel/supplier-assessment/new')}
          >
            新建考核
          </Button>,
        ]}
        request={async (params) => {
          return await assessmentService.getAssessments({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            assessmentYear: selectedYear,
            supplierName: params.supplierName,
            assessmentResult: params.assessmentResult,
            assessmentStatus: params.assessmentStatus,
          })
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  )
}

export default SupplierAssessmentList
