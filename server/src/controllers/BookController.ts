import {Request, Response} from 'express';
import knex from '../database/connection';

const mobile = process.env.SERVER_MOBILE_HOST;

class BookController{
    // Criação/Adição de Livro
    async create(request: Request, response: Response){
        const {
            title,
            author, 
            description,
            pageCount,
            publisher,
            publishedDate
        } = request.body;

        const id_library = request.headers.authorization;
        const newImage = request.file ? request.file.filename : 'NotFound.jpg';

        const trx = await knex.transaction();

        const book = {
            image: newImage,
            title,
            author,
            description,
            pageCount,
            publisher,
            publishedDate,
            id_library
        }

        const insertedIds = await trx('books').insert(book);

        const id_book = insertedIds[0];

        await trx.commit();

        return response.json({
            id: id_book,
            ...book,
        });
    }

    // Listar livro específico
    async show(request: Request, response: Response) {
        const {id} = request.params;

        const book = await knex('books').where('id', id).first();

        if (!book){
            return response.status(400).json({message: 'Book is not found.'});
        }
        
        const library = await knex('books')
            .join('libraries', 'books.id_library', '=', 'libraries.id')
            .where('books.id', id)
            .select('libraries.name', 'libraries.email', 'libraries.phone', 'libraries.city', 'libraries.uf')
            .first()

        const serializedBook = {
            ...book,
            image_url: `http://${mobile}:3333/uploads/${book.image}`,
        };

        return response.json({
            book: serializedBook, library});
    }

    // Filtro Livros
    async index (request: Request, response: Response) {

        const {title, author} = request.query;

        const books = await knex('books')
            .where('title', String(title))
            .where('author', String(author))
            .distinct();

            const serializedBooks = books.map(book => {
                return {
                    ...book,
                    image_url: `http://${mobile}:3333/uploads/${book.image}`,
                };
            });

        return response.json(serializedBooks);
    }

    async delete(request:Request, response:Response) {
        const { id } = request.params;
        const id_library = request.headers.authorization || 1;

        const book = await knex('books')
            .where('id', id)
            .where('id_library', id_library)
            .select('title')
            .first()

        await knex('books').where('id', id).delete()

        return response.status(204).send()
    }
}

export default BookController;