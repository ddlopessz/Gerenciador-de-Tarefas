-----

Descrição:

Gerenciador de tarefas, por Dereck Lopes Gomez

Esta aplicação foi desenvolvida para gerenciar tarefas, conectando-se a um banco de dados MySQL através do PhpMyAdmin usando xampp. Ela interage com as tarefas no banco de dados diretamente, permitindo a criação, edição, conclusão e visualização de suas tarefas.

-----

O que foi utilizado:

- JavaScript
- Node.js (pré-instale)

- XAMPP (pré-instale)
- Apache (para usar o PhpMyAdmin no localhost. Instale com o xampp)
- MySQL (instale com o xampp)
- PhpMyAdmin (instale com o xampp)

- mysql2/promise
- readline-sync

-----

Funcionalidades:

- Criar tarefa (título, descrição, data)
- Editar tarefa
- Excluir tarefa
- Marcar tarefa como concluída
- Ver todas as tarefas

-----

Banco de Dados:

Para criar o banco de dados, no phpMyAdmin do XAMPP com o MySQL e o Apache ativos:

(manual)
- crie um banco chamado tarefas_bd
- execute o script tarefas.sql no php

(automático)
- rode o tarefas.sql diretamente no servidor (cria o banco instantaneamente)

-----

Como executar:

1 - Tenha o node.js e o XAMPP com PhpMyAdmin, MySQL e Apache instalados, todos ativos.

2 - No terminal, vá até a pasta do projeto.

3 - Instale as dependências

(automático)
- rode 'npm install' (usa o package.json)

(manual)
- rode 'npm install mysql2'
- rode 'npm install readline-sync'

4 - Rode o programa, com o comando 'node index.js'

-----