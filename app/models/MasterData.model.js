const CoreDB                = require('../lib/Coredb');
const CategoryModel         = {}

CategoryModel.save = async (table, data, condition = []) => {
    let result  = null;

    CoreDB.setTable(table);
    if (condition.length > 0) {
        result  = await CoreDB.update(data, condition);
    } else {
        result  = await CoreDB.create(data);
    }

    return result;
}

CategoryModel.delete = async (table, condition) => {
    CoreDB.setTable(table);

    return await CoreDB.delete(condition);
}

CategoryModel.getBy = async (table, fields = '*', condition, join = [], group = []) => {
    CoreDB.setTable(table);

    return await CoreDB.getBy(fields, condition, join, group);
}

CategoryModel.getAll = async (table, fields = '*', condition = [], join = [], group = [], sort = []) => {
    CoreDB.setTable(table);

    return await CoreDB.getAll(fields, condition, join, group, sort);
}

CategoryModel.getPaging = async (fields = '*', condition = [], join = [], group = [], sort = [], page = 1) => {
    CoreDB.setTable(table);

    return await CoreDB.getPaging(fields, condition, join, group, sort, page, 2);
}

CategoryModel.QueryCustom = async (query, value = []) => {
    return await CoreDB.query(query, value);
}

module.exports  = CategoryModel;
