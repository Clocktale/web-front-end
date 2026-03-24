# Skill: Localizar Conteúdo

Esta skill ensina como identificar textos hardcoded em templates Angular e convertê-los para o sistema de localização com Transloco.

## Quando Usar

Use esta skill quando precisar:
- Localizar textos hardcoded em um arquivo HTML de componente Angular
- Adicionar traduções para novos textos em componentes existentes
- Converter uma tela inteira para suporte multi-idioma

## Pré-requisitos

O projeto já possui Transloco configurado com 3 idiomas:
- `en` (Inglês)
- `pt-BR` (Português do Brasil)
- `ja` (Japonês)

Arquivos de tradução ficam em `public/i18n/`:
```
public/i18n/
├── en.json
├── pt-BR.json
└── ja.json
```

## Idiomas Suportados

| Código  | Idioma              |
|---------|---------------------|
| `en`    | Inglês              |
| `pt-BR` | Português do Brasil |
| `ja`    | Japonês             |

**IMPORTANTE**: Cada texto hardcoded encontrado DEVE gerar exatamente 1 entrada em CADA um dos 3 arquivos de tradução.

## Passo a Passo

### 1. Identificar textos hardcoded

Abra o arquivo HTML alvo e procure por:
- Textos visíveis entre tags (ex: `<h2>Meu Título</h2>`)
- Atributos `aria-label`, `title`, `alt` com texto estático
- Atributos `placeholder` com texto estático

**Não localizar**:
- Classes CSS
- URLs e caminhos de imagem
- Valores numéricos
- Nomes de variáveis ou bindings Angular (`{{ variavel }}`)
- Atributos técnicos como `role`, `type`, `id`

### 2. Definir chaves de tradução

Convenção de chaves hierárquicas baseada na localização do componente:

```
[modulo].[pagina].[descricaoDoTexto]
```

Exemplos:
- `auth.login.title` → título da página de login
- `auth.login.emailPlaceholder` → placeholder do campo email
- `auth.register.submitButton` → botão de submit do registro
- `anime.details.synopsis` → sinopse na tela de detalhes do anime

**Regras de nomenclatura**:
- Usar **camelCase** para o nome da chave
- Nome deve descrever o **propósito semântico**, não o conteúdo
- Não usar o texto em si como chave

### 3. Adicionar traduções nos 3 arquivos JSON

Para cada texto hardcoded, adicionar a entrada equivalente em **todos** os 3 arquivos.

As traduções devem manter o mesmo significado semântico, não ser tradução literal palavra por palavra. Adapte ao que é natural em cada idioma.

### 4. Substituir textos no template HTML

Usar a **structural directive** `*transloco="let t"` para substituir os textos.

### 5. Importar TranslocoModule no componente

No arquivo `.ts` do componente, adicionar `TranslocoModule` ao array `imports`.

## Exemplo Completo

### ANTES — Template com textos hardcoded

```html
<!-- src/app/ui/modules/auth/login/login.page.html -->
<div class="login-layout">
  <div class="login-layout__image" role="img" aria-label="Cena noturna com lua e pessoa contemplando"></div>
  <div class="login-layout__form">
    <h2>Form do login</h2>
    <input type="email" placeholder="Digite seu e-mail" />
    <input type="password" placeholder="Digite sua senha" />
    <button type="submit">Entrar</button>
    <a href="/forgot-password">Esqueceu a senha?</a>
  </div>
</div>
```

### Textos identificados

| Texto hardcoded                              | Chave de tradução              | Tipo                |
|----------------------------------------------|--------------------------------|---------------------|
| Cena noturna com lua e pessoa contemplando   | `auth.login.imageAlt`          | aria-label          |
| Form do login                                | `auth.login.title`             | texto visível       |
| Digite seu e-mail                            | `auth.login.emailPlaceholder`  | placeholder         |
| Digite sua senha                             | `auth.login.passwordPlaceholder` | placeholder       |
| Entrar                                       | `auth.login.submitButton`      | texto de botão      |
| Esqueceu a senha?                            | `auth.login.forgotPassword`    | texto de link       |

### Entradas adicionadas nos JSONs

**public/i18n/pt-BR.json**
```json
{
  "auth": {
    "login": {
      "title": "Form do login",
      "imageAlt": "Cena noturna com lua e pessoa contemplando",
      "emailPlaceholder": "Digite seu e-mail",
      "passwordPlaceholder": "Digite sua senha",
      "submitButton": "Entrar",
      "forgotPassword": "Esqueceu a senha?"
    }
  }
}
```

**public/i18n/en.json**
```json
{
  "auth": {
    "login": {
      "title": "Login Form",
      "imageAlt": "Night scene with moon and person contemplating",
      "emailPlaceholder": "Enter your email",
      "passwordPlaceholder": "Enter your password",
      "submitButton": "Sign in",
      "forgotPassword": "Forgot your password?"
    }
  }
}
```

**public/i18n/ja.json**
```json
{
  "auth": {
    "login": {
      "title": "ログインフォーム",
      "imageAlt": "月と物思いにふける人のいる夜景",
      "emailPlaceholder": "メールアドレスを入力",
      "passwordPlaceholder": "パスワードを入力",
      "submitButton": "ログイン",
      "forgotPassword": "パスワードをお忘れですか？"
    }
  }
}
```

### DEPOIS — Template localizado

```html
<!-- src/app/ui/modules/auth/login/login.page.html -->
<ng-container *transloco="let t; prefix: 'auth.login'">
  <div class="login-layout">
    <div class="login-layout__image" role="img" [attr.aria-label]="t('imageAlt')"></div>
    <div class="login-layout__form">
      <h2>{{ t('title') }}</h2>
      <input type="email" [placeholder]="t('emailPlaceholder')" />
      <input type="password" [placeholder]="t('passwordPlaceholder')" />
      <button type="submit">{{ t('submitButton') }}</button>
      <a href="/forgot-password">{{ t('forgotPassword') }}</a>
    </div>
  </div>
</ng-container>
```

### DEPOIS — Componente TypeScript

```typescript
// src/app/ui/modules/auth/login/login.page.ts
import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {}
```

## Padrões de Substituição no Template

### Texto entre tags
```html
<!-- ANTES -->
<h2>Meu Título</h2>

<!-- DEPOIS -->
<h2>{{ t('title') }}</h2>
```

### Atributo aria-label
```html
<!-- ANTES -->
<div aria-label="Descrição da imagem"></div>

<!-- DEPOIS -->
<div [attr.aria-label]="t('imageAlt')"></div>
```

### Atributo placeholder
```html
<!-- ANTES -->
<input placeholder="Digite aqui" />

<!-- DEPOIS -->
<input [placeholder]="t('placeholder')" />
```

### Atributo title
```html
<!-- ANTES -->
<span title="Mais informações">Info</span>

<!-- DEPOIS -->
<span [title]="t('tooltip')">{{ t('info') }}</span>
```

### Texto com interpolação dinâmica
```html
<!-- ANTES -->
<p>Bem-vindo, {{ userName }}!</p>

<!-- DEPOIS (JSON: "welcome": "Welcome, {{ name }}!") -->
<p>{{ t('welcome', { name: userName }) }}</p>
```

## Uso da Structural Directive

A diretiva `*transloco="let t"` cria um escopo de tradução eficiente.

### Com prefix (recomendado para páginas)
Evita repetir o namespace completo em cada chamada:

```html
<ng-container *transloco="let t; prefix: 'auth.login'">
  <!-- t('title') resolve para auth.login.title -->
  <h2>{{ t('title') }}</h2>
</ng-container>
```

### Sem prefix
Quando precisa acessar chaves de namespaces diferentes:

```html
<ng-container *transloco="let t">
  <h2>{{ t('auth.login.title') }}</h2>
  <p>{{ t('common.loading') }}</p>
</ng-container>
```

## Checklist

Antes de finalizar a localização de um arquivo, verifique:

- [ ] Todos os textos hardcoded em português foram identificados
- [ ] Chaves de tradução seguem a convenção `[modulo].[pagina].[descricao]` em camelCase
- [ ] Tradução adicionada em `public/i18n/en.json`
- [ ] Tradução adicionada em `public/i18n/pt-BR.json`
- [ ] Tradução adicionada em `public/i18n/ja.json`
- [ ] Cada chave existe nos 3 arquivos JSON (nenhum idioma faltando)
- [ ] Template usa `*transloco="let t"` com `prefix` adequado
- [ ] Atributos HTML usam property binding (ex: `[placeholder]`, `[attr.aria-label]`)
- [ ] `TranslocoModule` importado no array `imports` do componente `.ts`
- [ ] Traduções fazem sentido semântico em cada idioma (não tradução literal)

## Regras Importantes

- SEMPRE usar a **structural directive** `*transloco="let t"` nos templates
- SEMPRE usar `prefix` quando todos os textos pertencem ao mesmo namespace
- SEMPRE gerar traduções nos **3 idiomas** (en, pt-BR, ja) — nunca deixar um idioma sem entrada
- SEMPRE usar **camelCase** nas chaves de tradução
- NUNCA usar o texto como chave (ex: não usar `"Form do login"` como chave)
- NUNCA deixar textos hardcoded em português no template após localizar
- NUNCA modificar a estrutura HTML existente (classes, layout) — apenas substituir textos
- Traduções devem ser **naturais** em cada idioma, não tradução palavra por palavra
- Manter a estrutura hierárquica consistente nos 3 arquivos JSON
