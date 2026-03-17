#!/bin/bash

# Script para gerar um novo Repository
# Uso: bash generate-repository.sh <entity-name>
# Exemplo: bash generate-repository.sh customer

if [ -z "$1" ]; then
  echo "Erro: Nome da entidade é obrigatório"
  echo "Uso: bash generate-repository.sh <entity-name>"
  echo "Exemplo: bash generate-repository.sh customer"
  exit 1
fi

ENTITY_NAME=$1
ENTITY_PASCAL=$(echo $ENTITY_NAME | sed -e "s/\b\(.\)/\u\1/g")
ENTITY_PLURAL="${ENTITY_NAME}s"
FILE_PATH="src/app/repositories/${ENTITY_NAME}.repository.ts"

# Criar diretório se não existir
mkdir -p src/app/repositories

# Criar arquivo
cat > "$FILE_PATH" <<EOF
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ${ENTITY_PASCAL}, ${ENTITY_PASCAL}Input } from '../types/${ENTITY_NAME}.type';
import { Api${ENTITY_PASCAL}, Api${ENTITY_PASCAL}Input } from '../types/api/${ENTITY_NAME}-api.type';

@Injectable({ providedIn: 'root' })
export class ${ENTITY_PASCAL}Repository {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/${ENTITY_PLURAL}';

  /**
   * Busca todos os ${ENTITY_PLURAL}
   */
  getAll(): Observable<${ENTITY_PASCAL}[]> {
    return this.http.get<Api${ENTITY_PASCAL}[]>(this.apiUrl).pipe(
      map(items => items.map(item => this.toDomain(item))),
      catchError(this.handleError('getAll'))
    );
  }

  /**
   * Busca ${ENTITY_NAME} por ID
   */
  get(id: string): Observable<${ENTITY_PASCAL}> {
    return this.http.get<Api${ENTITY_PASCAL}>(\`\${this.apiUrl}/\${id}\`).pipe(
      map(item => this.toDomain(item)),
      catchError(this.handleError('get'))
    );
  }

  /**
   * Cria novo ${ENTITY_NAME}
   */
  create(input: ${ENTITY_PASCAL}Input): Observable<${ENTITY_PASCAL}> {
    const apiData = this.toApi(input);
    return this.http.post<Api${ENTITY_PASCAL}>(this.apiUrl, apiData).pipe(
      map(item => this.toDomain(item)),
      catchError(this.handleError('create'))
    );
  }

  /**
   * Atualiza ${ENTITY_NAME} existente
   */
  update(id: string, input: ${ENTITY_PASCAL}Input): Observable<${ENTITY_PASCAL}> {
    const apiData = this.toApi(input);
    return this.http.put<Api${ENTITY_PASCAL}>(\`\${this.apiUrl}/\${id}\`, apiData).pipe(
      map(item => this.toDomain(item)),
      catchError(this.handleError('update'))
    );
  }

  /**
   * Deleta ${ENTITY_NAME}
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`).pipe(
      catchError(this.handleError('delete'))
    );
  }

  /**
   * Converte dados da API para o domínio
   */
  private toDomain(apiData: Api${ENTITY_PASCAL}): ${ENTITY_PASCAL} {
    return {
      id: apiData.id,
      // TODO: Adicione mapeamento de campos aqui
      createdAt: new Date(apiData.created_at),
      updatedAt: new Date(apiData.updated_at)
    };
  }

  /**
   * Converte dados do domínio para a API
   */
  private toApi(domain: ${ENTITY_PASCAL}Input): Api${ENTITY_PASCAL}Input {
    return {
      // TODO: Adicione mapeamento de campos aqui
    };
  }

  /**
   * Tratamento centralizado de erros
   */
  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(\`\${operation} falhou:\`, error);
      throw new Error(\`Erro na operação \${operation}: \${error.message}\`);
    };
  }
}
EOF

echo "✓ Repository criado: $FILE_PATH"
echo ""
echo "Próximos passos:"
echo "1. Defina os types em src/app/types/${ENTITY_NAME}.type.ts"
echo "2. Defina os API types em src/app/types/api/${ENTITY_NAME}-api.type.ts"
echo "3. Complete os métodos toDomain() e toApi()"
echo "4. Ajuste a URL da API se necessário"
echo "5. Crie um controller para usar este repository"
