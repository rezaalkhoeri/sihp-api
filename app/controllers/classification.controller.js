const ClassificationController = {}
const MasterDataModel = require('../models/MasterData.model');
const parseResponse = require('../helpers/parse-response')
const log = 'Classification controller';

ClassificationController.getClassificationController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Classification Controller`);

    try {
        let dbClassification = await MasterDataModel.getAll('classification', '*');

        // success
        res.status(200).send(
            parseResponse(true, dbClassification, '00', 'Get Classification Controller Success')
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

ClassificationController.getClassificationByIDController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Classification By ID Controller`);

    try {
        let { id } = req.body
        let where = [{ key: 'ClassificationID', value: id }]

        let sql = await MasterDataModel.getAll('classification', '*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Classification By ID Controller Success')
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

ClassificationController.ActionClassificationController = async (req, res, next) => {
    console.log(`├── ${log} :: Action Classification Data Controller`);

    try {

        let { action, namaClassification } = req.body

        if (action == "create") {
            let condition = [{ key: 'Name', value: namaClassification }]
            let checkClassification = await MasterDataModel.getAll('classification', '*', condition)

            if (checkClassification.length > 0) {
                // Classification already exists
                statusCode = 200
                responseCode = '04'
                message = 'Classification already exists !'
                acknowledge = false
                result = null
            } else {
                let data = [{ key: 'Name', value: namaClassification }]
                let insert = await MasterDataModel.save('classification', data);

                if (insert.success == true) {
                    statusCode = 200
                    responseCode = '00'
                    message = 'Insert Classification Data Controller Success'
                    acknowledge = true
                    result = data
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id, namaClassification } = req.body
            let condition = [{ key: 'ClassificationID', value: id }]
            let oldClass = await MasterDataModel.getAll('classification', 'Name', condition)

            if (namaClassification == oldClass[0].Name) {
                let where = [{ key: 'ClassificationID', value: id }]
                let data = [{ key: 'Name', value: namaClassification }]

                let update = await MasterDataModel.save('classification', data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Classification Data Controller Success')
                    )
                }
            } else {
                let newCondition = [{ key: 'Name', value: namaClassification }]
                let newCat = await MasterDataModel.getAll('classification', '*', newCondition)

                if (!newCat.length > 0) {
                    let where = [{ key: 'ClassificationID', value: id }]
                    let data = [{ key: 'Name', value: namaClassification }]

                    let update = await MasterDataModel.save('classification', data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Classification Data Controller Success')
                        )
                    }
                } else {
                    statusCode = 200
                    responseCode = '04'
                    message = 'Classification Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{ key: 'ClassificationID', value: id }]
            let hapus = await MasterDataModel.delete('classification', where)

            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, where, '00', 'Delete Classification Data Controller Success')
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

module.exports = ClassificationController