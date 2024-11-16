import knexObj from "knex"

const db = knexObj({
    client: 'mysql2',
    connection:{
        host: 'sql12.freesqldatabase.com',
        port: '3306',
        user: 'sql12745206',
        password: 'v8iGpKSphf',
        database: 'sql12745206'
    },
    pool : {min: 0, max: 7}
})

export default db;