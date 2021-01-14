import Knex from 'knex';

export async function up(knex: Knex){
    try{
        return knex.schema.createTable('libraries', table => {
            table.increments('id').primary();
            table.string('image').notNullable();
            table.string('name').notNullable();
            table.string('login').notNullable().unique();
            table.string('email').notNullable();
            table.string('phone').notNullable();
            table.decimal('latitude').notNullable();
            table.decimal('longitude').notNullable();
            table.string('city').notNullable();
            table.string('uf', 2).notNullable();
        });
    }catch (error){
        console.log(error.message);
    }
    
    
}

export async function down(knex: Knex){
    return knex.schema.dropTable('libraries');
}