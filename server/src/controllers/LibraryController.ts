import {Request, Response} from 'express';
import knex from '../database/connection';
const paginate = require('jw-paginate');

const mobile = process.env.SERVER_MOBILE_HOST;

class LibraryController {
    async create(request: Request, response: Response){
        const trx = await knex.transaction();
        
        try {
            const {
                name,
                login, 
                email,
                phone,
                latitude,
                longitude,
                city,
                uf
            } = request.body;
    
            const library = {
                image: request.file.filename,
                name,
                login,
                email,
                phone,
                latitude,
                longitude,
                city,
                uf
            };
    
            const insertedIds = await trx('libraries').insert(library);
        
            const id_library = insertedIds[0];
    
            await trx.commit();
    
            return response.json({
                id: id_library,
                ...library, 
            });
        } catch (error){
            await trx.rollback();
            
            response.json({
                error: true,
                message: error.message
              }); 
        }
    }

    // Página inicial da Biblioteca, Lista todos os livros a ela pertencentes
    async show(request: Request, response: Response) {

        const {id} = request.params;

        const page = request.query.page || 0;

        const library = await knex('libraries').where('id', id).first();

        if (!library){
            return response.status(400).json({message: 'Library is not found.'});
        }

        const serializedLibrary = {
            ...library,
            image_url: `http://${mobile}:3333/uploads/${library.image}`,
        };

        const books = await knex('books')
            .join('libraries', 'books.id_library', '=', 'libraries.id')
            .where('libraries.id', id)
            .select('books.id', 'books.title', "books.author", "books.publisher", "books.image");

        const serializedBooks = books.map(book => {
            return {
                ...book,
            image_url: `http://${mobile}:3333/uploads/${book.image}`,
            };
        });

        if (page == 0){
            return response.json({
                library: serializedLibrary, serializedBooks
            });
        }else {
            const pager = paginate(serializedBooks.length, page, 2);

            const pageOfBooks = serializedBooks.slice(pager.startIndex, pager.endIndex + 1);

            return response.json({
                library: serializedLibrary, pageOfBooks});
        }
    }

    // Filtro de Biblioteca (Mobile)
    async index (request: Request, response: Response){
        // Filtro: Cidade, UF, Nome
        const {city, uf, name} = request.query;

        const libraries = await knex('libraries')
            .where('city', String(city))
            .orWhere('uf', String(uf))
            .orWhere('name', String(name))
            .distinct();

        const serializedLibraries = libraries.map(library => {
            return {
                ...library,
            image_url: `http://${mobile}:3333/uploads/${library.image}`,
            };
        });

        return response.json(serializedLibraries);
    }
}

export default LibraryController;