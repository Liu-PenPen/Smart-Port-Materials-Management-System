import React, { useState } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  message,
  Row,
  Col,
  InputNumber,
  Upload,
  Image
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  UploadOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { GROUP_SUPPLIER_STATUS_CONFIG } from '@/constants'
import type { GroupSupplier, User } from '@/types'

const { TextArea } = Input
const { Option } = Select

const GroupSupplierForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [licenseFileList, setLicenseFileList] = useState<any[]>([])

  // 获取集采供应商详情（编辑时）
  const { data: groupSupplier, isLoading } = useQuery({
    queryKey: ['group-supplier-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取集采供应商数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: GroupSupplier = {
        id: Number(id),
        supplierCode: 'GS001',
        supplierName: '中远海运港口设备有限公司',
        socialCreditCode: '91110000123456789A',
        companyAddress: '北京市朝阳区建国门外大街1号',
        contactPerson: '张经理',
        contactPhone: '010-12345678',
        contactEmail: 'zhang@cosco.com',
        businessLicense: 'BL202501001',
        licenseExpiryDate: '2026-12-31',
        registeredCapital: 50000000,
        businessScope: '港口设备制造、销售、维修',
        status: 'ACTIVE',
        isUsed: true,
        managedBy: 1,
        supplyCatalog: [],
        remarks: '集团重要合作伙伴',
        createdBy: 1,
        createdTime: '2025-01-01T10:00:00',
        version: 1
      }
      
      return mockData
    },
    enabled: isEdit,
  })

  // 模拟管理人员数据
  const mockManagers: User[] = [
    { id: 1, name: '李部长', username: 'li', phone: '010-87654321' } as User,
    { id: 2, name: '王主任', username: 'wang', phone: '010-87654322' } as User,
    { id: 3, name: '张经理', username: 'zhang', phone: '010-87654323' } as User,
  ]

  // 初始化表单数据
  React.useEffect(() => {
    if (groupSupplier) {
      form.setFieldsValue({
        supplierCode: groupSupplier.supplierCode,
        supplierName: groupSupplier.supplierName,
        socialCreditCode: groupSupplier.socialCreditCode,
        companyAddress: groupSupplier.companyAddress,
        contactPerson: groupSupplier.contactPerson,
        contactPhone: groupSupplier.contactPhone,
        contactEmail: groupSupplier.contactEmail,
        businessLicense: groupSupplier.businessLicense,
        licenseExpiryDate: groupSupplier.licenseExpiryDate ? dayjs(groupSupplier.licenseExpiryDate) : null,
        registeredCapital: groupSupplier.registeredCapital,
        businessScope: groupSupplier.businessScope,
        status: groupSupplier.status,
        managedBy: groupSupplier.managedBy,
        remarks: groupSupplier.remarks,
      })
    } else {
      // 新建时的默认值
      form.setFieldsValue({
        status: 'ACTIVE',
        managedBy: 1, // 默认集团设备部
      })
    }
  }, [groupSupplier, form])

  // 保存供应商
  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('保存供应商数据:', values)
      return { success: true }
    },
    onSuccess: () => {
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/channel/group-supplier')
    },
    onError: () => {
      message.error('保存失败')
    },
  })

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      const submitData = {
        ...values,
        licenseExpiryDate: values.licenseExpiryDate?.format('YYYY-MM-DD'),
      }

      saveMutation.mutate(submitData)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 处理营业执照上传
  const handleLicenseUpload = (info: any) => {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1) // 只保留最新的一个文件
    setLicenseFileList(fileList)
  }

  // 验证社会信用编码格式
  const validateSocialCreditCode = (_: any, value: string) => {
    if (!value) return Promise.resolve()
    
    // 社会信用编码格式验证（18位）
    const regex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
    if (!regex.test(value)) {
      return Promise.reject(new Error('请输入正确的社会信用编码格式'))
    }
    return Promise.resolve()
  }

  // 验证手机号格式
  const validatePhone = (_: any, value: string) => {
    if (!value) return Promise.resolve()
    
    const regex = /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/
    if (!regex.test(value)) {
      return Promise.reject(new Error('请输入正确的电话号码'))
    }
    return Promise.resolve()
  }

  return (
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
            {isEdit ? '编辑集采供应商' : '新建集采供应商'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/channel/group-supplier')}>
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
            status: 'ACTIVE',
            managedBy: 1,
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="supplierCode"
                  label="供应商编号"
                  rules={[
                    { required: true, message: '请输入供应商编号' },
                    { pattern: /^GS\d{3,}$/, message: '编号格式：GS + 数字' }
                  ]}
                >
                  <Input placeholder="如：GS001" disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="supplierName"
                  label="供应商名称"
                  rules={[
                    { required: true, message: '请输入供应商名称' },
                    { max: 100, message: '名称不能超过100个字符' }
                  ]}
                >
                  <Input placeholder="请输入供应商名称" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="socialCreditCode"
                  label="社会信用编码"
                  rules={[
                    { required: true, message: '请输入社会信用编码' },
                    { validator: validateSocialCreditCode }
                  ]}
                >
                  <Input placeholder="18位社会信用编码" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="businessLicense"
                  label="营业执照号"
                  rules={[{ required: true, message: '请输入营业执照号' }]}
                >
                  <Input placeholder="请输入营业执照号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="licenseExpiryDate"
                  label="执照到期日期"
                  rules={[{ required: true, message: '请选择执照到期日期' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => current && current < dayjs().endOf('day')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="registeredCapital"
                  label="注册资本（元）"
                  rules={[{ required: true, message: '请输入注册资本' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    placeholder="请输入注册资本"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select>
                    {Object.entries(GROUP_SUPPLIER_STATUS_CONFIG).map(([key, config]) => (
                      <Option key={key} value={key}>
                        {config.text}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="managedBy"
                  label="管理部门"
                  rules={[{ required: true, message: '请选择管理部门' }]}
                >
                  <Select placeholder="请选择管理部门">
                    {mockManagers.map(manager => (
                      <Option key={manager.id} value={manager.id}>
                        {manager.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="licenseFile"
                  label="营业执照扫描件"
                >
                  <Upload
                    listType="picture-card"
                    fileList={licenseFileList}
                    onChange={handleLicenseUpload}
                    beforeUpload={() => false}
                    accept="image/*,.pdf"
                  >
                    {licenseFileList.length < 1 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="companyAddress"
                  label="公司地址"
                  rules={[
                    { required: true, message: '请输入公司地址' },
                    { max: 200, message: '地址不能超过200个字符' }
                  ]}
                >
                  <Input placeholder="请输入详细的公司地址" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="businessScope"
                  label="经营范围"
                  rules={[
                    { required: true, message: '请输入经营范围' },
                    { max: 500, message: '经营范围不能超过500个字符' }
                  ]}
                >
                  <TextArea 
                    rows={3} 
                    placeholder="请输入经营范围"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 联系信息 */}
          <Card title="联系信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="contactPerson"
                  label="联系人"
                  rules={[
                    { required: true, message: '请输入联系人' },
                    { max: 50, message: '联系人姓名不能超过50个字符' }
                  ]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { validator: validatePhone }
                  ]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="contactEmail"
                  label="邮箱"
                  rules={[
                    { type: 'email', message: '请输入正确的邮箱格式' },
                    { max: 100, message: '邮箱不能超过100个字符' }
                  ]}
                >
                  <Input placeholder="请输入邮箱地址" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 备注信息 */}
          <Card title="备注信息" size="small">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="remarks"
                  label="备注"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请输入备注信息"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Card>
    </div>
  )
}

export default GroupSupplierForm
