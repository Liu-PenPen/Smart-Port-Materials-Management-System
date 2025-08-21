import React from 'react'
import { Form, Input, Select, Button, Card, Row, Col, message, Space } from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import { supplierService } from '@/services/supplierService'
import { FORM_RULES } from '@/constants'
import type { Supplier } from '@/types'

const SupplierForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()

  // 获取供应商详情
  const { data: supplier, isLoading } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => supplierService.getSupplier(Number(id)),
    enabled: isEdit,
  })

  // 创建供应商
  const createMutation = useMutation({
    mutationFn: supplierService.createSupplier,
    onSuccess: () => {
      message.success('创建成功')
      navigate('/supplier')
    },
    onError: () => {
      message.error('创建失败')
    },
  })

  // 更新供应商
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Supplier> }) =>
      supplierService.updateSupplier(id, data),
    onSuccess: () => {
      message.success('更新成功')
      navigate('/supplier')
    },
    onError: () => {
      message.error('更新失败')
    },
  })

  // 检查供应商编码
  const checkCodeMutation = useMutation({
    mutationFn: ({ code, excludeId }: { code: string; excludeId?: number }) =>
      supplierService.checkSupplierCode(code, excludeId),
  })

  // 表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: Number(id),
          data: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  // 供应商编码验证
  const validateSupplierCode = async (_: any, value: string) => {
    if (!value) return Promise.resolve()
    
    try {
      const response = await checkCodeMutation.mutateAsync({
        code: value,
        excludeId: isEdit ? Number(id) : undefined,
      })
      
      if (response.data) {
        return Promise.reject(new Error('供应商编码已存在'))
      }
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(new Error('编码验证失败'))
    }
  }

  // 初始化表单数据
  React.useEffect(() => {
    if (supplier?.data) {
      form.setFieldsValue(supplier.data)
    }
  }, [supplier, form])

  return (
    <div className="page-container">
      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/supplier')}
            >
              返回
            </Button>
            {isEdit ? '编辑供应商' : '新建供应商'}
          </Space>
        }
        loading={isLoading}
      >
        <ProForm
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleSubmit}
          submitter={{
            render: (_, dom) => (
              <Row>
                <Col span={18} offset={6}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={createMutation.isPending || updateMutation.isPending}
                      htmlType="submit"
                    >
                      保存
                    </Button>
                    <Button onClick={() => navigate('/supplier')}>
                      取消
                    </Button>
                  </Space>
                </Col>
              </Row>
            ),
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <ProFormText
                name="supplierCode"
                label="供应商编码"
                placeholder="请输入供应商编码"
                rules={[
                  FORM_RULES.REQUIRED,
                  { validator: validateSupplierCode },
                ]}
                fieldProps={{
                  maxLength: 50,
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="supplierName"
                label="供应商名称"
                placeholder="请输入供应商名称"
                rules={[FORM_RULES.REQUIRED]}
                fieldProps={{
                  maxLength: 200,
                }}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <ProFormText
                name="socialCreditCode"
                label="统一社会信用代码"
                placeholder="请输入统一社会信用代码"
                rules={[FORM_RULES.SOCIAL_CREDIT_CODE]}
                fieldProps={{
                  maxLength: 50,
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="status"
                label="状态"
                options={[
                  { label: '启用', value: 'ACTIVE' },
                  { label: '停用', value: 'INACTIVE' },
                ]}
                rules={[FORM_RULES.REQUIRED]}
                initialValue="ACTIVE"
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <ProFormText
                name="contactPerson"
                label="联系人"
                placeholder="请输入联系人"
                fieldProps={{
                  maxLength: 100,
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="contactPhone"
                label="联系电话"
                placeholder="请输入联系电话"
                rules={[FORM_RULES.PHONE]}
                fieldProps={{
                  maxLength: 50,
                }}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <ProFormTextArea
                name="companyAddress"
                label="公司地址"
                placeholder="请输入公司地址"
                fieldProps={{
                  maxLength: 500,
                  rows: 3,
                }}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <ProFormTextArea
                name="supplyContent"
                label="供应内容"
                placeholder="请输入供应内容清单"
                fieldProps={{
                  maxLength: 1000,
                  rows: 4,
                }}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <ProFormTextArea
                name="businessLicense"
                label="营业执照"
                placeholder="营业执照附件信息"
                fieldProps={{
                  maxLength: 500,
                  rows: 2,
                }}
              />
            </Col>
          </Row>
        </ProForm>
      </Card>
    </div>
  )
}

export default SupplierForm
