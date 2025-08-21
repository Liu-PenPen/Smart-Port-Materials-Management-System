import React, { useState } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  message,
  Row,
  Col,
  InputNumber,
  Table,
  Modal,
  Slider,
  Progress
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  PlusOutlined,
  DeleteOutlined,
  StarOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getCurrentYear } from '@/utils'
import { ASSESSMENT_CRITERIA_CATEGORY_CONFIG } from '@/constants'
import type { SupplierAnnualAssessment, AreaAssessment, GroupSupplier, Department } from '@/types'

const { TextArea } = Input
const { Option } = Select

const SupplierAssessmentForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [areaAssessments, setAreaAssessments] = useState<AreaAssessment[]>([])
  const [areaModalVisible, setAreaModalVisible] = useState(false)
  const [editingArea, setEditingArea] = useState<AreaAssessment | null>(null)
  const [areaForm] = Form.useForm()

  // 获取年度考核详情（编辑时）
  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取年度考核数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: SupplierAnnualAssessment = {
        id: Number(id),
        assessmentYear: '2024',
        groupSupplierId: 1,
        overallScore: 92.5,
        assessmentResult: 'EXCELLENT',
        isQualified: true,
        assessmentStatus: 'DRAFT',
        areaAssessments: [
          {
            id: 1,
            annualAssessmentId: Number(id),
            areaId: 1,
            area: { id: 1, departmentName: '码头作业区A' } as any,
            assessorId: 1,
            assessor: { id: 1, name: '王主任' } as any,
            serviceQualityScore: 95,
            serviceAttitudeScore: 94,
            serviceTimelinessScore: 96,
            totalScore: 95,
            weight: 0.4,
            weightedScore: 38,
            assessmentDate: '2024-11-30',
            canModify: true,
            remarks: '设备质量优秀，技术支持及时',
            assessmentDetails: [],
            createdBy: 1,
            createdTime: '2024-11-30T10:00:00',
            version: 1
          }
        ],
        createdBy: 1,
        createdTime: '2024-11-01T10:00:00',
        version: 1
      }
      
      return mockData
    },
    enabled: isEdit,
  })

  // 模拟数据源
  const mockSuppliers: GroupSupplier[] = [
    { id: 1, supplierName: '中远海运港口设备有限公司', supplierCode: 'GS001' } as GroupSupplier,
    { id: 2, supplierName: '上海振华重工（集团）股份有限公司', supplierCode: 'GS002' } as GroupSupplier,
    { id: 3, supplierName: '青岛港务机械制造有限公司', supplierCode: 'GS003' } as GroupSupplier,
  ]

  const mockAreas: Department[] = [
    { id: 1, departmentName: '码头作业区A', departmentCode: 'AREA_A' } as Department,
    { id: 2, departmentName: '码头作业区B', departmentCode: 'AREA_B' } as Department,
    { id: 3, departmentName: '码头作业区C', departmentCode: 'AREA_C' } as Department,
    { id: 4, departmentName: '散货作业区', departmentCode: 'BULK_AREA' } as Department,
  ]

  const mockAssessors = [
    { id: 1, name: '王主任', departmentId: 1 },
    { id: 2, name: '刘经理', departmentId: 2 },
    { id: 3, name: '张主管', departmentId: 3 },
    { id: 4, name: '李经理', departmentId: 4 },
  ]

  // 初始化表单数据
  React.useEffect(() => {
    if (assessment) {
      form.setFieldsValue({
        assessmentYear: assessment.assessmentYear,
        groupSupplierId: assessment.groupSupplierId,
        finalRemarks: assessment.finalRemarks,
      })
      setAreaAssessments(assessment.areaAssessments || [])
    } else {
      // 新建时的默认值
      form.setFieldsValue({
        assessmentYear: getCurrentYear(),
      })
    }
  }, [assessment, form])

  // 计算总分
  const calculateOverallScore = (areas: AreaAssessment[]) => {
    const totalWeightedScore = areas.reduce((sum, area) => sum + area.weightedScore, 0)
    return Math.round(totalWeightedScore * 10) / 10
  }

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
        <Progress
          type="circle"
          size={40}
          percent={value}
          format={() => value}
          strokeColor={value >= 90 ? '#52c41a' : value >= 80 ? '#1890ff' : '#fa8c16'}
        />
      ),
    },
    {
      title: '服务态度',
      dataIndex: 'serviceAttitudeScore',
      key: 'serviceAttitudeScore',
      width: 100,
      render: (value: number) => (
        <Progress
          type="circle"
          size={40}
          percent={value}
          format={() => value}
          strokeColor={value >= 90 ? '#52c41a' : value >= 80 ? '#1890ff' : '#fa8c16'}
        />
      ),
    },
    {
      title: '服务时效',
      dataIndex: 'serviceTimelinessScore',
      key: 'serviceTimelinessScore',
      width: 100,
      render: (value: number) => (
        <Progress
          type="circle"
          size={40}
          percent={value}
          format={() => value}
          strokeColor={value >= 90 ? '#52c41a' : value >= 80 ? '#1890ff' : '#fa8c16'}
        />
      ),
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 80,
      render: (value: number) => <span style={{ fontWeight: 'bold' }}>{value}</span>,
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
      render: (value: number) => <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{value.toFixed(1)}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: AreaAssessment, index: number) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<StarOutlined />}
            onClick={() => handleEditArea(record, index)}
          >
            评分
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteArea(index)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // 处理添加作业区
  const handleAddArea = () => {
    setEditingArea(null)
    areaForm.resetFields()
    areaForm.setFieldsValue({
      weight: 0.2,
      serviceQualityScore: 80,
      serviceAttitudeScore: 80,
      serviceTimelinessScore: 80,
    })
    setAreaModalVisible(true)
  }

  // 处理编辑作业区
  const handleEditArea = (area: AreaAssessment, index: number) => {
    setEditingArea({ ...area, index } as any)
    areaForm.setFieldsValue({
      areaId: area.areaId,
      assessorId: area.assessorId,
      weight: area.weight,
      serviceQualityScore: area.serviceQualityScore,
      serviceAttitudeScore: area.serviceAttitudeScore,
      serviceTimelinessScore: area.serviceTimelinessScore,
      remarks: area.remarks,
    })
    setAreaModalVisible(true)
  }

  // 处理删除作业区
  const handleDeleteArea = (index: number) => {
    const newAreas = areaAssessments.filter((_, i) => i !== index)
    setAreaAssessments(newAreas)
  }

  // 处理保存作业区评分
  const handleSaveArea = async () => {
    try {
      const values = await areaForm.validateFields()
      
      // 计算总分和加权分数
      const totalScore = Math.round((values.serviceQualityScore + values.serviceAttitudeScore + values.serviceTimelinessScore) / 3)
      const weightedScore = totalScore * values.weight

      const selectedArea = mockAreas.find(area => area.id === values.areaId)
      const selectedAssessor = mockAssessors.find(assessor => assessor.id === values.assessorId)

      const areaAssessment: AreaAssessment = {
        id: editingArea?.id || Date.now(),
        annualAssessmentId: Number(id) || 0,
        areaId: values.areaId,
        area: selectedArea,
        assessorId: values.assessorId,
        assessor: selectedAssessor,
        serviceQualityScore: values.serviceQualityScore,
        serviceAttitudeScore: values.serviceAttitudeScore,
        serviceTimelinessScore: values.serviceTimelinessScore,
        totalScore,
        weight: values.weight,
        weightedScore,
        assessmentDate: new Date().toISOString().split('T')[0],
        canModify: true,
        remarks: values.remarks,
        assessmentDetails: [],
        createdBy: 1,
        createdTime: new Date().toISOString(),
        version: 1
      } as AreaAssessment

      let newAreas = [...areaAssessments]
      if (editingArea && 'index' in editingArea) {
        newAreas[(editingArea as any).index] = areaAssessment
      } else {
        newAreas.push(areaAssessment)
      }

      setAreaAssessments(newAreas)
      setAreaModalVisible(false)
      setEditingArea(null)
      areaForm.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 保存年度考核
  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('保存年度考核数据:', values)
      return { success: true }
    },
    onSuccess: () => {
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/channel/supplier-assessment')
    },
    onError: () => {
      message.error('保存失败')
    },
  })

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (areaAssessments.length === 0) {
        message.error('请至少添加一个作业区评分')
        return
      }

      // 检查权重总和是否为1
      const totalWeight = areaAssessments.reduce((sum, area) => sum + area.weight, 0)
      if (Math.abs(totalWeight - 1) > 0.01) {
        message.error('作业区权重总和必须等于100%')
        return
      }

      const overallScore = calculateOverallScore(areaAssessments)
      
      const submitData = {
        ...values,
        overallScore,
        assessmentResult: overallScore >= 90 ? 'EXCELLENT' : 
                         overallScore >= 80 ? 'GOOD' : 
                         overallScore >= 70 ? 'QUALIFIED' : 'UNQUALIFIED',
        isQualified: overallScore >= 70,
        areaAssessments,
      }

      saveMutation.mutate(submitData)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const overallScore = calculateOverallScore(areaAssessments)

  return (
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
            {isEdit ? '编辑年度考核' : '新建年度考核'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/channel/supplier-assessment')}>
              取消
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={saveMutation.isPending}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            assessmentYear: getCurrentYear(),
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="assessmentYear"
                  label="考核年度"
                  rules={[{ required: true, message: '请选择考核年度' }]}
                >
                  <Select placeholder="请选择考核年度">
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i
                      return (
                        <Option key={year} value={year.toString()}>
                          {year}年
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="groupSupplierId"
                  label="供应商"
                  rules={[{ required: true, message: '请选择供应商' }]}
                >
                  <Select placeholder="请选择供应商">
                    {mockSuppliers.map(supplier => (
                      <Option key={supplier.id} value={supplier.id}>
                        {supplier.supplierCode} - {supplier.supplierName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>预计总分</div>
                  <Progress
                    type="circle"
                    size={80}
                    percent={overallScore}
                    format={() => `${overallScore}`}
                    strokeColor={
                      overallScore >= 90 ? '#52c41a' :
                      overallScore >= 80 ? '#1890ff' :
                      overallScore >= 70 ? '#fa8c16' : '#ff4d4f'
                    }
                  />
                </div>
              </Col>
            </Row>
          </Card>

          {/* 作业区评分 */}
          <Card 
            title="作业区评分" 
            size="small"
            style={{ marginBottom: 16 }}
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddArea}
              >
                添加作业区
              </Button>
            }
          >
            <Table
              columns={areaColumns}
              dataSource={areaAssessments}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 1000 }}
              summary={(pageData) => {
                const totalWeight = pageData.reduce((sum, record) => sum + record.weight, 0)
                const totalWeightedScore = pageData.reduce((sum, record) => sum + record.weightedScore, 0)
                
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={6}>
                      <strong>合计</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong style={{ color: totalWeight === 1 ? '#52c41a' : '#ff4d4f' }}>
                        {(totalWeight * 100).toFixed(0)}%
                      </strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                        {totalWeightedScore.toFixed(1)}分
                      </strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} />
                  </Table.Summary.Row>
                )
              }}
            />
          </Card>

          {/* 总部审核意见 */}
          <Card title="总部审核意见" size="small">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="finalRemarks"
                  label="审核意见"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请输入总部审核意见"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>

        {/* 作业区评分Modal */}
        <Modal
          title={editingArea ? '编辑作业区评分' : '添加作业区评分'}
          open={areaModalVisible}
          onOk={handleSaveArea}
          onCancel={() => {
            setAreaModalVisible(false)
            setEditingArea(null)
            areaForm.resetFields()
          }}
          width={600}
        >
          <Form form={areaForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="areaId"
                  label="作业区"
                  rules={[{ required: true, message: '请选择作业区' }]}
                >
                  <Select placeholder="请选择作业区">
                    {mockAreas.map(area => (
                      <Option key={area.id} value={area.id}>
                        {area.departmentName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="assessorId"
                  label="评分人"
                  rules={[{ required: true, message: '请选择评分人' }]}
                >
                  <Select placeholder="请选择评分人">
                    {mockAssessors.map(assessor => (
                      <Option key={assessor.id} value={assessor.id}>
                        {assessor.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="weight"
              label="权重"
              rules={[{ required: true, message: '请设置权重' }]}
            >
              <Slider
                min={0.1}
                max={1}
                step={0.1}
                marks={{
                  0.1: '10%',
                  0.3: '30%',
                  0.5: '50%',
                  0.7: '70%',
                  1: '100%'
                }}
                tooltip={{ formatter: (value) => `${(value! * 100).toFixed(0)}%` }}
              />
            </Form.Item>

            <Form.Item
              name="serviceQualityScore"
              label="服务质量评分"
              rules={[{ required: true, message: '请评分' }]}
            >
              <Slider
                min={0}
                max={100}
                marks={{
                  0: '0',
                  60: '60',
                  70: '70',
                  80: '80',
                  90: '90',
                  100: '100'
                }}
                tooltip={{ formatter: (value) => `${value}分` }}
              />
            </Form.Item>

            <Form.Item
              name="serviceAttitudeScore"
              label="服务态度评分"
              rules={[{ required: true, message: '请评分' }]}
            >
              <Slider
                min={0}
                max={100}
                marks={{
                  0: '0',
                  60: '60',
                  70: '70',
                  80: '80',
                  90: '90',
                  100: '100'
                }}
                tooltip={{ formatter: (value) => `${value}分` }}
              />
            </Form.Item>

            <Form.Item
              name="serviceTimelinessScore"
              label="服务时效评分"
              rules={[{ required: true, message: '请评分' }]}
            >
              <Slider
                min={0}
                max={100}
                marks={{
                  0: '0',
                  60: '60',
                  70: '70',
                  80: '80',
                  90: '90',
                  100: '100'
                }}
                tooltip={{ formatter: (value) => `${value}分` }}
              />
            </Form.Item>

            <Form.Item
              name="remarks"
              label="评分备注"
            >
              <TextArea 
                rows={3} 
                placeholder="请输入评分备注"
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export default SupplierAssessmentForm
