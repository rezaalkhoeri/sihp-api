const ComplianceStatusController = {}
const MasterDataModel = require('../models/MasterData.model');
const parseResponse = require('../helpers/parse-response')
const log = 'Compliance Status controller';

ComplianceStatusController.getComplianceStatusController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Compliance Status Controller`);

    try {
        let dbComplianceStatus = await MasterDataModel.getAll('compliancestatus', '*');

        // success
        res.status(200).send(
            parseResponse(true, dbComplianceStatus, '00', 'Get Compliance Status Controller Success')
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

ComplianceStatusController.getComplianceStatusByIDController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Compliance Status By ID Controller`);

    try {
        let { id } = req.body
        let where = [{ key: 'StatusID', value: id }]

        let sql = await MasterDataModel.getAll('compliancestatus', '*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Compliance Status By ID Controller Success')
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

ComplianceStatusController.ActionComplianceStatusController = async (req, res, next) => {
    console.log(`├── ${log} :: Action Compliance Status Data Controller`);

    try {

        let { action, namaStatus } = req.body

        if (action == "create") {
            let condition = [{ key: 'Name', value: namaStatus }]
            let checkComplianceStatus = await MasterDataModel.getAll('compliancestatus', '*', condition)

            if (checkComplianceStatus.length > 0) {
                // ComplianceStatus already exists
                statusCode = 200
                responseCode = '04'
                message = 'Compliance Status already exists !'
                acknowledge = false
                result = null

            } else {
                let data = [{ key: 'Name', value: namaStatus }]
                let insert = await MasterDataModel.save('compliancestatus', data);

                if (insert.success == true) {
                    statusCode = 200
                    responseCode = '00'
                    message = 'Insert Compliance Status Data Controller Success'
                    acknowledge = true
                    result = data
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id, namaStatus } = req.body
            let condition = [{ key: 'StatusID', value: id }]
            let oldName = await MasterDataModel.getAll('compliancestatus', 'Name', condition)

            if (namaStatus == oldName[0].Name) {
                let where = [{ key: 'StatusID', value: id }]
                let data = [{ key: 'Name', value: namaStatus }]

                let update = await MasterDataModel.save('compliancestatus', data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Compliance Status Data Controller Success')
                    )
                }
            } else {
                let newCondition = [{ key: 'Name', value: namaStatus }]
                let newStatus = await MasterDataModel.getAll('compliancestatus', '*', newCondition)

                if (!newStatus.length > 0) {
                    let where = [{ key: 'StatusID', value: id }]
                    let data = [{ key: 'Name', value: namaStatus }]

                    let update = await MasterDataModel.save('compliancestatus', data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Compliance Status Data Controller Success')
                        )
                    }
                 } else {
                    statusCode = 200
                    responseCode = '04'
                    message = 'Compliance Status Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{ key: 'StatusID', value: id }]
            let hapus = await MasterDataModel.delete('compliancestatus', where)

            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, where, '00', 'Delete Compliance Status Data Controller Success')
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

module.exports = ComplianceStatusController