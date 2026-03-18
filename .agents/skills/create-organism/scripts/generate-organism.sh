#!/bin/bash

if [ -z "$1" ]; then
  echo "Erro: Nome do organism é obrigatório"
  exit 1
fi

ORGANISM_NAME=$1
ORGANISM_PASCAL=$(echo $ORGANISM_NAME | sed -e "s/\b\(.\)/\u\1/g" | sed 's/-//g')
DIR_PATH="src/app/ui/design_system/organisms/${ORGANISM_NAME}"
FILE_PATH="${DIR_PATH}/${ORGANISM_NAME}.component.ts"

mkdir -p "$DIR_PATH"

cat > "$FILE_PATH" <<EOF
import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-${ORGANISM_NAME}',
  template: \`
    <div class="${ORGANISM_NAME}">
      <!-- TODO: Compose molecules and atoms -->
      <ng-content />
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${ORGANISM_PASCAL}Component {
  // TODO: Inject controllers if needed
  // controller = inject(SomeController);
  
  // TODO: Add inputs and outputs
}
EOF

echo "✓ Organism criado: $FILE_PATH"
