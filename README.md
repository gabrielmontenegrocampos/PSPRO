# 🎨 PS Pro - Orçamentos Inteligentes

Sistema completo de gerenciamento de orçamentos para empresas de pintura.

## 🚀 Tecnologias

- **Frontend:** HTML, CSS, JavaScript (PWA)
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deploy:** Vercel
- **Banco de Dados:** PostgreSQL com Row Level Security

---

## ⚙️ Configuração Local

### 1. Clone o repositório
```bash
git clone seu-repositorio.git
cd ps-pro
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Edite o `.env` e preencha com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

**Onde encontrar as credenciais:**
1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings > API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Configure o banco de dados

Execute o schema SQL no Supabase:
1. No Supabase Dashboard, vá em **SQL Editor**
2. Copie o conteúdo de `supabase/schema.sql`
3. Cole e clique em **RUN**

### 4. Instale dependências (se usar npm)
```bash
npm install
```

### 5. Rode localmente
```bash
npm run dev
```

Ou simplesmente abra o `index.html` no navegador!

---

## 🌐 Deploy na Vercel

### 1. Conecte seu repositório GitHub

### 2. Configure as variáveis de ambiente na Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Deploy automático! 🎉

---

## 📦 Estrutura do Projeto

```
ps-pro/
├── public/
│   ├── index.html          # PWA principal
│   ├── manifest.json       # Config PWA
│   └── service-worker.js   # Offline support
├── src/
│   ├── config/
│   │   └── supabase.js     # Config Supabase
│   ├── auth/
│   │   └── auth.js         # Login/Cadastro
│   └── services/
│       ├── clientes.js
│       ├── servicos.js
│       └── orcamentos.js
├── supabase/
│   └── schema.sql          # Schema do banco
├── .env.example            # Template variáveis
├── .gitignore
└── README.md
```

---

## 🔐 Segurança

- ✅ Row Level Security (RLS) ativado
- ✅ Cada usuário vê apenas seus dados
- ✅ Autenticação via Supabase Auth
- ✅ Variáveis de ambiente protegidas

---

## 📱 Funcionalidades

- ✅ Dashboard com estatísticas
- ✅ Cadastro de clientes
- ✅ Catálogo de serviços
- ✅ Criação de orçamentos
- ✅ Exportação para PDF
- ✅ Busca de CEP automática
- ✅ Multi-usuário
- ✅ PWA (funciona offline)

---

## 🎨 Identidade Visual

Baseado no **Brand Book Painel Services**:
- **Cores:** #1a3b5a (azul) e #f7c026 (amarelo)
- **Tipografia:** Poppins, Montserrat, Agarandir

---

## 📞 Suporte

Dúvidas? Entre em contato!

---

## 📄 Licença

Propriedade de Painel Services © 2025