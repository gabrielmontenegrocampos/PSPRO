// ============================================
// CONFIGURAÇÃO DO SUPABASE
// Arquivo centralizado para usar em todo o projeto
// ============================================

// Configuração do Supabase
const SUPABASE_URL = 'https://lnbjegelyaooloreefiu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_x12yDA95N1SNopULhtQpbg_lf4jIiOZ';

// Criar cliente Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

// Verificar se está logado
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
        // Não está logado, redirecionar para login
        window.location.href = '/login.html';
        return null;
    }
    
    return session.user;
}

// Fazer logout
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Erro ao fazer logout:', error);
        return;
    }
    window.location.href = '/login.html';
}

// Obter usuário atual
async function getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

// ============================================
// FUNÇÕES DE BANCO DE DADOS - PERFIL
// ============================================

async function loadPerfil() {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const { data, error } = await supabaseClient
        .from('perfil')
        .select('*')
        .eq('user_id', user.id)
        .single();
    
    if (error) {
        console.error('Erro ao carregar perfil:', error);
        return null;
    }
    
    return data;
}

async function savePerfil(perfilData) {
    const user = await getCurrentUser();
    if (!user) return null;
    
    // Verificar se já existe perfil
    const { data: existing } = await supabaseClient
        .from('perfil')
        .select('id')
        .eq('user_id', user.id)
        .single();
    
    if (existing) {
        // Atualizar
        const { data, error } = await supabaseClient
            .from('perfil')
            .update(perfilData)
            .eq('user_id', user.id)
            .select()
            .single();
        
        if (error) {
            console.error('Erro ao atualizar perfil:', error);
            return null;
        }
        return data;
    } else {
        // Criar
        const { data, error } = await supabaseClient
            .from('perfil')
            .insert({ ...perfilData, user_id: user.id })
            .select()
            .single();
        
        if (error) {
            console.error('Erro ao criar perfil:', error);
            return null;
        }
        return data;
    }
}

// ============================================
// FUNÇÕES DE BANCO DE DADOS - CLIENTES
// ============================================

async function loadClientes() {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const { data, error } = await supabaseClient
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true });
    
    if (error) {
        console.error('Erro ao carregar clientes:', error);
        return [];
    }
    
    return data || [];
}

async function saveCliente(clienteData) {
    const user = await getCurrentUser();
    if (!user) return null;
    
    if (clienteData.id) {
        // Atualizar
        const { data, error } = await supabaseClient
            .from('clientes')
            .update(clienteData)
            .eq('id', clienteData.id)
            .eq('user_id', user.id)
            .select()
            .single();
        
        if (error) {
            console.error('Erro ao atualizar cliente:', error);
            return null;
        }
        return data;
    } else {
        // Criar
        const { data, error } = await supabaseClient
            .from('clientes')
            .insert({ ...clienteData, user_id: user.id })
            .select()
            .single();
        
        if (error) {
            console.error('Erro ao criar cliente:', error);
            return null;
        }
        return data;
    }
}

async function getCliente(id) {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const { data, error } = await supabaseClient
        .from('clientes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
    
    if (error) {
        console.error('Erro ao buscar cliente:', error);
        return null;
    }
    
    return data;
}

// ============================================
// FUNÇÕES DE BANCO DE DADOS - SERVIÇOS
// ============================================

async function loadServicos() {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const { data, error } = await supabaseClient
        .from('servicos')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true });
    
    if (error) {
        console.error('Erro ao carregar serviços:', error);
        return [];
    }
    
    return data || [];
}

async function saveServico(servicoData) {
    const user = await getCurrentUser();
    if (!user) return null;
    
    if (servicoData.id) {
        // Atualizar
        const { data, error } = await supabaseClient
            .from('servicos')
            .update(servicoData)
            .eq('id', servicoData.id)
            .eq('user_id', user.id)
            .select()
            .single();
        
        if (error) {
            console.error('Erro ao atualizar serviço:', error);
            return null;
        }
        return data;
    } else {
        // Criar
        const { data, error } = await supabaseClient
            .from('servicos')
            .insert({ ...servicoData, user_id: user.id })
            .select()
            .single();
        
        if (error) {
            console.error('Erro ao criar serviço:', error);
            return null;
        }
        return data;
    }
}

async function getServico(id) {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const { data, error } = await supabaseClient
        .from('servicos')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
    
    if (error) {
        console.error('Erro ao buscar serviço:', error);
        return null;
    }
    
    return data;
}

// ============================================
// FUNÇÕES DE BANCO DE DADOS - ORÇAMENTOS
// ============================================

async function loadOrcamentos() {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const { data, error } = await supabaseClient
        .from('orcamentos')
        .select(`
            *,
            clientes (
                id,
                nome,
                tel,
                endereco
            )
        `)
        .eq('user_id', user.id)
        .order('data', { ascending: false });
    
    if (error) {
        console.error('Erro ao carregar orçamentos:', error);
        return [];
    }
    
    return data || [];
}

async function saveOrcamento(orcamentoData, itens) {
    const user = await getCurrentUser();
    if (!user) return null;
    
    try {
        if (orcamentoData.id) {
            // Atualizar orçamento
            const { data: orcamento, error: orcError } = await supabaseClient
                .from('orcamentos')
                .update(orcamentoData)
                .eq('id', orcamentoData.id)
                .eq('user_id', user.id)
                .select()
                .single();
            
            if (orcError) throw orcError;
            
            // Deletar itens antigos
            await supabaseClient
                .from('orcamentos_itens')
                .delete()
                .eq('orcamento_id', orcamento.id);
            
            // Inserir novos itens
            const itensComId = itens.map(item => ({
                ...item,
                orcamento_id: orcamento.id,
                servico_id: item.servId
            }));
            
            const { error: itensError } = await supabaseClient
                .from('orcamentos_itens')
                .insert(itensComId);
            
            if (itensError) throw itensError;
            
            return orcamento;
            
        } else {
            // Criar novo orçamento
            const { data: orcamento, error: orcError } = await supabaseClient
                .from('orcamentos')
                .insert({ ...orcamentoData, user_id: user.id })
                .select()
                .single();
            
            if (orcError) throw orcError;
            
            // Inserir itens
            const itensComId = itens.map(item => ({
                ...item,
                orcamento_id: orcamento.id,
                servico_id: item.servId
            }));
            
            const { error: itensError } = await supabaseClient
                .from('orcamentos_itens')
                .insert(itensComId);
            
            if (itensError) throw itensError;
            
            return orcamento;
        }
    } catch (error) {
        console.error('Erro ao salvar orçamento:', error);
        return null;
    }
}

async function getOrcamento(id) {
    const user = await getCurrentUser();
    if (!user) return null;
    
    // Buscar orçamento
    const { data: orcamento, error: orcError } = await supabaseClient
        .from('orcamentos')
        .select(`
            *,
            clientes (
                id,
                nome,
                tel,
                endereco
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
    
    if (orcError) {
        console.error('Erro ao buscar orçamento:', error);
        return null;
    }
    
    // Buscar itens
    const { data: itens, error: itensError } = await supabaseClient
        .from('orcamentos_itens')
        .select('*')
        .eq('orcamento_id', id)
        .order('id', { ascending: true });
    
    if (itensError) {
        console.error('Erro ao buscar itens:', error);
        return null;
    }
    
    // Combinar dados
    return {
        ...orcamento,
        itens: itens || []
    };
}

async function updateOrcamentoStatus(id, status) {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const { data, error } = await supabaseClient
        .from('orcamentos')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
    
    if (error) {
        console.error('Erro ao atualizar status:', error);
        return null;
    }
    
    return data;
}

// ============================================
// FUNÇÃO: OBTER ESTATÍSTICAS DO DASHBOARD
// ============================================

async function getDashboardStats() {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const { data, error } = await supabaseClient
        .rpc('get_dashboard_stats', { p_user_id: user.id });
    
    if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return null;
    }
    
    return data;
}
