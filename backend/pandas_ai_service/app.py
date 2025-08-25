from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json
from datetime import datetime, timedelta
import numpy as np

import requests
import base64
from io import BytesIO
import traceback
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib.dates as mdates
import uuid
import re

# 导入 PandasAI
try:
    import pandasai as pai
    from pandasai_litellm import LiteLLM
    PANDASAI_AVAILABLE = True
    print("✅ PandasAI 已成功导入")
except ImportError as e:
    PANDASAI_AVAILABLE = False
    print(f"⚠️  PandasAI 导入失败: {e}")
    print("将使用内置分析功能")

app = Flask(__name__)
CORS(app)

# 配置 ChatFire API
CHATFIRE_API_KEY = "sk-reoHRL3C7a1VeXLgMYgbZ9p3aqUeuQUUKduSzBSrsmiO9DUS"
CHATFIRE_BASE_URL = "https://api.chatfire.cn/v1"

class DataAnalysisService:
    def __init__(self):
        self.sample_data = self.generate_sample_data()
        self.charts_dir = "charts"
        # 创建图表目录
        if not os.path.exists(self.charts_dir):
            os.makedirs(self.charts_dir)

        # 初始化 PandasAI
        self.setup_pandasai()
        print(f"📊 生成了 {len(self.sample_data)} 条模拟数据")

    def setup_pandasai(self):
        """设置 PandasAI"""
        if not PANDASAI_AVAILABLE:
            print("⚠️  PandasAI 不可用，使用内置分析功能")
            self.smart_df = None
            return

        try:
            # 设置 ChatFire API 环境变量
            os.environ["OPENAI_API_KEY"] = CHATFIRE_API_KEY
            os.environ["OPENAI_API_BASE"] = CHATFIRE_BASE_URL

            # 使用 LiteLLM 配置 ChatFire API
            llm = LiteLLM(
                model="gpt-3.5-turbo", 
                api_base=CHATFIRE_BASE_URL,
                api_key=CHATFIRE_API_KEY
            )

            # 配置 PandasAI 使用 ChatFire LLM - 启用 SQL 但使用内存数据库
            pai.config.set({
                "llm": llm,
                "verbose": True,
                "enforce_privacy": False,
                "enable_cache": False,  # 禁用缓存避免问题
                "save_charts": True,
                "data_viz_library": 'matplotlib',  # 使用 matplotlib 确保兼容性
                "open_charts": False,
                "save_charts_path": self.charts_dir,
                "use_error_correction_framework": True,  # 启用错误修正
                "max_retries": 3,  # 最大重试次数
                "custom_whitelisted_dependencies": ["pandas", "numpy", "matplotlib", "seaborn", "sqlite3"],  # 允许的依赖
                "enable_sql": True,  # 启用 SQL 执行
                "direct_sql": False,  # 禁用直接 SQL
                "response_parser": "PandasDataFrame",  # 强制使用 pandas 解析器
            })

            # 创建 PandasAI DataFrame
            self.smart_df = pai.DataFrame(self.sample_data)

            print("✅ PandasAI + ChatFire API 初始化成功")

        except Exception as e:
            print(f"❌ PandasAI 初始化失败: {e}")
            print(f"错误详情: {str(e)}")
            self.smart_df = None

    def process_pandasai_chart(self, chart_path: str):
        """处理 PandasAI 生成的图表文件"""
        try:
            if os.path.exists(chart_path):
                # 读取图片文件并转换为 base64
                with open(chart_path, 'rb') as f:
                    chart_data = f.read()
                    chart_base64 = base64.b64encode(chart_data).decode()

                return {
                    'type': 'pandasai_chart',
                    'data': chart_base64,
                    'title': 'PandasAI 智能图表',
                    'path': chart_path
                }
            else:
                print(f"⚠️  图表文件不存在: {chart_path}")
                return None

        except Exception as e:
            print(f"❌ 处理 PandasAI 图表失败: {e}")
            return None
    
    def generate_sample_data(self):
        """生成港口物资管理的模拟数据"""
        np.random.seed(42)

        # 生成日期范围
        start_date = datetime.now() - timedelta(days=90)
        dates = [start_date + timedelta(days=i) for i in range(90)]

        # 物资类型 - 使用英文避免编码问题
        materials = ['Crane', 'Forklift', 'Container', 'Steel', 'Cement', 'Parts', 'Safety', 'Tools']
        areas = ['Area_A', 'Area_B', 'Area_C', 'Equipment', 'Office']
        operations = ['In', 'Out', 'Transfer', 'Check', 'Repair']

        # 中文映射表（用于显示）
        self.material_map = {
            'Crane': '起重机', 'Forklift': '叉车', 'Container': '集装箱', 'Steel': '钢材',
            'Cement': '水泥', 'Parts': '机械配件', 'Safety': '安全设备', 'Tools': '维修工具'
        }
        self.area_map = {
            'Area_A': 'A区仓库', 'Area_B': 'B区仓库', 'Area_C': 'C区码头',
            'Equipment': '设备区', 'Office': '办公区'
        }
        self.operation_map = {
            'In': '入库', 'Out': '出库', 'Transfer': '调拨', 'Check': '盘点', 'Repair': '维修'
        }

        data = []
        for _ in range(500):  # 生成500条记录
            record = {
                'date': np.random.choice(dates).strftime('%Y-%m-%d'),
                'material': np.random.choice(materials),
                'area': np.random.choice(areas),
                'operation': np.random.choice(operations),
                'quantity': np.random.randint(1, 100),
                'unit_price': np.random.uniform(100, 10000),
                'operator': f'User_{np.random.randint(1, 20)}',
                'status': np.random.choice(['Normal', 'Warning', 'Error'], p=[0.7, 0.2, 0.1])
            }
            record['total_value'] = record['quantity'] * record['unit_price']
            data.append(record)

        df = pd.DataFrame(data)

        # 确保所有字符串列都是 UTF-8 编码
        for col in df.select_dtypes(include=['object']).columns:
            df[col] = df[col].astype(str)

        return df

    def execute_sql_query(self, sql_query: str):
        """执行 SQL 查询 - 使用内存数据库"""
        try:
            import sqlite3

            # 创建内存数据库
            conn = sqlite3.connect(':memory:')

            # 将 DataFrame 写入数据库
            # 获取表名（从 SQL 查询中提取）
            table_name = 'data_table'
            if 'FROM ' in sql_query.upper():
                # 尝试从 SQL 中提取表名
                import re
                match = re.search(r'FROM\s+(\w+)', sql_query, re.IGNORECASE)
                if match:
                    table_name = match.group(1)

            # 将数据写入 SQLite
            self.sample_data.to_sql(table_name, conn, index=False, if_exists='replace')

            # 执行查询
            result_df = pd.read_sql_query(sql_query, conn)

            # 关闭连接
            conn.close()

            print(f"✅ SQL 查询执行成功，返回 {len(result_df)} 行数据")
            return result_df

        except Exception as e:
            print(f"❌ SQL 查询执行失败: {e}")
            print(f"SQL: {sql_query}")

            # 备选方案：返回原始数据的一个子集
            return self.sample_data.head()



    def generate_pandas_code_with_chatfire(self, query: str):
        """直接使用 ChatFire API 生成 pandas 代码"""
        try:
            # 构建提示
            prompt = f"""
你是一个数据分析专家。请根据用户查询生成 pandas 代码来分析数据。

数据信息：
- DataFrame 名称：df
- 数据列：{', '.join(self.sample_data.columns.tolist())}
- 数据形状：{self.sample_data.shape}
- 数据预览：
{self.sample_data.head().to_string()}

用户查询：{query}

要求：
1. 只使用 pandas 操作，不要使用 SQL
2. 如果需要生成图表，使用 matplotlib 或 seaborn
3. 图表保存为 PNG 文件，文件名使用 'chart_{{uuid}}.png' 格式
4. 返回分析结果的文本描述
5. 代码应该是完整可执行的

请生成完整的 Python 代码：
"""

            # 调用 ChatFire API
            headers = {
                "Authorization": f"Bearer {CHATFIRE_API_KEY}",
                "Content-Type": "application/json"
            }

            data = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1,
                "max_tokens": 2000
            }

            response = requests.post(
                f"{CHATFIRE_BASE_URL}/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                code = result['choices'][0]['message']['content']

                # 提取代码块
                code_match = re.search(r'```python\n(.*?)\n```', code, re.DOTALL)
                if code_match:
                    return code_match.group(1)
                else:
                    # 如果没有代码块标记，返回整个内容
                    return code
            else:
                print(f"ChatFire API 调用失败: {response.status_code}")
                return None

        except Exception as e:
            print(f"ChatFire API 调用异常: {e}")
            return None

    def execute_pandas_code(self, code: str):
        """执行生成的 pandas 代码"""
        try:
            # 准备执行环境
            exec_globals = {
                'pd': pd,
                'np': np,
                'plt': plt,
                'sns': sns,
                'df': self.sample_data.copy(),
                'uuid': uuid,
                'os': os
            }

            exec_locals = {}

            # 执行代码
            exec(code, exec_globals, exec_locals)

            # 查找结果
            result_text = "分析完成"
            chart_path = None

            # 查找生成的图表文件
            for filename in os.listdir('.'):
                if filename.startswith('chart_') and filename.endswith('.png'):
                    chart_path = filename
                    break

            # 查找结果变量
            if 'result' in exec_locals:
                result_text = str(exec_locals['result'])
            elif 'analysis_result' in exec_locals:
                result_text = str(exec_locals['analysis_result'])

            return {
                'text': result_text,
                'chart_path': chart_path
            }

        except Exception as e:
            print(f"代码执行失败: {e}")
            return None

    def process_chart_file(self, chart_path: str):
        """处理图表文件"""
        try:
            if os.path.exists(chart_path):
                with open(chart_path, 'rb') as f:
                    chart_data = f.read()

                # 转换为 base64
                chart_base64 = base64.b64encode(chart_data).decode('utf-8')

                # 删除临时文件
                os.remove(chart_path)

                return {
                    'format': 'png',
                    'image': f'data:image/png;base64,{chart_base64}',
                    'title': '数据分析图表',
                    'type': 'chart'
                }
            return None
        except Exception as e:
            print(f"图表处理失败: {e}")
            return None

    def analyze_query(self, query: str):
        """使用 PandasAI + ChatFire 进行智能分析"""
        try:
            print(f"🔍 分析查询: {query}")

            # 检查是否需要生成图表
            chart_info = self.detect_chart_request(query)

            result_data = {
                'success': True,
                'query': query,
                'data_summary': {
                    'total_records': len(self.sample_data),
                    'date_range': f"{self.sample_data['date'].min()} 到 {self.sample_data['date'].max()}",
                    'materials_count': self.sample_data['material'].nunique(),
                    'areas_count': self.sample_data['area'].nunique()
                }
            }

            # 尝试使用 ChatFire API 直接生成 pandas 代码
            try:
                print("🤖 使用 ChatFire API 直接生成 pandas 代码...")

                # 直接调用 ChatFire API 生成代码
                pandas_code_result = self.generate_pandas_code_with_chatfire(query)

                if pandas_code_result:
                    print("✅ ChatFire API 生成代码成功，正在执行...")

                    # 执行生成的代码
                    execution_result = self.execute_pandas_code(pandas_code_result)

                    if execution_result:
                        result_data['result'] = f"🤖 ** AI 智能分析**\n\n{execution_result['text']}"
                        result_data['analysis_type'] = 'Pandas AI分析'

                        if execution_result.get('chart_path'):
                            chart = self.process_chart_file(execution_result['chart_path'])
                            if chart:
                                result_data['chart_data'] = chart  # 修正键名为 chart_data
                                result_data['has_chart'] = True
                                print(f"✅ 图表数据已设置: {chart.get('format', 'unknown')}")
                            else:
                                result_data['has_chart'] = False
                                print("❌ 图表处理失败")
                        else:
                            result_data['has_chart'] = False
                            print("❌ 没有生成图表文件")

                        return result_data

            except Exception as e:
                print(f"⚠️  ChatFire API 直接调用失败: {e}")
                print(f"错误详情: {traceback.format_exc()}")

            # 备选方案：使用 PandasAI（如果可用）
            if self.smart_df is not None:
                try:
                    print("🤖 备选方案：使用 PandasAI 进行分析...")

                    # 使用 DataFrame 的 chat 方法
                    pandasai_result = self.smart_df.chat(query)

                    if pandasai_result is not None:
                        # 处理 PandasAI 返回的结果
                        if isinstance(pandasai_result, str) and any(pandasai_result.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.svg']):
                            # PandasAI 生成了图表文件
                            chart = self.process_pandasai_chart(pandasai_result)
                            result_data['result'] = f"✅ **PandasAI 智能分析完成**\n\n📊 **查询**: {query}\n\n🎯 **结果**: 已生成数据可视化图表，展示了您请求的分析结果。"
                            result_data['chart_data'] = chart  # 修正键名为 chart_data
                            result_data['has_chart'] = True
                            result_data['analysis_type'] = 'PandasAI图表分析'
                        else:
                            # PandasAI 返回文本结果
                            result_data['result'] = f"🤖 **PandasAI 智能分析**\n\n{str(pandasai_result)}"
                            result_data['analysis_type'] = 'PandasAI智能分析'

                            # 如果用户明确请求图表，使用内置图表功能
                            if chart_info['needs_chart']:
                                chart_result = self.generate_chart(chart_info)
                                if chart_result:
                                    result_data['chart_data'] = chart_result  # 修正键名为 chart_data
                                    result_data['has_chart'] = True
                                else:
                                    result_data['has_chart'] = False
                            else:
                                result_data['has_chart'] = False

                        # 添加 PandasAI 标识
                        result_data['data_summary']['powered_by'] = 'PandasAI + ChatFire'
                        return result_data

                except Exception as e:
                    print(f"⚠️  PandasAI 分析失败: {e}")
                    print(f"错误类型: {type(e).__name__}")
                    print(f"错误详情: {str(e)}")
                    # 继续使用备选方案
                    pass

            # 备选方案：使用 ChatFire API 分析
            ai_result = self.perform_ai_analysis(query)
            if ai_result:
                result_data['result'] = ai_result
                result_data['analysis_type'] = 'ChatFire AI分析'
            else:
                # 最后备选：基础分析
                basic_result = self.perform_basic_analysis(query)
                result_data['result'] = basic_result
                result_data['analysis_type'] = '基础数据分析'

            # 如果检测到图表请求，生成图表
            if chart_info['needs_chart']:
                chart_result = self.generate_chart(chart_info)
                if chart_result:
                    result_data['chart_data'] = chart_result  # 修正键名
                    result_data['has_chart'] = True
                else:
                    result_data['has_chart'] = False
            else:
                result_data['has_chart'] = False

            return result_data

        except Exception as e:
            print(f"❌ 分析失败: {e}")
            return {
                'success': False,
                'error': str(e),
                'query': query
            }

    def perform_basic_analysis(self, query: str):
        """执行基础数据分析"""
        df = self.sample_data

        # 区域统计
        if '区域' in query or '统计' in query:
            if '物资' in query or '数量' in query:
                result = df.groupby('area')['quantity'].sum().to_dict()
                return f"各区域物资数量统计：\n" + "\n".join([f"- {area}: {qty} 件" for area, qty in result.items()])

        # 物资类型分析
        if '物资' in query and ('类型' in query or '分布' in query):
            result = df['material'].value_counts().to_dict()
            return f"物资类型分布：\n" + "\n".join([f"- {material}: {count} 次记录" for material, count in result.items()])

        # 异常分析
        if '异常' in query:
            abnormal_data = df[df['status'] == '异常']
            if len(abnormal_data) > 0:
                by_area = abnormal_data['area'].value_counts().to_dict()
                return f"异常记录分析（共 {len(abnormal_data)} 条）：\n" + "\n".join([f"- {area}: {count} 条异常" for area, count in by_area.items()])
            else:
                return "未发现异常记录"

        # 价值分析
        if '价值' in query or '总价' in query:
            total_value = df['total_value'].sum()
            by_material = df.groupby('material')['total_value'].sum().sort_values(ascending=False)
            result = f"总价值分析：\n- 总价值: ¥{total_value:,.2f}\n\n各物资价值排名：\n"
            result += "\n".join([f"- {material}: ¥{value:,.2f}" for material, value in by_material.head(5).items()])
            return result

        # 趋势分析
        if '趋势' in query:
            df['date'] = pd.to_datetime(df['date'])
            daily_ops = df.groupby('date').size().tail(7)
            result = "最近7天操作趋势：\n"
            result += "\n".join([f"- {date.strftime('%Y-%m-%d')}: {count} 次操作" for date, count in daily_ops.items()])
            return result

        # 默认返回基础统计
        return f"数据概览：\n- 总记录数: {len(df)}\n- 物资种类: {df['material'].nunique()}\n- 区域数量: {df['area'].nunique()}\n- 异常记录: {len(df[df['status'] == '异常'])}"

    def perform_ai_analysis(self, query: str):
        """使用 ChatFire API 进行智能分析"""
        try:
            # 准备数据摘要给 AI
            data_summary = self.get_data_summary_for_ai()

            # 构建 AI 提示
            prompt = f"""你是一个港口物资管理数据分析专家。请根据用户查询和数据摘要，提供专业的分析结果。

用户查询: {query}

数据摘要:
{data_summary}

请提供详细的分析结果，包括：
1. 直接回答用户的问题
2. 相关的数据洞察
3. 实用的建议

请用中文回答，格式清晰易读。"""

            # 调用 ChatFire API
            response = requests.post(
                f"{CHATFIRE_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {CHATFIRE_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "你是一个专业的港口物资管理数据分析师，擅长从数据中提取有价值的洞察。"},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1000
                },
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
                return ai_response
            else:
                print(f"AI API 调用失败: {response.status_code}")
                return None

        except Exception as e:
            print(f"AI 分析错误: {e}")
            return None

    def get_data_summary_for_ai(self):
        """为 AI 准备数据摘要"""
        df = self.sample_data

        summary = f"""
数据基本信息:
- 总记录数: {len(df)}
- 时间范围: {df['date'].min()} 到 {df['date'].max()}
- 区域数量: {df['area'].nunique()}
- 物资种类: {df['material'].nunique()}

各区域物资数量:
{df.groupby('area')['quantity'].sum().to_string()}

物资类型分布:
{df['material'].value_counts().head(5).to_string()}

状态分布:
{df['status'].value_counts().to_string()}

总价值: ¥{df['total_value'].sum():,.2f}

最近7天操作趋势:
{df.groupby('date').size().tail(7).to_string()}
"""
        return summary

    def detect_chart_request(self, query: str):
        """检测查询是否需要生成图表"""
        chart_keywords = {
            '图表': 'bar',
            '柱状图': 'bar',
            '条形图': 'bar',
            '饼图': 'pie',
            '折线图': 'line',
            '趋势图': 'line',
            '散点图': 'scatter',
            '分布图': 'hist',
            '可视化': 'bar',
            'chart': 'bar',
            'plot': 'bar',
            'graph': 'bar'
        }

        query_lower = query.lower()

        for keyword, chart_type in chart_keywords.items():
            if keyword in query_lower:
                return {
                    'needs_chart': True,
                    'chart_type': chart_type,
                    'keyword': keyword
                }

        # 检查是否包含统计类关键词，自动生成图表
        auto_chart_keywords = ['统计', '分布', '对比', '排行', '排名', '占比']
        for keyword in auto_chart_keywords:
            if keyword in query:
                return {
                    'needs_chart': True,
                    'chart_type': 'bar',
                    'keyword': keyword,
                    'auto_generated': True
                }

        return {'needs_chart': False}

    def generate_chart(self, chart_info):
        """生成真正的图表"""
        try:
            import matplotlib
            matplotlib.use('Agg')  # 使用非交互式后端
            import matplotlib.pyplot as plt
            import seaborn as sns

            # 设置中文字体和样式
            try:
                # 尝试设置中文字体
                plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS', 'DejaVu Sans', 'sans-serif']
                plt.rcParams['axes.unicode_minus'] = False

                # 如果没有中文字体，使用英文标题
                import matplotlib.font_manager as fm
                available_fonts = [f.name for f in fm.fontManager.ttflist]
                has_chinese_font = any(font in available_fonts for font in ['SimHei', 'Microsoft YaHei', 'Arial Unicode MS'])

                if not has_chinese_font:
                    print("⚠️  未找到中文字体，将使用英文标题")

            except Exception as e:
                print(f"⚠️  字体配置失败: {e}")
                plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'sans-serif']
                plt.rcParams['axes.unicode_minus'] = False
            sns.set_style("whitegrid")
            sns.set_palette("husl")

            chart_type = chart_info.get('chart_type', 'bar')
            df = self.sample_data

            # 创建图表
            fig, ax = plt.subplots(figsize=(10, 6))

            if chart_type == 'bar':
                # 各区域物资数量柱状图
                area_data = df.groupby('area')['quantity'].sum().sort_values(ascending=False)
                bars = sns.barplot(x=area_data.index, y=area_data.values, ax=ax, palette="viridis")

                # 使用中英文标题
                try:
                    ax.set_title('各区域物资数量统计', fontsize=18, fontweight='bold', pad=20)
                    ax.set_xlabel('区域', fontsize=14)
                    ax.set_ylabel('物资数量', fontsize=14)
                except:
                    ax.set_title('Material Quantity by Area', fontsize=18, fontweight='bold', pad=20)
                    ax.set_xlabel('Area', fontsize=14)
                    ax.set_ylabel('Quantity', fontsize=14)

                # 添加数值标签
                for i, bar in enumerate(bars.patches):
                    height = bar.get_height()
                    ax.text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                           f'{int(height):,}', ha='center', va='bottom', fontsize=12, fontweight='bold')

            elif chart_type == 'pie':
                # 物资类型分布饼图
                material_data = df['material'].value_counts().head(8)
                colors = sns.color_palette("Set3", len(material_data))
                wedges, texts, autotexts = ax.pie(material_data.values,
                                                 labels=material_data.index,
                                                 autopct='%1.1f%%',
                                                 colors=colors,
                                                 startangle=90,
                                                 explode=[0.05]*len(material_data))
                ax.set_title('物资类型分布', fontsize=18, fontweight='bold', pad=20)

                # 美化文字
                for autotext in autotexts:
                    autotext.set_color('white')
                    autotext.set_fontweight('bold')
                    autotext.set_fontsize(10)

            elif chart_type == 'line':
                # 每日操作趋势折线图
                df_copy = df.copy()
                df_copy['date'] = pd.to_datetime(df_copy['date'])
                daily_ops = df_copy.groupby('date').size().sort_index()

                sns.lineplot(x=daily_ops.index, y=daily_ops.values, ax=ax,
                           marker='o', linewidth=3, markersize=8)
                ax.set_title('每日操作趋势', fontsize=18, fontweight='bold', pad=20)
                ax.set_xlabel('日期', fontsize=14)
                ax.set_ylabel('操作次数', fontsize=14)

                # 格式化日期显示
                import matplotlib.dates as mdates
                ax.xaxis.set_major_formatter(mdates.DateFormatter('%m-%d'))
                plt.xticks(rotation=45)

                # 添加趋势线
                try:
                    from scipy import stats
                    x_numeric = mdates.date2num(daily_ops.index)
                    slope, intercept, r_value, p_value, std_err = stats.linregress(x_numeric, daily_ops.values)
                    line = slope * x_numeric + intercept
                    ax.plot(daily_ops.index, line, 'r--', alpha=0.8, linewidth=2,
                           label=f'趋势线 (R²={r_value**2:.3f})')
                    ax.legend()
                except ImportError:
                    pass  # 如果没有 scipy，跳过趋势线

            elif chart_type == 'hist':
                # 物资价值分布直方图
                sns.histplot(data=df, x='total_value', bins=25, kde=True, ax=ax, alpha=0.7)
                ax.set_title('物资价值分布', fontsize=18, fontweight='bold', pad=20)
                ax.set_xlabel('价值 (元)', fontsize=14)
                ax.set_ylabel('频次', fontsize=14)

                # 添加统计信息
                mean_val = df['total_value'].mean()
                median_val = df['total_value'].median()
                ax.axvline(mean_val, color='red', linestyle='--', alpha=0.8,
                          label=f'平均值: ¥{mean_val:,.0f}')
                ax.axvline(median_val, color='orange', linestyle='--', alpha=0.8,
                          label=f'中位数: ¥{median_val:,.0f}')
                ax.legend()

            # 统一美化
            plt.tight_layout()
            ax.grid(True, alpha=0.3)

            # 保存图表为 base64
            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight',
                       facecolor='white', edgecolor='none')
            buffer.seek(0)

            # 转换为 base64
            chart_base64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close(fig)  # 关闭图形以释放内存

            return {
                'format': 'png',
                'image': f'data:image/png;base64,{chart_base64}',  # 前端期望的格式
                'title': self.get_chart_title(chart_type),
                'type': chart_type
            }

        except Exception as e:
            print(f"图表生成失败: {e}")
            # 如果图表生成失败，返回文本图表作为备选
            return self.generate_text_chart(chart_info)

    def get_chart_title(self, chart_type):
        """获取图表标题"""
        titles = {
            'bar': '各区域物资数量统计',
            'pie': '物资类型分布',
            'line': '每日操作趋势',
            'hist': '物资价值分布'
        }
        return titles.get(chart_type, '数据图表')
    


# 创建服务实例
analysis_service = DataAnalysisService()

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({'status': 'healthy', 'service': 'PandasAI Analysis Service'})

@app.route('/api/data/analyze', methods=['POST'])
def analyze_data():
    """数据分析接口"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': '查询不能为空'}), 400
        
        # 执行分析
        result = analysis_service.analyze_query(query)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': f'服务器错误: {str(e)}'}), 500

@app.route('/api/data/sample', methods=['GET'])
def get_sample_data():
    """获取样本数据概览"""
    try:
        df = analysis_service.sample_data
        
        # 基本统计信息
        summary = {
            'total_records': len(df),
            'date_range': {
                'start': df['date'].min(),
                'end': df['date'].max()
            },
            'materials': df['material'].value_counts().to_dict(),
            'areas': df['area'].value_counts().to_dict(),
            'operations': df['operation'].value_counts().to_dict(),
            'status_distribution': df['status'].value_counts().to_dict(),
            'total_value': df['total_value'].sum(),
            'avg_quantity': df['quantity'].mean()
        }
        
        return jsonify({
            'success': True,
            'summary': summary,
            'sample_records': df.head(10).to_dict('records')
        })
    
    except Exception as e:
        return jsonify({'error': f'获取数据失败: {str(e)}'}), 500

@app.route('/api/data/quick-insights', methods=['GET'])
def get_quick_insights():
    """获取快速洞察"""
    try:
        df = analysis_service.sample_data
        
        insights = []
        
        # 最活跃的区域
        top_area = df['area'].value_counts().index[0]
        insights.append(f"📍 最活跃区域: {top_area}")
        
        # 最常用物资
        top_material = df['material'].value_counts().index[0]
        insights.append(f"📦 最常用物资: {top_material}")
        
        # 异常状态统计
        abnormal_count = len(df[df['status'] == '异常'])
        insights.append(f"⚠️ 异常记录: {abnormal_count} 条")
        
        # 总价值
        total_value = df['total_value'].sum()
        insights.append(f"💰 总价值: ¥{total_value:,.2f}")
        
        return jsonify({
            'success': True,
            'insights': insights
        })
    
    except Exception as e:
        return jsonify({'error': f'获取洞察失败: {str(e)}'}), 500

if __name__ == '__main__':
    print("启动 PandasAI 数据分析服务...")
    print("访问 http://localhost:5000/health 检查服务状态")
    app.run(debug=True, host='0.0.0.0', port=5000)
