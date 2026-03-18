#!/bin/bash

if [ -z "$1" ]; then
  echo "Erro: Nome da molecule é obrigatório"
  exit 1
fi

MOLECULE_NAME=$1
MOLECULE_PASCAL=$(echo $MOLECULE_NAME | sed -e "s/\b\(.\)/\u\1/g" | sed 's/-//g')
DIR_PATH="src/app/ui/design_system/molecules/${MOLECULE_NAME}"
FILE_PATH="${DIR_PATH}/${MOLECULE_NAME}.component.ts"

mkdir -p "$DIR_PATH"

cat > "$FILE_PATH" <<EOF
import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-${MOLECULE_NAME}',
  template: \`
    <div class="${MOLECULE_NAME}">
      <!-- TODO: Compose atoms here -->
      <ng-content />
    </div>
  \`,
  styles: [\`
    .${MOLECULE_NAME} {
      display: flex;
      gap: 0.5rem;
    }
  \`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${MOLECULE_PASCAL}Component {
  // TODO: Add inputs and outputs
}
EOF

echo "✓ Molecule criada: $FILE_PATH"
