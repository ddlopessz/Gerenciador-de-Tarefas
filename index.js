//Por Dereck Lopes

const readline = require("readline-sync"); //requer a biblioteca readline, que receberá o input do usuário no terminal
const mysql = require("mysql2/promise"); //requer o mysql2, que utiliza promises em vez de callbacks manuais

class Tarefa {
    constructor(titulo, descricao, data) { //criará um novo objeto "Tarefa" com base no input do usuário
        this.titulo = titulo; //o this pega define o valor como o do novo objeto
        this.descricao = descricao;
        this.data = data;
        this.concluida = false;
    }
}

async function criarConexao() { //cria uma promessa assíncrona, que vai retornar o resultado da tentativa de conexão
    try { //tenta iniciar a conexão, utilizando os valores fornecidos
        const conexao = await mysql.createConnection({ //espera a criação da conexão (pausa a função assíncrona)
            host: "localhost",
            user: "root",
            password: "",
            database: "tarefas_bd"
        });
        console.log("Conexao com o banco realizada!"); //roda caso tenha funcionado, pula pro catch caso falhe
        return conexao;
    } catch (err) { //pega um erro
        console.error("Erro! Conexao com o banco falhou:", err); 
        process.exit(1); //cancela a execução
    }
}

let conexao;

async function iniciar() {
    conexao = await criarConexao(); //roda a função de criar uma conexão e espera suas promises
    main(); //puxa a função do main
}

iniciar();

async function buscarId() { //Tenta buscar um objeto baseado no ID que lhe foi atribuido. pega com base na linha de tarefas
    const id = Number(readline.question("Entre com o ID da tarefa desejada: "));
    try { //tenta encontrar a tarefa
        //"pegue todas as colunas(tarefas) (*) da tabela tarefas na qual o id casar" -- sintaxe do SQL // o ? é o ID que é passado como argumento logo depois
        const [rows] = await conexao.execute("SELECT * FROM tarefas WHERE id = ?", [id]); //utiliza a conexão previamente criada para criar um objeto baseado na tarefa na qual o ID bate com o ID desejado
        if (rows.length == 0) { //se ele não achar nada (0 linhas encontradas) retorna um valor vazio
            console.log("ID não encontrado!");
            return null;
        } else {
            console.log("Tarefa encontrada:", rows[0]); //imprime a casa número 1 do array, que é a tarefa encontrada
            return rows[0]; //retorna a tarefa encontrada
        }
    } catch (err) { //pega um possível erro
        console.error("Erro ao buscar tarefa:", err);
        return null; //retorna um valor nulo
    }
}

async function criarTarefa() { //cria uma tarefa
    //recebe os inputs do usuário
    const titulo = readline.question("Digite o titulo da tarefa: ");
    const descricao = readline.question("Digite a descricao: ");
    const data = readline.question("Digite a data (AAAA-MM-DD): ");
    const tarefa = new Tarefa(titulo, descricao, data);
    try { //tenta adicionar no BD (query)
        const [resultado] = await conexao.execute(
            //"insira nas colunas(tarefas)da tabela tarefas com 4 valores" -- sintaxe do SQL
            "INSERT INTO tarefas (titulo, descricao, data, concluida) VALUES (?, ?, ?, ?)",
            [tarefa.titulo, tarefa.descricao, tarefa.data, tarefa.concluida] //4 valores (? no SQL) são passados ao banco de dados, como na função anterior
        );
        tarefa.id = resultado.insertId; //adiciona um identificador automaticamente incrementado  à tarefa
        console.log("Tarefa salva no banco!");
    } catch (err) { //pega um possível erro
        console.error("Erro ao inserir tarefa no banco:", err);
    }
}

async function editarTarefa() {
    const tarefa = await buscarId(); //utiliza a função da busca de id
    if (tarefa) { //caso a tarefa tenha sido encontrada
        console.log("1 - titulo // 2 - descricao // 3 - data");
        const caso = Number(readline.question("O que deseja editar?: "));
        let campo, novoValor;
        switch (caso) { //um switch pra cada opção
            case 1:
                campo = "titulo";
                novoValor = readline.question("Digite o novo titulo: ");
                break;
            case 2:
                campo = "descricao";
                novoValor = readline.question("Digite a nova descricao: ");
                break;
            case 3:
                campo = "data";
                novoValor = readline.question("Digite a nova data (AAAA-MM-DD): ");
                break;
            default:
                console.log("Erro! Nenhuma opcao selecionada!");
                return;
        }
        try {//tenta atualizar o valor da tarefa (query)
             //"atualize nas tarefas o campo na qual o id" -- sintaxe do SQL
            await conexao.execute(`UPDATE tarefas SET ${campo} = ? WHERE id = ?`, [novoValor, tarefa.id]); 
            console.log("Tarefa atualizada com sucesso!");  
        } catch (err) {
            console.error("Erro ao editar tarefa:", err);
        }
    }
}

async function excluirTarefa() {
    const tarefa = await buscarId(); //utiliza o valor retornado pela função
    if (tarefa) { //caso a tarefa tenha sido encontrada
        try { //tenta removê-la do bd (query)
            //"delete das linhas(tarefas) (*) onde o id dar match" -- sintaxe do SQL
            await conexao.execute("DELETE FROM tarefas WHERE id = ?", [tarefa.id]);
            console.log("Tarefa deletada com sucesso!");
        } catch (err) { //pega um possível erro
            console.error("Erro ao excluir tarefa:", err);
        }
    }
}

async function concluirTarefa() {
    const tarefa = await buscarId(); //utiliza o valor retornado pela função
    if (tarefa) { //caso a tarefa tenha sido encontrada
        try { //tenta marcar o campo de conclusão da tarefa como true (query)
            await conexao.execute("UPDATE tarefas SET concluida = 1 WHERE id = ?", [tarefa.id]);
            console.log("Tarefa marcada como concluida!");
        } catch (err) { //pega um possível erro
            console.error("Erro ao marcar tarefa como concluida:", err);
        }
    }
}

async function verTarefas() {
    try { //tenta coletar todas as tarefas (query)
        //seleciona todos os campos da tabela tarefas
        const [resultados] = await conexao.execute("SELECT * FROM tarefas");
        
        console.table(resultados);
    } catch (err) { //pega um possível erro
        console.error("Erro ao buscar tarefas:", err);
    }
}

async function main() {
    while (true) { //loopa até o programa retornar e parar no caso 0
        console.log("0 - encerrar programa // 1 - criar tarefa // 2 - editar tarefa // 3 - excluir tarefa // 4 - marcar conclusao // 5 - ver tarefas");
        const caso = Number(readline.question("O que deseja fazer?: "));
        //roda as funções previamentes definidas
        switch (caso) {
            case 0: //cancela a execução
                await conexao.end(); //fecha a conexão com o BD (ajuda a manter integridade)
                console.log("Fim do programa!")
                return;
            case 1:
                await criarTarefa();
                break;
            case 2:
                await editarTarefa();
                break;
            case 3:
                await excluirTarefa();
                break;
            case 4:
                await concluirTarefa();
                break;
            case 5:
                await verTarefas();
                break;
            default: //caso o valor inserido não case com nenhuma das opções
                console.log("Erro! Nenhuma opcao selecionada!");
                break;
        }
    }

}
