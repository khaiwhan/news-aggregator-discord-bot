const { db } = require("../db/config")

const query_async = async (query, parameter = {}) => {
    try {
        return await db.many(query, parameter)
    }
    catch (ex) {
        return []
    }
}

const query_first_of_default_async = async (query, parameter = {}) => {
    try {
        return await db.one(query, parameter)
    }
    catch (ex) {
        return {}
    }
}

const execute_async = async (query, parameter = {}) => {
    try {
        await db.none(query, parameter)
        return 1
    }
    catch (ex) {
        console.log(ex)
        return 0
    }
}

const batch_async = async (query, data) => {
    try {
        if (Array.isArray(data)) {
            await db.tx(async t => {
                const queries = data.map(d => t.none(query, d));
                await t.batch(queries);
            });

            return 1
        }

        return 0
    }
    catch (error) {
        console.log(error)
        return 0
    }
};

const set_default_timezone = async (timezone) => {
    await query_first_of_default_async(`SET TIMEZONE = '${timezone}'; SHOW TIMEZONE`)
}

module.exports = { query_async, query_first_of_default_async, execute_async, batch_async, set_default_timezone }