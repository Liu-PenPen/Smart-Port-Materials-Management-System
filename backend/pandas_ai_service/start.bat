@echo off
echo 启动 PandasAI 数据分析服务...

REM 检查是否存在虚拟环境
if not exist "venv" (
    echo 创建虚拟环境...
    python -m venv venv
)

REM 激活虚拟环境
call venv\Scripts\activate

REM 安装依赖
echo 安装依赖包...
pip install -r requirements.txt

REM 启动服务
echo 启动服务...
python app.py

pause
