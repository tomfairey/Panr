require('dotenv').config({ path: '../../.env' });
import mariadb from 'mariadb';

const pools = {
    panr: mariadb.createPool({
        host: process.env.databaseHost,
        user: process.env.databaseUser,
        password: process.env.databasePassword,
        database: 'panr',
        connectionLimit: 10
    })
};

const connect = async (database) => {
    if(!pools.hasOwnProperty(database.toLowerCase())) throw new Error("NO_POOL_FOR_SPECIFIED_DB");

    let conn = await pools[database].getConnection();

    return {pool: null, conn};
};

const disconnect = async (pool, conn) => {
    conn ? await conn.release() : null;
    pool ? await pool.end() : null;

    return;
};

export default {
    query: async (database, query, data = []) => {
        let db = await connect(database);

        db.conn.beginTransaction();

        let queryResult;

        try {
            queryResult = await db.conn.query(query, data);
            
            db.conn.commit();
        } catch(e) {
            db.conn.rollback();

            throw e;
        } finally {
            await disconnect(db.pool, db.conn);
        }

        return queryResult;
    },
    syncQuery: (database, query) => {
        return connect(database).then((db) => {
            db.conn.beginTransaction();

            let output;

            db.conn.query(query).then((queryResult) => {
                db.conn.commit();
                output = queryResult;
            }).catch((e) => {
                console.warn(e);
                db.conn.rollback();
            }).then(() => {
                disconnect(db.pool, db.conn).then(() => {
                    return output;
                });
            });
        }).then((output) => {
            return output;
        })
    },
    batchInsert: async (database, query, data = []) => {
        let db = connect(database);

        db.conn.beginTransaction();

        let queryResult;

        try {
            queryResult = await db.conn.batch(query, data);
            
            db.conn.commit();
        } catch(e) {
            console.warn(e);
            db.conn.rollback();
        } finally {
            await disconnect(db.pool, db.conn);
        }

        return queryResult;
    }
};