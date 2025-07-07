#!/bin/bash

echo "🚀 Iniciando Sistema de Eventos Acadêmicos..."
echo ""

# Verificar se o backend está rodando
echo "📡 Verificando se o backend está rodando..."
if curl -s http://localhost:8080/api/auth/test > /dev/null 2>&1; then
    echo "✅ Backend está rodando na porta 8080"
else
    echo "⚠️  Backend não está rodando na porta 8080"
    echo "   Certifique-se de que o backend Java está executando"
    echo ""
fi

echo ""
echo "🌐 Iniciando frontend..."
echo "   URL: http://localhost:3000"
echo "   Backend: http://localhost:8080"
echo ""
echo "📋 Comandos úteis:"
echo "   - Ctrl+C: Parar o servidor"
echo "   - Ctrl+R: Recarregar a página"
echo "   - F12: Abrir DevTools"
echo ""

# Iniciar o projeto
npm start 