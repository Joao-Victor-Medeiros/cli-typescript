# CLI-com-TypeScript

Este repositório contém um projeto de CLI (Command Line Interface) desenvolvido com TypeScript. O projeto permite o gerenciamento de categorias e produtos diretamente pelo terminal, utilizando a biblioteca `inquirer` para interatividade e `cli-table3` para exibição estruturada de dados.

## Recursos
- Adicionar, listar, buscar, editar e excluir **categorias**
- Adicionar, listar, buscar, editar e excluir **produtos**
- Interface interativa via terminal
- Armazenamento dos dados em memória
- Formatação de datas usando `date-fns`

## Tecnologias Utilizadas
- **TypeScript**
- **Node.js**
- **Inquirer.js** (para entrada do usuário via terminal)
- **CLI-Table3** (para exibição tabular dos dados)
- **Date-fns** (para manipulação de datas)

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/Arthur-Vitorino/CLI-com-TypeScript.git
   ```

2. Acesse a pasta do projeto:
   ```sh
   cd CLI-com-TypeScript
   ```

3. Instale as dependências:
   ```sh
   npm install
   ```

4. Compile o código TypeScript para JavaScript:
   ```sh
   npm run build
   ```

5. Execute o projeto:
   ```sh
   npm start
   ```

## Uso
Ao rodar o comando `npm start`, será exibido um menu interativo no terminal com as opções disponíveis:

- **Adicionar Categoria**
- **Listar Categoria**
- **Buscar Categoria**
- **Editar Categoria**
- **Deletar Categoria**
- **Adicionar Produto**
- **Listar Produto**
- **Buscar Produto**
- **Editar Produto**
- **Deletar Produto**
- **Sair**

## Estrutura de Dados
### Categoria
```ts
interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

### Produto
```ts
interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  categoriaId: number;
  dataCriacao: string;
  dataAtualizacao: string;
}
```

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

