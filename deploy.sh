#!/bin/bash

echo "====================================="
echo "    NTUT Exam System - 自動部署腳本"
echo "====================================="
echo ""

# 1. 取得使用者輸入
echo "--- [1/5] 環境變數設定 ---"
read -p "請輸入後端 API Port (預設: 3000): " APP_PORT
APP_PORT=${APP_PORT:-3000}

read -p "請輸入前端網站 Port (預設: 5173): " FRONTEND_PORT
FRONTEND_PORT=${FRONTEND_PORT:-5173}

read -p "請輸入 Piston 執行環境 Port (預設: 2000): " PISTON_PORT
PISTON_PORT=${PISTON_PORT:-2000}

read -p "請設定 Admin Secret (直接 Enter 將自動產生 32 字元隨機密碼): " ADMIN_SECRET
if [ -z "$ADMIN_SECRET" ]; then
  # 支援 macOS 與 Linux 的隨機產生方式
  if command -v openssl >/dev/null 2>&1; then
    ADMIN_SECRET=$(openssl rand -hex 16)
  else
    ADMIN_SECRET=$(LC_ALL=C tr -dc 'a-zA-Z0-9' < /dev/urandom | head -c 32)
  fi
  echo "=> 已自動產生 Admin Secret: $ADMIN_SECRET"
fi
echo ""

# 2. 建立 .env 檔案
echo "--- [2/5] 寫入 .env 設定檔 ---"
echo "=> 正在設定後端 (backend/.env)..."
cat > backend/.env <<EOF
PORT=$APP_PORT
PISTON_URL=http://localhost:$PISTON_PORT
ADMIN_SECRET=$ADMIN_SECRET
EOF

echo "=> 正在設定前端 (frontend/.env)..."
cat > frontend/.env <<EOF
VITE_API_URL=http://localhost:$APP_PORT
EOF
echo ""

# 3. 安裝相依套件
echo "--- [3/5] 安裝系統相依套件 ---"
# 自動偵測是否使用 pnpm 或 npm
PACKAGE_MANAGER="npm"
if command -v pnpm >/dev/null 2>&1; then
    PACKAGE_MANAGER="pnpm"
fi

echo "=> 使用 $PACKAGE_MANAGER 安裝套件..."
$PACKAGE_MANAGER install
echo ""

# 4. 防火牆設定
echo "--- [4/5] 網路防護牆設定 ---"
read -p "是否要自動設定防火牆以允許存取這些 Port? (y/N): " ALLOW_FIREWALL
if [[ "$ALLOW_FIREWALL" =~ ^[Yy]$ ]]; then
    OS=$(uname -s)
    if [ "$OS" = "Linux" ]; then
        if command -v ufw >/dev/null 2>&1; then
            echo "=> 使用 UFW (Ubuntu/Debian) 開啟 Port..."
            sudo ufw allow $APP_PORT/tcp
            sudo ufw allow $FRONTEND_PORT/tcp
            sudo ufw allow $PISTON_PORT/tcp
            echo "=> UFW 設定完成。"
        elif command -v firewall-cmd >/dev/null 2>&1; then
            echo "=> 使用 firewalld (CentOS/RHEL) 開啟 Port..."
            sudo firewall-cmd --zone=public --add-port=$APP_PORT/tcp --permanent
            sudo firewall-cmd --zone=public --add-port=$FRONTEND_PORT/tcp --permanent
            sudo firewall-cmd --zone=public --add-port=$PISTON_PORT/tcp --permanent
            sudo firewall-cmd --reload
            echo "=> firewalld 設定完成。"
        else
            echo "=> 找不到 ufw 或 firewalld，請手動設定防火牆。"
        fi
    elif [ "$OS" = "Darwin" ]; then
        echo "=> 您使用的是 macOS，系統會在第一次連線時跳出詢問視窗，請點擊「允許」。"
    else
        echo "=> 未知作業系統，請手動開放相關 Port。"
    fi
else
    echo "=> 跳過防火牆設定。"
fi
echo ""

# 5. 啟動系統
echo "--- [5/5] 啟動系統 ---"
read -p "是否要使用 pm2 在背景啟動服務 (推薦)? (Y/n): " USE_PM2
USE_PM2=${USE_PM2:-Y}

if [[ "$USE_PM2" =~ ^[Yy]$ ]]; then
    if ! command -v pm2 >/dev/null 2>&1; then
        echo "=> 尚未安裝 pm2，為您全域安裝 pm2..."
        sudo npm install -g pm2
    fi
    echo "=> 使用 pm2 啟動後端與前端..."
    pm2 start $PACKAGE_MANAGER --name "ntut-backend" -- run dev:backend
    pm2 start $PACKAGE_MANAGER --name "ntut-frontend" -- run dev:frontend
    pm2 save
    echo "=> 已將程式放置於背景執行！您可以使用 'pm2 list' 與 'pm2 logs' 來管理與查看日誌。"
else
    echo "=> 使用一般背景執行 (nohup)..."
    nohup $PACKAGE_MANAGER run dev:backend > backend.log 2>&1 &
    nohup $PACKAGE_MANAGER run dev:frontend > frontend.log 2>&1 &
    echo "=> 已啟動，日誌存放於 backend.log 與 frontend.log。"
fi

echo ""
echo "====================================="
echo " 🎉 系統部署完成！"
echo " 🌐 前端網址: http://localhost:$FRONTEND_PORT"
echo " 🔌 後端 API: http://localhost:$APP_PORT"
echo " 🔑 Admin Secret: $ADMIN_SECRET"
echo "====================================="
