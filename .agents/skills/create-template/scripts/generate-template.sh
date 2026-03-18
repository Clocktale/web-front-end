#!/bin/bash

if [ -z "$1" ]; then
  echo "Erro: Nome do template é obrigatório"
  exit 1
fi

TEMPLATE_NAME=$1
TEMPLATE_PASCAL=$(echo $TEMPLATE_NAME | sed -e "s/\b\(.\)/\u\1/g" | sed 's/-//g')
DIR_PATH="src/app/ui/design_system/templates/${TEMPLATE_NAME}"
FILE_PATH="${DIR_PATH}/${TEMPLATE_NAME}.component.ts"

mkdir -p "$DIR_PATH"

cat > "$FILE_PATH" <<EOF
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-${TEMPLATE_NAME}',
  template: \`
    <div class="${TEMPLATE_NAME}">
      <!-- TODO: Add layout structure -->
      <ng-content />
    </div>
  \`,
  styles: [\`
    .${TEMPLATE_NAME} {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  \`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${TEMPLATE_PASCAL}Component {}
EOF

echo "✓ Template criado: $FILE_PATH"
