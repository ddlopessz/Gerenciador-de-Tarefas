CREATE DATABASE IF NOT EXISTS tarefas_bd;
USE tarefas_bd;

CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    titulo VARCHAR(255) NOT NULL, 
    descricao TEXT,
    data DATE, 
    concluida BOOLEAN DEFAULT FALSE 
);
    /*esse código:

    criara o banco das tarefas caso ele nao exista
    definira ele como o banco que sera usado
    criara o campo de id de cada tarefa
    criara o campo de titulo de cada tarefa
    criara o campo de descricao de cada tarefa
    criara o campo de data de cada tarefa
    criara o campo de informacao de conclusao de cada tarefa (falso por padrao)*/