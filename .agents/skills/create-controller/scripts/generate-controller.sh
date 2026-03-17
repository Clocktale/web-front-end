#!/bin/bash

# Script para gerar um novo Controller
# Uso: bash generate-controller.sh <entity-name>
# Exemplo: bash generate-controller.sh customer

if [ -z "$1" ]; then
  echo "Erro: Nome da entidade é obrigatório"
  echo "Uso: bash generate-controller.sh <entity-name>"
  echo "Exemplo: bash generate-controller.sh customer"
  exit 1
fi

ENTITY_NAME=$1
ENTITY_PASCAL=$(echo $ENTITY_NAME | sed -e "s/\b\(.\)/\u\1/g")
ENTITY_PLURAL="${ENTITY_NAME}s"
FILE_PATH="src/app/controllers/${ENTITY_NAME}.controller.ts"

# Criar diretório se não existir
mkdir -p src/app/controllers

# Criar arquivo
cat > "$FILE_PATH" <<EOF
import { Injectable, inject, signal, computed } from '@angular/core';
import { ${ENTITY_PASCAL}Repository } from '../repositories/${ENTITY_NAME}.repository';
import { ${ENTITY_PASCAL}, ${ENTITY_PASCAL}Input } from '../types/${ENTITY_NAME}.type';

@Injectable({ providedIn: 'root' })
export class ${ENTITY_PASCAL}Controller {
  private repo = inject(${ENTITY_PASCAL}Repository);

  // Estado
  ${ENTITY_PLURAL} = signal<${ENTITY_PASCAL}[]>([]);
  selected${ENTITY_PASCAL} = signal<${ENTITY_PASCAL} | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Estado derivado
  ${ENTITY_NAME}Count = computed(() => this.${ENTITY_PLURAL}().length);
  has${ENTITY_PASCAL}s = computed(() => this.${ENTITY_PLURAL}().length > 0);
  isLoading = computed(() => this.loading());
  hasError = computed(() => this.error() !== null);

  /**
   * Carrega todos os ${ENTITY_PLURAL}
   */
  load${ENTITY_PASCAL}s() {
    this.loading.set(true);
    this.error.set(null);

    this.repo.getAll().subscribe({
      next: (items) => {
        this.${ENTITY_PLURAL}.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar ${ENTITY_PLURAL}');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  /**
   * Carrega um ${ENTITY_NAME} específico
   */
  load${ENTITY_PASCAL}(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.repo.get(id).subscribe({
      next: (item) => {
        this.selected${ENTITY_PASCAL}.set(item);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar ${ENTITY_NAME}');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  /**
   * Cria novo ${ENTITY_NAME}
   */
  create${ENTITY_PASCAL}(input: ${ENTITY_PASCAL}Input) {
    this.loading.set(true);
    this.error.set(null);

    this.repo.create(input).subscribe({
      next: (item) => {
        this.${ENTITY_PLURAL}.update(list => [...list, item]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao criar ${ENTITY_NAME}');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  /**
   * Atualiza ${ENTITY_NAME} existente
   */
  update${ENTITY_PASCAL}(id: string, input: ${ENTITY_PASCAL}Input) {
    this.loading.set(true);
    this.error.set(null);

    this.repo.update(id, input).subscribe({
      next: (updated) => {
        this.${ENTITY_PLURAL}.update(list => 
          list.map(item => item.id === id ? updated : item)
        );
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao atualizar ${ENTITY_NAME}');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  /**
   * Deleta ${ENTITY_NAME}
   */
  delete${ENTITY_PASCAL}(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.repo.delete(id).subscribe({
      next: () => {
        this.${ENTITY_PLURAL}.update(list => list.filter(item => item.id !== id));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao deletar ${ENTITY_NAME}');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  /**
   * Seleciona um ${ENTITY_NAME}
   */
  select${ENTITY_PASCAL}(item: ${ENTITY_PASCAL}) {
    this.selected${ENTITY_PASCAL}.set(item);
  }

  /**
   * Limpa seleção
   */
  clearSelection() {
    this.selected${ENTITY_PASCAL}.set(null);
  }

  /**
   * Limpa erro
   */
  clearError() {
    this.error.set(null);
  }
}
EOF

echo "✓ Controller criado: $FILE_PATH"
echo ""
echo "Próximos passos:"
echo "1. Certifique-se que o Repository existe em src/app/repositories/${ENTITY_NAME}.repository.ts"
echo "2. Certifique-se que os Types existem em src/app/types/${ENTITY_NAME}.type.ts"
echo "3. Injete este controller em seus componentes"
echo "4. Adicione lógica de negócio específica se necessário"
echo "5. Considere adicionar computed signals para estado derivado"
