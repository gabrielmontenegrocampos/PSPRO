# PS Pro - Orçamentos Inteligentes

Sistema PWA para gestão de orçamentos de pintura - Painel Services

## 🚀 Deploy na Vercel

### Opção 1: Via GitHub (Recomendado)

1. Crie um repositório no GitHub
2. Faça push deste projeto:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/pspro.git
   git push -u origin main
   ```
3. No Vercel (vercel.com):
   - Clique em "Add New Project"
   - Importe o repositório do GitHub
   - Clique em "Deploy"

### Opção 2: Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 📁 Estrutura do Projeto

```
pspro-vercel/
├── index.html          # App principal
├── login.html          # Tela de login/cadastro
├── manifest.json       # Configuração PWA
├── sw.js              # Service Worker
├── vercel.json        # Config Vercel
├── js/
│   └── supabase-config.js  # Conexão Supabase
└── icons/
    └── icon-*.png     # Ícones do app
```

## 🔐 Configuração Supabase

As credenciais do Supabase estão em `js/supabase-config.js`:
- URL: https://lnbjegelyaooloreefiu.supabase.co
- Chave Anon: configurada no arquivo

### Banco de Dados

Execute o `schema.sql` no Supabase SQL Editor para criar as tabelas:
- perfil
- clientes
- servicos
- orcamentos
- orcamentos_itens

## 📱 Funcionalidades PWA

- ✅ Instalável na tela inicial
- ✅ Funciona offline (cache de assets)
- ✅ Tema e ícones personalizados
- ✅ Atalhos rápidos

## 🎨 Identidade Visual

- **Cor Principal:** #1a3b5a (Azul Escuro)
- **Cor Secundária:** #f7c026 (Amarelo Ouro)
- **Fonte:** Poppins

---

Desenvolvido para Painel Services
