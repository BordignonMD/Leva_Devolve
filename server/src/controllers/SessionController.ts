import {Request, Response} from 'express';
import knex from '../database/connection';

class SessionController {
    async create(request: Request, response: Response) {
        const { login } = request.body
    
        const library = await knex('libraries')
          .where('login', login)
          .select('name', 'id')
          .first()
    
        if (!library) {
          return response.status(400).json({ error: 'No Library found with this login' })
        }
    
        return response.json(library)
    }
}

export default SessionController;