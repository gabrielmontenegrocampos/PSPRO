-- ============================================
-- PS PRO - SCHEMA DO BANCO DE DADOS
-- Supabase PostgreSQL
-- ============================================

-- HABILITAR ROW LEVEL SECURITY EM TODAS AS TABELAS
-- Isso garante que cada usuário veja apenas seus próprios dados

-- ============================================
-- 1. TABELA: perfil
-- Dados da empresa/perfil do usuário
-- ============================================
CREATE TABLE perfil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome TEXT,
    doc TEXT, -- CPF ou CNPJ
    tel TEXT,
    email TEXT,
    cep TEXT,
    num TEXT,
    endereco TEXT, -- Endereço completo
    compl TEXT,
    val INTEGER DEFAULT 15, -- Validade padrão dos orçamentos em dias
    pagamento TEXT, -- Formas de pagamento aceitas
    obs TEXT, -- Observações padrão dos orçamentos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que cada usuário tenha apenas 1 perfil
    UNIQUE(user_id)
);

-- Índice para busca rápida por user_id
CREATE INDEX idx_perfil_user_id ON perfil(user_id);

-- ============================================
-- 2. TABELA: clientes
-- Cadastro de clientes
-- ============================================
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    doc TEXT, -- CPF ou CNPJ
    tel TEXT,
    email TEXT,
    cep TEXT,
    num TEXT,
    endereco TEXT, -- Endereço da obra
    compl TEXT,
    obs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_clientes_user_id ON clientes(user_id);
CREATE INDEX idx_clientes_nome ON clientes(nome);

-- ============================================
-- 3. TABELA: servicos
-- Catálogo de serviços de pintura
-- ============================================
CREATE TABLE servicos (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    un TEXT NOT NULL, -- Unidade (m², m, un, h, diária)
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT, -- Descrição do serviço
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_servicos_user_id ON servicos(user_id);
CREATE INDEX idx_servicos_nome ON servicos(nome);

-- ============================================
-- 4. TABELA: orcamentos
-- Orçamentos criados
-- ============================================
CREATE TABLE orcamentos (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cliente_id BIGINT REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
    titulo TEXT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente', -- pendente, fechado, recusado
    data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    val INTEGER DEFAULT 15, -- Validade em dias
    pagamento TEXT, -- Forma de pagamento específica deste orçamento
    obs TEXT, -- Observações específicas deste orçamento
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Validação de status
    CONSTRAINT valid_status CHECK (status IN ('pendente', 'fechado', 'recusado'))
);

-- Índices para performance
CREATE INDEX idx_orcamentos_user_id ON orcamentos(user_id);
CREATE INDEX idx_orcamentos_cliente_id ON orcamentos(cliente_id);
CREATE INDEX idx_orcamentos_status ON orcamentos(status);
CREATE INDEX idx_orcamentos_data ON orcamentos(data DESC);

-- ============================================
-- 5. TABELA: orcamentos_itens
-- Itens de cada orçamento
-- ============================================
CREATE TABLE orcamentos_itens (
    id BIGSERIAL PRIMARY KEY,
    orcamento_id BIGINT REFERENCES orcamentos(id) ON DELETE CASCADE NOT NULL,
    servico_id BIGINT REFERENCES servicos(id) ON DELETE RESTRICT NOT NULL,
    nome TEXT NOT NULL, -- Nome do serviço (snapshot)
    preco DECIMAL(10,2) NOT NULL, -- Preço unitário (snapshot)
    un TEXT NOT NULL, -- Unidade (snapshot)
    qtd DECIMAL(10,2) NOT NULL, -- Quantidade
    total DECIMAL(10,2) NOT NULL, -- Total do item
    ambiente TEXT DEFAULT 'Geral', -- Ambiente/local da obra
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_orcamentos_itens_orcamento_id ON orcamentos_itens(orcamento_id);
CREATE INDEX idx_orcamentos_itens_servico_id ON orcamentos_itens(servico_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário vê apenas seus próprios dados
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos_itens ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS: perfil
-- ============================================

-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own perfil"
    ON perfil FOR SELECT
    USING (auth.uid() = user_id);

-- Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Users can insert own perfil"
    ON perfil FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own perfil"
    ON perfil FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar apenas seu próprio perfil
CREATE POLICY "Users can delete own perfil"
    ON perfil FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: clientes
-- ============================================

CREATE POLICY "Users can view own clientes"
    ON clientes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clientes"
    ON clientes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clientes"
    ON clientes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clientes"
    ON clientes FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: servicos
-- ============================================

CREATE POLICY "Users can view own servicos"
    ON servicos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own servicos"
    ON servicos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own servicos"
    ON servicos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own servicos"
    ON servicos FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: orcamentos
-- ============================================

CREATE POLICY "Users can view own orcamentos"
    ON orcamentos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orcamentos"
    ON orcamentos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orcamentos"
    ON orcamentos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own orcamentos"
    ON orcamentos FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: orcamentos_itens
-- ============================================

-- Usuários podem ver itens dos próprios orçamentos
CREATE POLICY "Users can view own orcamentos_itens"
    ON orcamentos_itens FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orcamentos
            WHERE orcamentos.id = orcamentos_itens.orcamento_id
            AND orcamentos.user_id = auth.uid()
        )
    );

-- Usuários podem inserir itens nos próprios orçamentos
CREATE POLICY "Users can insert own orcamentos_itens"
    ON orcamentos_itens FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orcamentos
            WHERE orcamentos.id = orcamentos_itens.orcamento_id
            AND orcamentos.user_id = auth.uid()
        )
    );

-- Usuários podem atualizar itens dos próprios orçamentos
CREATE POLICY "Users can update own orcamentos_itens"
    ON orcamentos_itens FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM orcamentos
            WHERE orcamentos.id = orcamentos_itens.orcamento_id
            AND orcamentos.user_id = auth.uid()
        )
    );

-- Usuários podem deletar itens dos próprios orçamentos
CREATE POLICY "Users can delete own orcamentos_itens"
    ON orcamentos_itens FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM orcamentos
            WHERE orcamentos.id = orcamentos_itens.orcamento_id
            AND orcamentos.user_id = auth.uid()
        )
    );

-- ============================================
-- TRIGGERS: updated_at automático
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas
CREATE TRIGGER update_perfil_updated_at BEFORE UPDATE ON perfil
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON orcamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para buscar estatísticas do dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_orcamentos', COUNT(*),
        'total_fechados', COUNT(*) FILTER (WHERE status = 'fechado'),
        'total_pendentes', COUNT(*) FILTER (WHERE status = 'pendente'),
        'total_recusados', COUNT(*) FILTER (WHERE status = 'recusado'),
        'valor_total_fechado', COALESCE(SUM(total) FILTER (WHERE status = 'fechado'), 0)
    )
    INTO result
    FROM orcamentos
    WHERE user_id = p_user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DADOS INICIAIS (SEED) - OPCIONAL
-- Será populado automaticamente quando usuário cadastrar
-- ============================================

-- Você pode descomentar isso se quiser pré-popular serviços padrão
-- para todos os usuários. Mas recomendo deixar o usuário adicionar.

/*
-- Inserir serviços padrão (executar após criar usuário)
INSERT INTO servicos (user_id, nome, un, preco, desc) VALUES
    (auth.uid(), 'Repintura Látex PVA 2 demãos', 'm²', 8.50, 'Apenas repintura'),
    (auth.uid(), 'Selador + 2 Látex PVA', 'm²', 12.80, '1 selador + 2 demãos tinta');
*/

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- INSTRUÇÕES DE USO:
-- 1. Copie todo este arquivo
-- 2. No Supabase, vá em SQL Editor
-- 3. Cole e execute (RUN)
-- 4. Pronto! Banco criado com segurança RLS
