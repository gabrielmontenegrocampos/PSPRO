// ============================================
// PS PRO - CONFIGURAÇÃO SUPABASE
// Cliente JavaScript para conectar ao backend
// ============================================

// Importar o Supabase Client
// IMPORTANTE: Este import funciona com CDN ou npm
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ============================================
// VARIÁVEIS DE AMBIENTE
// ============================================

// IMPORTANTE: As chaves vêm do arquivo .env (não commitado no git)
// Você encontra essas informações em:
// Supabase Dashboard > Settings > API

// Para Vite (Vercel/desenvolvimento)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 
                     import.meta.env.PUBLIC_SUPABASE_URL ||
                     'https://seu-projeto.supabase.co'; // fallback apenas para referência

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                          import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
                          'sua-chave-publica-aqui'; // fallback apenas para referência

// ============================================
// CRIAR CLIENTE SUPABASE
// ============================================

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage // Manter usuário logado
  }
});

// ============================================
// HELPER: Verificar se usuário está logado
// ============================================

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
  
  return user;
}

// ============================================
// HELPER: Obter sessão ativa
// ============================================

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Erro ao obter sessão:', error);
    return null;
  }
  
  return session;
}

// ============================================
// HELPER: Verificar autenticação
// ============================================

export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

// ============================================
// LISTENER: Monitorar mudanças de autenticação
// ============================================

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event);
    callback(event, session);
  });
}

// ============================================
// EXEMPLO DE USO
// ============================================

/*
// Em qualquer arquivo do seu app:

import { supabase, getUser, isAuthenticated } from './config/supabase.js';

// Verificar se está logado
const logado = await isAuthenticated();
if (!logado) {
  window.location.href = '/login.html';
}

// Obter dados do usuário
const user = await getUser();
console.log('Usuário:', user.email);

// Buscar clientes
const { data, error } = await supabase
  .from('clientes')
  .select('*')
  .order('nome', { ascending: true });

// Inserir novo cliente
const { data, error } = await supabase
  .from('clientes')
  .insert({
    user_id: user.id,
    nome: 'João Silva',
    tel: '(11) 99999-9999'
  });
*/

// ============================================
// INSTRUÇÕES DE CONFIGURAÇÃO
// ============================================

/*
PASSO 1: Obter suas credenciais do Supabase
-------------------------------------------
1. Acesse seu projeto no Supabase Dashboard
2. Vá em Settings > API
3. Copie:
   - Project URL (SUPABASE_URL)
   - anon/public key (SUPABASE_ANON_KEY)

PASSO 2: Substituir as variáveis acima
--------------------------------------
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-publica-aqui';

⚠️ SEGURANÇA:
- A chave ANON é segura para usar no frontend
- Ela é pública e limitada pelas políticas RLS
- Nunca use a SERVICE_ROLE key no frontend!

PASSO 3: Usar em produção
-------------------------
Para produção, use variáveis de ambiente:
- Vercel: adicionar em Settings > Environment Variables
- Arquivo .env.local (git ignored)
*/

console.log('✅ Supabase configurado e pronto para uso!');
