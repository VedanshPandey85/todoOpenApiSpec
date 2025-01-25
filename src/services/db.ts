import {Pool} from 'pg';

const pool = new Pool({
    user : 'postgres',
    host : 'localhost',
    database : 'todoDatabase',
    password : '1234',
    port : 9999
})
export default pool;

