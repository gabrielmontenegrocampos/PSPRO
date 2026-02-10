// ============================================
// PS PRO - CONFIGURAÇÃO DO SUPABASE
// ============================================

const SUPABASE_URL = 'https://lnbjegelyaooloreefiu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYmplZ2VseWFvb2xvcmVlZml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NzY0MzYsImV4cCI6MjA1NTA1MjQzNn0.x12yDA95N1SNopULhtQpbg_lf4jIiOZ';

// Criar cliente Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
        window.location.href = '/login.html';
        return null;
    }
    
    return session.user;
}

async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Erro ao fazer logout:', error);
        return;
    }
    window.location.href = '/login.html';
}

async function getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

console.log('✅ Supabase configurado!');
