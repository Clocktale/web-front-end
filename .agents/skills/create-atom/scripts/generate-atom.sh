#!/bin/bash

# Script para gerar um Atom
# Uso: bash generate-atom.sh <atom-name>

if [ -z "$1" ]; then
  echo "Erro: Nome do atom é obrigatório"
  exit 1
fi

ATOM_NAME=$1
ATOM_PASCAL=$(echo $ATOM_NAME | sed -e "s/\b\(.\)/\u\1/g")
DIR_PATH="src/app/ui/design_system/atoms/${ATOM_NAME}"
FILE_PATH="${DIR_PATH}/${ATOM_NAME}.component.ts"

mkdir -p "$DIR_PATH"

cat > "$FILE_PATH" <<EOF
import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-${ATOM_NAME}',
  template: \`
    <div class="${ATOM_NAME}">
      <!-- TODO: Adicione template aqui -->
      <ng-content />
    </div>
  \`,
  styles: [\`
    .${ATOM_NAME} {
      /* TODO: Adicione estilos aqui */
    }
  \`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${ATOM_PASCAL}Component {
  // TODO: Adicione inputs
  // exemplo: label = input<string>('');
  
  // TODO: Adicione outputs
  // exemplo: clicked = output<void>();
  
  // TODO: Adicione computed se necessário
}
EOF

echo "✓ Atom criado: $FILE_PATH"
echo ""
echo "Próximos passos:"
echo "1. Complete o template"
echo "2. Adicione estilos"
echo "3. Defina inputs e outputs"
echo "4. Implemente acessibilidade"
echo "5. Exporte no módulo/index apropriado"
