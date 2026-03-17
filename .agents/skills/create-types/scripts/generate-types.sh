#!/bin/bash

# Script para gerar Types
# Uso: bash generate-types.sh <entity-name>
# Exemplo: bash generate-types.sh customer

if [ -z "$1" ]; then
  echo "Erro: Nome da entidade é obrigatório"
  echo "Uso: bash generate-types.sh <entity-name>"
  echo "Exemplo: bash generate-types.sh customer"
  exit 1
fi

ENTITY_NAME=$1
ENTITY_PASCAL=$(echo $ENTITY_NAME | sed -e "s/\b\(.\)/\u\1/g")
DOMAIN_FILE="src/app/types/${ENTITY_NAME}.type.ts"
API_FILE="src/app/types/api/${ENTITY_NAME}-api.type.ts"

# Criar diretórios
mkdir -p src/app/types/api

# Criar types de domínio
cat > "$DOMAIN_FILE" <<EOF
/**
 * ${ENTITY_PASCAL} - Entidade do domínio
 */
export interface ${ENTITY_PASCAL} {
  id: string;
  // TODO: Adicione campos da entidade aqui
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ${ENTITY_PASCAL}Input - Para criação
 */
export interface ${ENTITY_PASCAL}Input {
  // TODO: Adicione campos de input aqui (sem id, sem timestamps)
}

/**
 * ${ENTITY_PASCAL}Update - Para atualização
 */
export interface ${ENTITY_PASCAL}Update {
  // TODO: Adicione campos de update aqui (todos opcionais)
}

/**
 * ${ENTITY_PASCAL}Filter - Para filtros
 */
export interface ${ENTITY_PASCAL}Filter {
  search?: string;
  // TODO: Adicione campos de filtro aqui
}
EOF

# Criar types da API
cat > "$API_FILE" <<EOF
/**
 * Api${ENTITY_PASCAL} - Formato que vem da API
 */
export interface Api${ENTITY_PASCAL} {
  id: string;
  // TODO: Adicione campos da API aqui (snake_case)
  created_at: string;
  updated_at: string;
}

/**
 * Api${ENTITY_PASCAL}Input - Formato que enviamos para API
 */
export interface Api${ENTITY_PASCAL}Input {
  // TODO: Adicione campos de input da API aqui (snake_case)
}
EOF

echo "✓ Types de domínio criados: $DOMAIN_FILE"
echo "✓ Types da API criados: $API_FILE"
echo ""
echo "Próximos passos:"
echo "1. Complete os campos em ${ENTITY_PASCAL}"
echo "2. Complete os campos em ${ENTITY_PASCAL}Input"
echo "3. Complete os campos em Api${ENTITY_PASCAL}"
echo "4. Complete os campos em Api${ENTITY_PASCAL}Input"
echo "5. Implemente conversões no Repository"
