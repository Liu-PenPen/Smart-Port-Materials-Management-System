@echo off
echo 🚀 启动智慧港航物资管理系统
echo ==========================================

echo.
echo 📊 启动 PandasAI 数据分析服务...
start "PandasAI Service" cmd /k "cd backend\pandas_ai_service && python app.py"

echo.
echo ⏳ 等待后端服务启动...
timeout /t 5 /nobreak > nul

echo.
echo 🌐 启动前端应用...
start "Frontend App" cmd /k "npm run dev"

echo.
echo ✅ 系统启动完成！
echo.
echo 📋 服务信息:
echo - 前端应用: http://localhost:3000
echo - 数据分析服务: http://localhost:5000
echo - AI 聊天功能: 集成 ChatFire API
echo.
echo 🎯 功能特性:
echo - 🤖 AI 智能分析和建议
echo - 🔍 智能巡检功能
echo - 📊 数据统计和趋势分析
echo - 💬 自然语言查询
echo.
echo 按任意键关闭此窗口...
pause > nul
