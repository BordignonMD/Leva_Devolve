import express, { request, response } from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';
import {errors} from 'celebrate';

// Tabelas
//    libraries (users)
//      id
//      image
//      name
//      login
//      email
//      phone
//      latitude
//      longitude
//      city
//      uf
//    books
//      id
//      image
//      title
//      author
//      description
//      pageCount
//      publisher
//      publishedDate 
//      id_library

// Funcionalidades
//    Criar cadastro biblioteca
//    Criar cadastro livro
//    Remover livro
//    Listar livros
//    Listar Bibliotecas (mobile)
//    Listar livro específico

const app = express();


app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(process.env.PORT || 3333);