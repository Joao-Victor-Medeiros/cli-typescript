import inquirer from "inquirer";
import { format, addDays } from "date-fns";
import Table from "cli-table3";

const hoje = new Date();
console.log(format(hoje, " dd/MM/yyyy HH:mm:ss")); // Formata a data

//estrutura de dados de cada categoria
interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

//estrutura de dados de cada Produto
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

//armazenamento em memória
const categorias: Categoria[] = [];
const produtos: Produto[] = [];

function limparTerminal() {
  // Usa códigos ANSI para limpar o terminal
  process.stdout.write("\x1B[2J\x1B[3J\x1B[H");
}

//funcao para obter a data e hora
function obterDataHoraAtual(): string {
  return new Date().toLocaleString("pt-BR");
}

//funcao de adicionar uma categoria
async function adicionarCategoria() {
  const { nome, descricao } = await inquirer.prompt([
    { type: "input", name: "nome", message: "Nome da categoria" },
    { type: "input", name: "descricao", message: "Descrição da categoria" },
  ]);
  categorias.push({
    id: categorias.length + 1,
    nome,
    descricao,
    dataCriacao: obterDataHoraAtual(),
    dataAtualizacao: "Não Alterado",
  });
  console.log(`Categoria "${nome}" adicionada!`);
}

// funcao para listar categorias
function listarCategorias() {
  if (categorias.length === 0) {
    console.log("Nenhuma categoria cadastrada.");
    return;
  }

  const table = new Table({
    head: ["ID", "Nome", "Descrição", "Criada em", "Alterada em"],
    colWidths: [5, 20, 30, 25, 25],
    wordWrap: true,
  });

  categorias.forEach((categoria) => {
    table.push([
      categoria.id,
      categoria.nome,
      categoria.descricao,
      categoria.dataCriacao,
      categoria.dataAtualizacao,
    ]);
  });
  console.log(table.toString());
}

//funcao buscar Categorias
async function buscarCategoria() {
  const { criterio } = await inquirer.prompt({
    type: "list",
    name: "criterio",
    message: "Deseja buscar por ID ou Nome?",
    choices: ["ID", "Nome"],
  });

  let categoriaEncontrada: any = null;

  if (criterio === "ID") {
    const { id } = await inquirer.prompt({
      type: "number",
      name: "id",
      message: "Digite o ID da categoria:",
    });

    categoriaEncontrada = categorias.find((c) => c.id === id);
  } else {
    const { nome } = await inquirer.prompt({
      type: "input",
      name: "nome",
      message: "Digite o nome da categoria:",
    });

    categoriaEncontrada = categorias.find(
      (c) => c.nome.toLowerCase() === nome.toLowerCase()
    );
  }

  if (categoriaEncontrada) {
    const table = new Table({
      head: ["ID", "Nome", "Descrição", "Criada em", "Alterada em"],
      colWidths: [5, 20, 30, 25, 25],
      wordWrap: true,
    });

    table.push([
      categoriaEncontrada.id,
      categoriaEncontrada.nome,
      categoriaEncontrada.descricao,
      categoriaEncontrada.dataCriacao,
      categoriaEncontrada.dataAtualizacao,
    ]);

    console.log(table.toString());
  } else {
    console.log("\n❌ Categoria não encontrada!\n");
  }
}

//funcao para atualizar as categorias
async function editarCategoria() {
  listarCategorias();
  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID da categoria que deseja editar:",
  });
  const categoria = categorias.find((c) => c.id === id);
  if (!categoria) {
    console.log("Categoria nao encontrada!");
    return;
  }
  const { nome, descricao } = await inquirer.prompt([
    {
      type: "input",
      name: "nome",
      message: "Novo nome",
      default: categoria.nome,
    },
    {
      type: "input",
      name: "descricao",
      message: "Nova descricao",
      default: categoria.descricao,
    },
  ]);
  categoria.nome = nome;
  categoria.descricao = descricao;
  categoria.dataAtualizacao = obterDataHoraAtual();
  console.log("Categoria atualizada com sucesso!");
}

//funcao para deletar categorias
async function deletarCategoria() {
  if (categorias.length === 0) {
    console.log("Não há categorias para deletar.");
    return;
  }

  listarCategorias();

  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Selecione a Categoria que deseja deletar (0 para Cancelar):",
  });

  if (id === 0) {
    console.log("\nOperação cancelada.");
    return;
  }

  if (isNaN(id)) {
    console.log("\nID inválido.");
    return;
  }

  const index = categorias.findIndex((c) => c.id === id);
  if (index === -1) {
    console.log("Categoria não encontrada!");
    return;
  }

  const produtosNaCategoria = produtos.filter((p) => p.categoriaId === id);
  if (produtosNaCategoria.length > 0) {
    console.log(
      `\nNão é possível deletar esta categoria pois existem ${produtosNaCategoria.length} produto(s) vinculado(s) a ela.`
    );
    console.log("Por favor, delete ou altere os produtos primeiro.");
    return;
  }

  categorias.splice(index, 1);
  console.log("Categoria deletada com sucesso!");
}

//funcao para adicionar novo produto
async function adicionarProduto() {
  const resposta = await inquirer.prompt([
    { type: "input", name: "nome", message: "Nome do Produto" },
    { type: "input", name: "descricao", message: "Descrição do Produto" },
    { type: "input", name: "preco", message: "Preço do produto" },
    { type: "input", name: "quantidade", message: "Quantidade de Produtos" },
    {
      type: "input",
      name: "categoriaId",
      message: "ID da categoria do produto",
    },
  ]);

  const categoriaId = Number(resposta.categoriaId);
  const preco = Number(resposta.preco);
  const quantidade = Number(resposta.quantidade);

  if (isNaN(categoriaId) || !categorias.some((c) => c.id === categoriaId)) {
    console.log("Categoria inválida!");
    return;
  }

  if (isNaN(preco)) {
    console.log("Preço inválido!");
    return;
  }

  if (isNaN(quantidade)) {
    console.log("Quantidade inválida!");
    return;
  }

  produtos.push({
    id: produtos.length + 1,
    ...resposta,
    preco,
    quantidade,
    categoriaId,
    dataCriacao: obterDataHoraAtual(),
    dataAtualizacao: "Não Alterado",
  });

  console.log(`Produto "${resposta.nome}" adicionado!`);
}

//funcao para listar produtos
function listarProdutos() {
  if (produtos.length === 0) {
    console.log("Nenhum produto cadastrado.");
    return;
  }

  const table = new Table({
    head: [
      "ID",
      "Nome",
      "Descrição",
      "Preço",
      "Qtd",
      "Categoria ID",
      "Criado em",
      "Atualizado em",
    ],
    colWidths: [5, 20, 30, 10, 8, 12, 25, 25],
    wordWrap: true,
  });

  produtos.forEach((produto) => {
    table.push([
      produto.id,
      produto.nome,
      produto.descricao,
      `R$ ${produto.preco}`,
      produto.quantidade,
      produto.categoriaId,
      produto.dataCriacao,
      produto.dataAtualizacao,
    ]);
  });
  console.log(table.toString());
}

//funcao buscar produto
async function buscarProduto() {
  const { criterio } = await inquirer.prompt({
    type: "list",
    name: "criterio",
    message: "Deseja buscar por ID, Nome ou Categoria?",
    choices: ["ID", "Nome", "Categoria"],
  });

  let produtosEncontrados: Produto[] = [];

  if (criterio === "ID") {
    const { id } = await inquirer.prompt({
      type: "number",
      name: "id",
      message: "Digite o ID do Produto:",
    });

    const produto = produtos.find((p) => p.id === id);
    if (produto) produtosEncontrados.push(produto);
  } else if (criterio === "Nome") {
    const { nome } = await inquirer.prompt({
      type: "input",
      name: "nome",
      message: "Digite o nome do Produto:",
    });

    produtosEncontrados = produtos.filter((p) =>
      p.nome.toLowerCase().includes(nome.toLowerCase())
    );
  } else if (criterio === "Categoria") {
    const { nomeCategoria } = await inquirer.prompt({
      type: "input",
      name: "nomeCategoria",
      message: "Digite o nome da Categoria:",
    });

    const categoria = categorias.find((c) =>
      c.nome.toLowerCase().includes(nomeCategoria.toLowerCase())
    );

    if (categoria) {
      produtosEncontrados = produtos.filter(
        (p) => p.categoriaId === categoria.id
      );
    } else {
      console.log("\n❌ Categoria não encontrada!\n");
      return;
    }
  }

  if (produtosEncontrados.length === 0) {
    console.log("\n❌ Nenhum produto encontrado!\n");
    return;
  }

  const table = new Table({
    head: [
      "ID",
      "Nome",
      "Descrição",
      "Preço",
      "Qtd",
      "Categoria ID",
      "Criado em",
      "Atualizado em",
    ],
    colWidths: [5, 20, 30, 10, 8, 12, 25, 25],
    wordWrap: true,
  });

  produtosEncontrados.forEach((produto) => {
    table.push([
      produto.id,
      produto.nome,
      produto.descricao,
      `R$ ${produto.preco}`,
      produto.quantidade,
      produto.categoriaId,
      produto.dataCriacao,
      produto.dataAtualizacao,
    ]);
  });

  console.log(table.toString());
}

//funcao para editar produto
async function editarProdutos() {
  listarProdutos();
  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID do produto que deseja editar:",
  });

  const produto = produtos.find((p) => p.id === id);
  if (!produto) {
    console.log("Produto não encontrado!");
    return;
  }

  const resposta = await inquirer.prompt([
    {
      type: "input",
      name: "nome",
      message: "Novo nome",
      default: produto.nome,
    },
    {
      type: "input",
      name: "descricao",
      message: "Nova descrição",
      default: produto.descricao,
    },
    {
      type: "number",
      name: "preco",
      message: "Novo preço",
      default: produto.preco,
    },
    {
      type: "number",
      name: "quantidade",
      message: "Nova quantidade",
      default: produto.quantidade,
    },
    {
      type: "number",
      name: "categoriaId",
      message: "Nova categoria ID",
      default: produto.categoriaId,
    },
  ]);

  if (!categorias.some((c) => c.id === resposta.categoriaId)) {
    console.log("Categoria inválida!");
    return;
  }

  Object.assign(produto, {
    ...resposta,
    dataAtualizacao: obterDataHoraAtual(),
  });

  console.log("Produto atualizado com sucesso!");
}

//funcao para deletar produto
async function deletarProduto() {
  listarProdutos();
  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message:
      "Selecione o produto que deseja deletar (0 para nao deletar nenhum Produto):",
  });
  const index = produtos.findIndex((c) => c.id === id);
  if (index === -1) {
    console.log("produto nao encontrado!");
    return;
  }
  produtos.splice(index, 1);
  console.log("Produto deletado com sucesso!");
}

//menu principal
async function menu() {
  while (true) {
    const { opcao } = await inquirer.prompt({
      type: "list",
      name: "opcao",
      message: "Escolha uma Opcao:",
      choices: [
        "Adicionar Categoria",
        "Listar Categoria",
        "Buscar Categoria",
        "Editar Categoria",
        "Deletar Categoria",
        "Adicionar Produto",
        "Listar Produto",
        "Buscar Produto",
        "Editar Produto",
        "Deletar Produto",
        "Sair",
      ],
    });
    if (opcao === "Adicionar Categoria") await adicionarCategoria();
    else if (opcao === "Listar Categoria") listarCategorias();
    else if (opcao === "Buscar Categoria") await buscarCategoria();
    else if (opcao === "Editar Categoria") await editarCategoria();
    else if (opcao === "Deletar Categoria") await deletarCategoria();
    else if (opcao === "Adicionar Produto") await adicionarProduto();
    else if (opcao === "Listar Produto") listarProdutos();
    else if (opcao === "Buscar Produto") await buscarProduto();
    else if (opcao === "Editar Produto") await editarProdutos();
    else if (opcao === "Deletar Produto") await deletarProduto();
    else if (opcao === "Sair") {
      limparTerminal();
      process.exit(0); // Sai do programa com código 0 (sucesso)
    }
  }
}

//executar o menu
menu();
