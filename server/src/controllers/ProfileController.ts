import {Request, Response} from 'express';
import knex from '../database/connection';

class ProfileController {
    async index(request:Request, response:Response) {
        const library_id = request.headers.authorization || 1;
    
        const books = await knex('books')
            .join('libraries', 'books.id_library', '=', 'libraries.id')
            .where('libraries.id', library_id)
            .select('books.id', 'books.title', 'books.author', 'books.publisher', 'books.description');
    
      return response.json(books);
      }
}

export default ProfileController;