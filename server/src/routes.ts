import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import {celebrate, Joi} from 'celebrate';

import LibraryController from './controllers/LibraryController';
import BookController from './controllers/BookController';
import SessionController from './controllers/SessionController';
import ProfileController from './controllers/ProfileController';

const libraryController = new LibraryController();
const bookController = new BookController();
const sessionController = new SessionController();
const profileController = new ProfileController();

const routes = express.Router();

const upload = multer(multerConfig);

routes.get('/', (request, response) => {
    return response.json({message: 'Hello World'});
});

routes.post(
    '/library', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            login: Joi.string().required(),
            phone: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2)
        })
    }, {
        abortEarly: false
    }),
    libraryController.create
);

routes.get('/library/:id', libraryController.show);
routes.get('/library', libraryController.index);

routes.post('/book', upload.single('image'), bookController.create);
routes.get('/book/:id', bookController.show);
routes.get('/book', bookController.index);
routes.delete('/book/:id', bookController.delete);

routes.post('/session', sessionController.create);

routes.get('/profile', profileController.index);

export default routes;