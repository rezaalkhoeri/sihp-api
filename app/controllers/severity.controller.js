const SeverityController = {}
const MasterDataModel = require('../models/MasterData.model');
const parseResponse = require('../helpers/parse-response')
const log = 'Severity controller';

SeverityController.getSeverityController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Severity Controller`);

    try {
        let dbSeverity = await MasterDataModel.getAll('severity', '*');

        // success
        res.status(200).send(
            parseResponse(true, dbSeverity, '00', 'Get Severity Controller Success')
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

SeverityController.getSeverityByIDController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Severity By ID Controller`);

    try {
        let { id } = req.body
        let where = [{ key: 'SeverityID', value: id }]

        let sql = await MasterDataModel.getAll('severity', '*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Severity By ID Controller Success')
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

SeverityController.ActionSeverityController = async (req, res, next) => {
    console.log(`├── ${log} :: Action Severity Data Controller`);

    try {

        let { action, namaSeverity } = req.body

        if (action == "create") {
            let condition = [{ key: 'Name', value: namaSeverity }]
            let checkSeverity = await MasterDataModel.getAll('severity', '*', condition)

            if (checkSeverity.length > 0) {
                // Severity already exists
                statusCode = 200
                responseCode = '04'
                message = 'Severity already exists !'
                acknowledge = false
                result = null
            } else {
                let data = [{ key: 'Name', value: namaSeverity }]
                let insert = await MasterDataModel.save('severity', data);

                if (insert.success == true) {
                    statusCode = 200
                    responseCode = '00'
                    message = 'Insert Severity Data Controller Success'
                    acknowledge = true
                    result = data
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id, namaSeverity } = req.body
            let condition = [{ key: 'SeverityID', value: id }]
            let oldSeverity = await MasterDataModel.getAll('severity', 'Name', condition)

            if (namaSeverity == oldSeverity[0].Name) {
                let where = [{ key: 'SeverityID', value: id }]
                let data = [{ key: 'Name', value: namaSeverity }]

                let update = await MasterDataModel.save('severity', data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Severity Data Controller Success')
                    )
                }
            } else {
                let newCondition = [{ key: 'Name', value: namaSeverity }]
                let newSeverity = await MasterDataModel.getAll('severity', '*', newCondition)

                if (!newSeverity.length > 0) {
                    let where = [{ key: 'SeverityID', value: id }]
                    let data = [{ key: 'Name', value: namaSeverity }]

                    let update = await MasterDataModel.save('severity', data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Severity Data Controller Success')
                        )
                    }
                } else {
                    statusCode = 200
                    responseCode = '04'
                    message = 'Severity Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{ key: 'SeverityID', value: id }]
            let hapus = await MasterDataModel.delete('severity', where)

            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, where, '00', 'Delete Severity Data Controller Success')
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

module.exports = SeverityController