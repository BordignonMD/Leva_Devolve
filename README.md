# Leva_Devolve - Aplicação para gerenciamento de Bibliotecas

# <h2>Projeto</h2>

O Leva_Devolve é uma aplicação com objetivo de auxiliar o gerenciamento de bibliotecas.
Através da aplicação, o usuário (bibliotecário) poderá cadastrar os livros disponíveis fisicamente na biblioteca.

# Features

- O Usuário (Bibliotecário) poderá realizar o cadastro na aplicação.
- O Usuário (Bibliotecário) poderá fazer login na aplicação.
- O Usuário (Bibliotecário) poderá adicionar novos livros, informando título, imagem, autor, número de páginas, descrição, editora e data de publicação.
   - A inserção das informações poderá ser feita individualmente, ou através da consulta na API <a href="https://developers.google.com/books"> Google Books </a>
- O Usuário (Bibliotecário) poderá listar todas os livros adicionados na aplicação.
- O Usuário (Bibliotecário) poderá deletar um livro.

# Screens
<h2> Tela de Cadastro de Usuário </h2>
<img src="/screenshots/Cadastro_Biblioteca_1_1.gif" />
<img src="/screenshots/Cadastro_Biblioteca_1_2.gif" />

<h2> Tela de Login </h2>
<img src="/screenshots/Login.gif" />

<h2> Consulta de Livros </h2>
<img src="/screenshots/Pesquisa.gif" />

<h2> Cadastro/Adição de Livro (Sem utilizar a consulta na API) </h2>
<img src="/screenshots/Cadastro_Livro_2_1.gif" />
<img src="/screenshots/Cadastro_Livro_2_2.gif" />

<h2> Cadastro/Adição de Livro (Utilizando a consulta na API) </h2>
<img src="/screenshots/Cadastro_Livro_1_0.gif" />

# 💻 Instalação, execução e desenvolvimento
Faça um clone desse repositorio.

<h2>Pré-requisitos</h2>
<ul>
<li><a href="https://nodejs.org/en/">Node.js</a></li>
<li><a href="https://yarnpkg.com/">Yarn</a> ou <a href="https://www.npmjs.com/https://www.npmjs.com/">NPM</a></li>
<li><a href="https://pt-br.reactjs.org/">React</a></li>
<li><a href="https://expressjs.com/pt-br/">Express</a></li>
</ul>

<h2>Backend</h2>
<ul>
<li>A partir da raiz do projeto, entre na pasta rodando cd server;</li>
<li>Rode yarn para instalar suas dependências;</li>
<li>Caso não tenha criado o banco de dados, rode npx knex migrate:latest;</li>
</ul>

<h2>Frontend</h2> 
OBS: Antes de executar, lembre-se de iniciar o backend da aplicação.

<ul>
<li>A partir da raiz do projeto, entre na pasta do frontend rodando cd web;</li>
<li>Rode yarn para instalar as dependências;</li>
<li>Rode yarn start para iniciar o client web;</li>
</ul>

# ✏️ Próximas releases
- [ ] Aplicação de testes (unitários, integração)
- [ ] Utilização de conteiners (Docker)
- [ ] Aplicação mobile

# 🤔 Como contribuir
<ul>
<li>Faça um fork desse repositório;</li>
<li>Cria uma branch com a sua feature: git checkout -b minha-feature;</li>
<li>Faça commit das suas alterações: git commit -m 'feat: Minha nova feature';</li>
<li>Faça push para a sua branch: git push origin minha-feature;</li>
</ul>

# Tecnologias
<ul>
<li>Backend: Foi desenvolvida uma API RESTful utilizando Node.js, Express, Cors. Além disso, a API possui integração com banco de dados SQLite utilizando Knex.</li>
<li>Frontend: O frontend foi desenvolvido utilizando o ReactJS</li>
</ul>
