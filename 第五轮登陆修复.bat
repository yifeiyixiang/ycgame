@echo off
chcp 65001 >nul

:: 获取年月日（兼容多种日期格式）
for /f "tokens=1-3 delims=/-." %%a in ("%date%") do (
    set "y=%%a"
    set "m=%%b"
    set "d=%%c"
)

:: 获取时分秒，补零处理
set "hh=%time:~0,2%"
set "mm=%time:~3,2%"
set "ss=%time:~6,2%"

:: 去除小时前的空格（如果存在）
set "hh=%hh: =0%"

:: 组合时间戳：2025-02-26 22:53:45
set "datetime=%y%-%m%-%d% %hh%:%mm%:%ss%"

:: 获取当前批处理脚本的文件名（不含路径和扩展名）
set "batname=%~n0"

git add .
git commit -m "%batname% %datetime%"