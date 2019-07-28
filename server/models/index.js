import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const config = {
    user: 'postgres',
    database: 'wayfarer-api-db',
    password: process.env.password,
    port: 5432,
};

var pool = new pg.Pool(config);

if(process.env.NODE_ENV === 'production') pool = new pg.Pool({connectionString: process.env.DATABASE_URL, ssl: true,});

const db = {
    query(text, params){
      return new Promise((resolve, reject) => {
        pool.query(text, params)
        .then(response => resolve(response))
        .catch((err) => reject(err));
      })
    }
}
export default db;
