import React from 'react'
import { Card, Descriptions, Button, Space, Tag, Drawer, Table, Progress, Steps, Timeline } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FullscreenOutlined, 
  EditOutlined,
  TrophyOutlined,
  StarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatDate } from '@/utils'
import { ASSESSMENT_RESULT_CONFIG, ASSESSMENT_STATUS_CONFIG, ASSESSMENT_CRITERIA_CATEGORY_CONFIG } from '@/constants'
import type { SupplierAnnualAssessment, AreaAssessment, AssessmentDetail } from '@/types'

const SupplierAssessmentDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取供应商年度考核详情（模拟）
  const { data: assessment, isLoading } = useQuery({
    queryKey: ['supplier-assessment-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟供应商年度考核详情数据
      const mockData: SupplierAnnualAssessment = {
        id: Number(id),
        assessmentYear: '2024',
        groupSupplierId: 1,
        groupSupplier: {
          id: 1,
          supplierName: '中远海运港口设备有限公司',
          supplierCode: 'GS001',
          contactPerson: '张经理',
          contactPhone: '010-12345678'
        } as any,
        overallScore: 92.5,
        assessmentResult: 'EXCELLENT',
        isQualified: true,
        assessmentStatus: 'COMPLETED',
        headquartersReviewBy: 1,
        headquartersReviewer: { 
          id: 1, 
          name: '李部长',
          phone: '010-87654321'
        } as any,
        headquartersReviewTime: '2024-12-15T10:00:00',
        finalRemarks: '该供应商在2024年度表现优秀，产品质量稳定，服务态度良好，交货及时，建议继续保持合作关系。',
        areaAssessments: [
          {
            id: 1,
            annualAssessmentId: Number(id),
            areaId: 1,
            area: { 
              id: 1, 
              departmentName: '码头作业区A',
              departmentCode: 'AREA_A'
            } as any,
            assessorId: 1,
            assessor: { id: 1, name: '王主任' } as any,
            serviceQualityScore: 95,
            serviceAttitudeScore: 94,
            serviceTimelinessScore: 96,
            totalScore: 95,
            weight: 0.4,
            weightedScore: 38,
            assessmentDate: '2024-11-30',
            canModify: false,
            remarks: '设备质量优秀，技术支持及时',
            assessmentDetails: [
              {
                id: 1,
                areaAssessmentId: 1,
                criteriaId: 1,
                criteria: {
                  id: 1,
                  criteriaName: '产品质量',
                  category: 'QUALITY',
                  maxScore: 30
                } as any,
                score: 28,
                maxScore: 30,
                remarks: '产品质量稳定可靠'
              } as any,
              {
                id: 2,
                areaAssessmentId: 1,
                criteriaId: 2,
                criteria: {
                  id: 2,
                  criteriaName: '技术支持',
                  category: 'QUALITY',
                  maxScore: 20
                } as any,
                score: 19,
                maxScore: 20,
                remarks: '技术支持响应及时'
              } as any
            ],
            createdBy: 1,
            createdTime: '2024-11-30T10:00:00',
            version: 1
          },
          {
            id: 2,
            annualAssessmentId: Number(id),
            areaId: 2,
            area: { 
              id: 2, 
              departmentName: '码头作业区B',
              departmentCode: 'AREA_B'
            } as any,
            assessorId: 2,
            assessor: { id: 2, name: '刘经理' } as any,
            serviceQualityScore: 90,
            serviceAttitudeScore: 89,
            serviceTimelinessScore: 91,
            totalScore: 90,
            weight: 0.6,
            weightedScore: 54,
            assessmentDate: '2024-12-01',
            canModify: false,
            remarks: '整体表现良好，个别环节有待提升',
            assessmentDetails: [
              {
                id: 3,
                areaAssessmentId: 2,
                criteriaId: 1,
                criteria: {
                  id: 1,
                  criteriaName: '产品质量',
                  category: 'QUALITY',
                  maxScore: 30
                } as any,
                score: 27,
                maxScore: 30,
                remarks: '产品质量良好'
              } as any,
              {
                id: 4,
                areaAssessmentId: 2,
                criteriaId: 3,
                criteria: {
                  id: 3,
                  criteriaName: '服务响应',
                  category: 'ATTITUDE',
                  maxScore: 25
                } as any,
                score: 22,
                maxScore: 25,
                remarks: '服务响应速度有待提升'
              } as any
            ],
            createdBy: 2,
            createdTime: '2024-12-01T10:00:00',
            version: 1
          }
        ],
        createdBy: 1,
        createdTime: '2024-11-01T10:00:00',
        version: 1
      }
      
      return mockData
    },
  })

  // 作业区评分表格列
  const areaColumns = [
    {
      title: '作业区',
      dataIndex: ['area', 'departmentName'],
      key: 'areaId',
      width: 150,
    },
    {
      title: '评分人',
      dataIndex: ['assessor', 'name'],
      key: 'assessorId',
      width: 100,
    },
    {
      title: '服务质量',
      dataIndex: 'serviceQualityScore',
      key: 'serviceQualityScore',
      width: 100,
      render: (value: number) => (
        <Space>
          <Progress
            type="circle"
            size={30}
            percent={value}
            format={() => value}
            strokeColor={value >= 90 ? '#52c41a' : value >= 80 ? '#1890ff' : '#fa8c16'}
          />
        </Space>
      ),
    },
    {
      title: '服务态度',
      dataIndex: 'serviceAttitudeScore',
      key: 'serviceAttitudeScore',
      width: 100,
      render: (value: number) => (
        <Space>
          <Progress
            type="circle"
            size={30}
            percent={value}
            format={() => value}
            strokeColor={value >= 90 ? '#52c41a' : value >= 80 ? '#1890ff' : '#fa8c16'}
          />
        </Space>
      ),
    },
    {
      title: '服务时效',
      dataIndex: 'serviceTimelinessScore',
      key: 'serviceTimelinessScore',
      width: 100,
      render: (value: number) => (
        <Space>
          <Progress
            type="circle"
            size={30}
            percent={value}
            format={() => value}
            strokeColor={value >= 90 ? '#52c41a' : value >= 80 ? '#1890ff' : '#fa8c16'}
          />
        </Space>
      ),
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 100,
      render: (value: number) => (
        <Tag color={value >= 90 ? 'green' : value >= 80 ? 'blue' : 'orange'} style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {value}分
        </Tag>
      ),
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 80,
      render: (value: number) => `${(value * 100).toFixed(0)}%`,
    },
    {
      title: '加权分数',
      dataIndex: 'weightedScore',
      key: 'weightedScore',
      width: 100,
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{value.toFixed(1)}</span>
      ),
    },
    {
      title: '评分日期',
      dataIndex: 'assessmentDate',
      key: 'assessmentDate',
      width: 120,
      render: (value: string) => formatDate(value),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
    },
  ]

  // 获取考核进度步骤
  const getAssessmentSteps = () => {
    const steps = [
      { title: '创建考核', description: '创建年度考核计划' },
      { title: '作业区评分', description: '各作业区独立评分' },
      { title: '总部审核', description: '技术总部汇总审核' },
      { title: '结果确认', description: '考核结果确认' },
    ]

    let current = 0
    let status: 'wait' | 'process' | 'finish' | 'error' = 'process'

    switch (assessment?.assessmentStatus) {
      case 'DRAFT':
        current = 0
        break
      case 'AREA_SUBMITTED':
        current = 1
        break
      case 'HEADQUARTERS_REVIEWING':
        current = 2
        break
      case 'COMPLETED':
        current = 3
        status = 'finish'
        break
      default:
        current = 0
    }

    return { steps, current, status }
  }

  const { steps, current, status } = getAssessmentSteps()

  // 生成时间线数据
  const getTimelineItems = () => {
    const items = [
      {
        color: 'green',
        dot: <CheckCircleOutlined />,
        children: (
          <div>
            <p><strong>考核创建</strong></p>
            <p>创建时间：{assessment?.createdTime && formatDate(assessment.createdTime)}</p>
          </div>
        ),
      },
    ]

    assessment?.areaAssessments.forEach((area) => {
      items.push({
        color: 'blue',
        dot: <CheckCircleOutlined />,
        children: (
          <div>
            <p><strong>{area.area?.departmentName} 完成评分</strong></p>
            <p>评分人：{area.assessor?.name}</p>
            <p>评分时间：{formatDate(area.assessmentDate)}</p>
            <p>评分：{area.totalScore}分</p>
          </div>
        ),
      })
    })

    if (assessment?.headquartersReviewTime) {
      items.push({
        color: 'green',
        dot: <CheckCircleOutlined />,
        children: (
          <div>
            <p><strong>总部审核完成</strong></p>
            <p>审核人：{assessment.headquartersReviewer?.name}</p>
            <p>审核时间：{formatDate(assessment.headquartersReviewTime)}</p>
            <p>最终得分：{assessment.overallScore}分</p>
          </div>
        ),
      })
    } else {
      items.push({
        color: 'gray',
        dot: <ClockCircleOutlined />,
        children: (
          <div>
            <p><strong>等待总部审核</strong></p>
          </div>
        ),
      })
    }

    return items
  }

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 考核进度 */}
      <Card 
        title="考核进度" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Steps current={current} status={status} items={steps} />
      </Card>

      {/* 基本信息 */}
      <Card 
        title="考核基本信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="考核年度">
            <Tag color="blue">{assessment?.assessmentYear}年</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="供应商编号">
            {assessment?.groupSupplier?.supplierCode}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {assessment?.groupSupplier?.supplierName}
          </Descriptions.Item>
          <Descriptions.Item label="考核状态">
            {assessment && (
              <Tag color={ASSESSMENT_STATUS_CONFIG[assessment.assessmentStatus]?.color}>
                {ASSESSMENT_STATUS_CONFIG[assessment.assessmentStatus]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="总分">
            <Space>
              <Progress
                type="circle"
                size={60}
                percent={assessment?.overallScore || 0}
                format={(percent) => `${percent}`}
                strokeColor={
                  (assessment?.overallScore || 0) >= 90 ? '#52c41a' :
                  (assessment?.overallScore || 0) >= 80 ? '#1890ff' :
                  (assessment?.overallScore || 0) >= 70 ? '#fa8c16' : '#ff4d4f'
                }
              />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{assessment?.overallScore}分</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="考核结果">
            {assessment && (
              <Tag 
                color={ASSESSMENT_RESULT_CONFIG[assessment.assessmentResult]?.color}
                icon={
                  assessment.assessmentResult === 'EXCELLENT' ? <TrophyOutlined /> :
                  assessment.assessmentResult === 'GOOD' ? <StarOutlined /> :
                  assessment.assessmentResult === 'UNQUALIFIED' ? <WarningOutlined /> : undefined
                }
                style={{ fontSize: '14px' }}
              >
                {ASSESSMENT_RESULT_CONFIG[assessment.assessmentResult]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="合格状态">
            <Tag color={assessment?.isQualified ? 'green' : 'red'}>
              {assessment?.isQualified ? '合格' : '不合格'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="总部审核人">
            {assessment?.headquartersReviewer?.name || <Tag color="orange">待审核</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="审核时间">
            {assessment?.headquartersReviewTime ? formatDate(assessment.headquartersReviewTime) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="总部审核意见" span={isFullscreen ? 3 : 2}>
            {assessment?.finalRemarks || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 作业区评分详情 */}
      <Card 
        title="作业区评分详情" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Table
          columns={areaColumns}
          dataSource={assessment?.areaAssessments || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1000 }}
          summary={(pageData) => {
            const totalWeightedScore = pageData.reduce((sum, record) => sum + record.weightedScore, 0)
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={7}>
                  <strong>加权总分</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                    {totalWeightedScore.toFixed(1)}分
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={2} />
              </Table.Summary.Row>
            )
          }}
        />
      </Card>

      {/* 考核时间线 */}
      <Card 
        title="考核时间线" 
        size={isFullscreen ? 'default' : 'small'}
      >
        <Timeline items={getTimelineItems()} />
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
                onClick={() => navigate('/channel/supplier-assessment')}
              >
                返回
              </Button>
              供应商年度考核详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              {assessment?.assessmentStatus === 'DRAFT' && (
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/channel/supplier-assessment/edit/${id}`)}
                >
                  编辑
                </Button>
              )}
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
        title="供应商年度考核详情"
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

export default SupplierAssessmentDetail
