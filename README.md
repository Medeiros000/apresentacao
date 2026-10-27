# Design Patterns & Princípios POO

Apresentação interativa com exemplos em TypeScript e React sobre encapsulamento, segregação de interfaces, Chain of Responsibility e Command Pattern.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Docker, caso prefira executar em container

## Executar localmente

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Scripts disponíveis

```bash
npm run dev       # Inicia o servidor com hot reload
npm run build     # Verifica os tipos e gera a versão de produção
npm run lint      # Executa o ESLint
npm run preview   # Serve localmente a build de produção
```

## Executar com Docker

Construa a imagem:

```bash
docker build -t apresentacao-poo .
```

Inicie o container:

```bash
docker run --rm -p 8080:80 apresentacao-poo
```

Acesse `http://localhost:8080`.

## Estrutura principal

- `src/App.tsx`: navegação entre os exemplos
- `src/*Example.tsx`: demonstrações interativas dos padrões e princípios
- `src/examples/`: snippets de código usados na apresentação
- `public/`: arquivos estáticos públicos

## Desenvolvido por

- Desenvolvedor Full Cycle - [jrmedeiros.dev](https://github.com/Medeiros000)