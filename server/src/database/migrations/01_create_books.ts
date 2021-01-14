import Knex from 'knex';

export async function up(knex: Knex){
    
    try {
        return knex.schema.createTable('books', table => {
            table.increments('id').primary();
            table.string('image').notNullable();
            table.string('title').notNullable();
            table.string('author').notNullable();
            table.string('description').notNullable();
            table.decimal('pageCount').notNullable();
            table.string('publisher').notNullable();
            table.date('publishedDate').notNullable();
            table.integer('id_library').unsigned().index().references('id').inTable('libraries');
        });
    }catch (error){
        console.log(error.message);
    }

    
}

export async function down(knex: Knex){
    return knex.schema.dropTable('books');
}