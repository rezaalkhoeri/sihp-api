const CriteriaController = {}
const MasterDataModel = require('../models/MasterData.model');
const parseResponse = require('../helpers/parse-response')
const log = 'Criteria controller';

CriteriaController.getCriteriaController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Criteria Controller`);

    try {
        let dbCriteria = await MasterDataModel.getAll('criteria', '*');

        // success
        res.status(200).send(
            parseResponse(true, dbCriteria, '00', 'Get Criteria Controller Success')
        )
    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

CriteriaController.getCriteriaByIDController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Criteria By ID Controller`);

    try {
        let { id } = req.body
        let where = [{ key: 'CriteriaID', value: id }]

        let sql = await MasterDataModel.getAll('criteria', '*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Criteria By ID Controller Success')
        )
    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

CriteriaController.ActionCriteriaController = async (req, res, next) => {
    console.log(`├── ${log} :: Action Criteria Data Controller`);

    try {

        let { action, namaCriteria } = req.body

        if (action == "create") {
            let condition = [{ key: 'Name', value: namaCriteria }]
            let checkCriteria = await MasterDataModel.getAll('criteria', '*', condition)

            if (checkCriteria.length > 0) {
                // Criteria already exists
                statusCode = 200
                responseCode = '04'
                message = 'Criteria already exists !'
                acknowledge = false
                result = null
            } else {
                let data = [{ key: 'Name', value: namaCriteria }]
                let insert = await MasterDataModel.save('criteria', data);

                if (insert.success == true) {
                    statusCode = 200
                    responseCode = '00'
                    message = 'Insert Criteria Data Controller Success'
                    acknowledge = true
                    result = data
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id, namaCriteria } = req.body
            let condition = [{ key: 'CriteriaID', value: id }]
            let oldCriteria = await MasterDataModel.getAll('criteria', 'Name', condition)

            if (namaCriteria == oldCriteria[0].Name) {
                let where = [{ key: 'CriteriaID', value: id }]
                let data = [{ key: 'Name', value: namaCriteria }]

                let update = await MasterDataModel.save('criteria', data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Criteria Data Controller Success')
                    )
                }
            } else {
                let newCondition = [{ key: 'Name', value: namaCriteria }]
                let newCriteria = await MasterDataModel.getAll('criteria', '*', newCondition)

                if (!newCriteria.length > 0) {
                    let where = [{ key: 'CriteriaID', value: id }]
                    let data = [{ key: 'Name', value: namaCriteria }]

                    let update = await MasterDataModel.save('criteria', data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Criteria Data Controller Success')
                        )
                    }
                } else {
                    statusCode = 200
                    responseCode = '04'
                    message = 'Criteria Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{ key: 'CriteriaID', value: id }]
            let hapus = await MasterDataModel.delete('criteria', where)

            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, where, '00', 'Delete Criteria Data Controller Success')
                )
            }
        } else {
            res.status(200).send(
                parseResponse(true, null, '404', 'Request Not Found')
            )
        }

    } catch (error) {
        console.log('Error exception :' + error)
        let resp = parseResponse(false, null, '99', error)
        next({
            resp,
            status: 500
        })
    }
}

module.exports = CriteriaController