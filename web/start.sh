#!/bin/bash

# Script de inicialização do Frontend - Sistema de Eventos Acadêmicos

echo "🚀 Iniciando Frontend - Sistema de Eventos Acadêmicos"
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado!"
    echo "Certifique-se de estar no diretório frontend/"
    exit 1
fi

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Erro: Node.js não está instalado!"
    echo "Instale o Node.js versão 18 ou superior"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Erro: Node.js versão $NODE_VERSION detectada!"
    echo "É necessário Node.js versão 18 ou superior"
    exit 1
fi

echo "✅ Node.js versão $(node --version) detectada"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências!"
        exit 1
    fi
fi

# Verificar se o backend está rodando
echo "🔍 Verificando se o backend está rodando..."
if curl -s http://localhost:8080/api/auth/test > /dev/null 2>&1; then
    echo "✅ Backend está rodando na porta 8080"
else
    echo "⚠️  Aviso: Backend não está rodando na porta 8080"
    echo "   Certifique-se de iniciar o backend antes de usar o frontend"
fi

# Verificar se a porta 3000 está livre
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Aviso: Porta 3000 já está em uso"
    echo "   Tentando usar porta 3001..."
    PORT=3001 npm start
else
    echo "✅ Porta 3000 está livre"
    echo "🚀 Iniciando servidor de desenvolvimento..."
    npm start
fi 