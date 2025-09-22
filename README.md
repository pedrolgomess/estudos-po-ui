````markdown
# Projeto Angular com PO UI

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) versão **17.3.17**.  
Documentação oficial do PO UI: [TOTVS PO UI](https://tdn.totvs.com/pages/releaseview.action?pageId=827321473)

---

## 🚀 Instalação do Angular CLI
Caso o Angular CLI ainda não esteja instalado em sua máquina, execute:

```bash
npm i -g @angular/cli@17
````

O Angular CLI se encarrega de construir toda a estrutura inicial do projeto.
Para criar um novo projeto, utilize:

```bash
ng new my-po-project --skip-install --no-standalone
```

---

## 📦 Dependências

Certifique-se de que seu projeto possua as dependências abaixo:

```json
"dependencies": {
  "@angular/animations": "~17.3.9",
  "@angular/common": "~17.3.9",
  "@angular/compiler": "~17.3.9",
  "@angular/core": "~17.3.9",
  "@angular/forms": "~17.3.9",
  "@angular/platform-browser": "~17.3.9",
  "@angular/platform-browser-dynamic": "~17.3.9",
  "@angular/platform-server": "~17.3.9",
  "@angular/router": "~17.3.9",
  "@po-ui/ng-components": "^17.1.0",
  "@po-ui/ng-templates": "^17.1.0",
  "@po-ui/style": "^17.1.0",
  "@totvs/common-assets": "^1.1.1",
  "@totvs/po-theme": "^17.1.0",
  "core-js": "^3.13.0",
  "rxjs": "~7.8.1",
  "rxjs-compat": "^6.6.3",
  "subsink": "^1.0.2",
  "tslib": "^2.6.2",
  "zone.js": "~0.14.4"
},
"devDependencies": {
  "@angular-devkit/build-angular": "~17.3.7",
  "@angular-eslint/builder": "17.5.1",
  "@angular-eslint/eslint-plugin": "17.5.1",
  "@angular-eslint/eslint-plugin-template": "17.5.1",
  "@angular-eslint/schematics": "17.5.1",
  "@angular-eslint/template-parser": "17.5.1",
  "@angular/cli": "~17.3.7",
  "@angular/compiler-cli": "~17.3.9",
  "typescript": "~5.2.2"
}
```

Após validar as versões, instale as dependências do projeto:

```bash
npm install
```

---

## ➕ Adicionando PO UI ao projeto

Para adicionar o PO UI, rode o comando abaixo no diretório raiz do projeto:

```bash
ng add @po-ui/ng-components
```

Esse comando se encarregará de:

* Configurar o tema
* Instalar os pacotes do PO UI
* Importar os módulos necessários (incluindo `HttpClientModule`)

---

## ▶️ Executando o projeto

Para iniciar a aplicação, execute:

```bash
ng serve
```

Depois, abra seu navegador no endereço:

👉 [http://localhost:4200](http://localhost:4200)

---

## 📚 Links úteis

* [Documentação Angular CLI](https://angular.dev/tools/cli)
* [Documentação PO UI TOTVS](https://tdn.totvs.com/pages/releaseview.action?pageId=827321473)

```
