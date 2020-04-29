const RelatedController = {}
const MasterDataModel = require('../models/MasterData.model');
const parseResponse = require('../helpers/parse-response')
const log = 'Related controller';

RelatedController.getRelatedController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Related Controller`);

    try {
        let dbRelated = await MasterDataModel.getAll('related', '*');

        // success
        res.status(200).send(
            parseResponse(true, dbRelated, '00', 'Get Related Controller Success')
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

RelatedController.getRelatedByIDController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Related By ID Controller`);

    try {
        let { id } = req.body
        let where = [{ key: 'RelatedID', value: id }]

        let sql = await MasterDataModel.getAll('related', '*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Related By ID Controller Success')
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

RelatedController.ActionRelatedController = async (req, res, next) => {
    console.log(`├── ${log} :: Action Related Data Controller`);

    try {

        let { action, namaRelated } = req.body

        if (action == "create") {
            let condition = [{ key: 'Name', value: namaRelated }]
            let checkRelated = await MasterDataModel.getAll('related', '*', condition)

            if (checkRelated.length > 0) {
                // Related already exists
                statusCode = 200
                responseCode = '04'
                message = 'Related already exists !'
                acknowledge = false
                result = null
            } else {
                let data = [{ key: 'Name', value: namaRelated }]
                let insert = await MasterDataModel.save('related', data);

                if (insert.success == true) {
                    statusCode = 200
                    responseCode = '00'
                    message = 'Insert Related Data Controller Success'
                    acknowledge = true
                    result = data
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id, namaRelated } = req.body
            let condition = [{ key: 'RelatedID', value: id }]
            let oldRelated = await MasterDataModel.getAll('related', 'Name', condition)

            if (namaRelated == oldRelated[0].Name) {
                let where = [{ key: 'RelatedID', value: id }]
                let data = [{ key: 'Name', value: namaRelated }]

                let update = await MasterDataModel.save('related', data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Related Data Controller Success')
                    )
                }
            } else {
                let newCondition = [{ key: 'Name', value: namaRelated }]
                let newRelated = await MasterDataModel.getAll('related', '*', newCondition)

                if (!newRelated.length > 0) {
                    let where = [{ key: 'RelatedID', value: id }]
                    let data = [{ key: 'Name', value: namaRelated }]

                    let update = await MasterDataModel.save('related', data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Related Data Controller Success')
                        )
                    }
                } else {
                    statusCode = 200
                    responseCode = '04'
                    message = 'Related Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{ key: 'RelatedID', value: id }]
            let hapus = await MasterDataModel.delete('related', where)

            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, where, '00', 'Delete Related Data Controller Success')
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

module.exports = RelatedController