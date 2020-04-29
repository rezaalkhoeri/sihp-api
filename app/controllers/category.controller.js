const CategoryController        = {}
const MasterDataModel           = require('../models/MasterData.model');
const parseResponse             = require('../helpers/parse-response')
const log                       = 'Category controller';

CategoryController.getCategoryController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Category Controller`);

    try{
        let dbCategory = await MasterDataModel.getAll('category','*');

        // success
        res.status(200).send(
            parseResponse(true, dbCategory, '00', 'Get Category Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

CategoryController.getCategoryByIDController = async(req, res, next) => {
    console.log(`├── ${log} :: Get Category By ID Controller`);

    try{
        let { id } = req.body
        let where = [{ key: 'CategoryID', value: id }]
        
        let sql = await MasterDataModel.getAll('category','*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Category By ID Controller Success')
        )
    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

CategoryController.ActionCategoryController = async(req, res, next) => {
    console.log(`├── ${log} :: Action Category Data Controller`);

    try {

        let { action, namaCategory } = req.body

        if (action == "create") {
            let condition = [{ key:'Name', value: namaCategory }]
            let checkCategory = await MasterDataModel.getAll('category','*',condition)
            
            if (checkCategory.length > 0) {
                // Category already exists
                statusCode      = 200
                responseCode    = '04'
                message         = 'Category already exists !'
                acknowledge     = false
                result          = null
            } else {
                let data = [{key : 'Name', value : namaCategory}]                
                let insert =  await MasterDataModel.save('category',data);
        
                if (insert.success == true) {
                    statusCode      = 200
                    responseCode    = '00'
                    message         = 'Insert Category Data Controller Success'
                    acknowledge     = true
                    result          = data    
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id, namaCategory } = req.body             
            let condition = [{ key: 'CategoryID', value: id }]
            let oldCat = await MasterDataModel.getAll('category','Name', condition)

            if (namaCategory == oldCat[0].Name) {
                let where = [{ key: 'CategoryID', value: id }]
                let data = [{ key: 'Name', value: namaCategory }]

                let update = await MasterDataModel.save('category',data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Category Data Controller Success')
                    )
                }
            } else {
                let newCondition = [{ key: 'Name', value: namaCategory }]
                let newCat = await MasterDataModel.getAll('category', '*', newCondition)

                if (!newCat.length > 0) {
                    let where = [{ key: 'CategoryID', value: id }]
                    let data = [{ key: 'Name', value: namaCategory }]

                    let update = await MasterDataModel.save('category',data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Category Data Controller Success')
                        )
                    }
                } else {
                    statusCode = 200
                    responseCode = '04'
                    message = 'Category Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{key:'CategoryID', value:id}]
            let hapus =  await MasterDataModel.delete('category',where)
            
            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, where, '00', 'Delete Category Data Controller Success')
                )
            }
        } else {
            res.status(200).send(
                parseResponse(true, null, '404', 'Request Not Found')
            )
        }

    } catch(error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

module.exports = CategoryController