const PermitPeriodController = {}
const MasterDataModel = require('../models/MasterData.model');
const parseResponse = require('../helpers/parse-response')
const log = 'Permit Period controller';

PermitPeriodController.getPermitPeriodController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Permit Period Controller`);

    try {
        let dbPermitPeriod = await MasterDataModel.getAll('permitperiod', '*');

        // success
        res.status(200).send(
            parseResponse(true, dbPermitPeriod, '00', 'Get Permit Period Controller Success')
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

PermitPeriodController.getPermitPeriodByIDController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Permit Period By ID Controller`);

    try {
        let { id } = req.body
        let where = [{ key: 'PermitPeriodID', value: id }]

        let sql = await MasterDataModel.getAll('permitperiod', '*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Permit Period By ID Controller Success')
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

PermitPeriodController.ActionPermitPeriodController = async (req, res, next) => {
    console.log(`├── ${log} :: Action Permit Period Data Controller`);

    try {

        let { action, namaPermitPeriod } = req.body

        if (action == "create") {
            let condition = [{ key: 'Name', value: namaPermitPeriod }]
            let checkPermitPeriod = await MasterDataModel.getAll('permitperiod', '*', condition)

            if (checkPermitPeriod.length > 0) {
                // PermitPeriod already exists
                statusCode = 200
                responseCode = '04'
                message = 'Permit Period already exists !'
                acknowledge = false
                result = null
            } else {
                let data = [{ key: 'Name', value: namaPermitPeriod }]
                let insert = await MasterDataModel.save('permitperiod', data);

                if (insert.success == true) {
                    statusCode = 200
                    responseCode = '00'
                    message = 'Insert Permit Period Data Controller Success'
                    acknowledge = true
                    result = data
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id, namaPermitPeriod } = req.body
            let condition = [{ key: 'PermitPeriodID', value: id }]
            let oldPermitPeriod = await MasterDataModel.getAll('permitperiod', 'Name', condition)

            if (namaPermitPeriod == oldPermitPeriod[0].Name) {
                let where = [{ key: 'PermitPeriodID', value: id }]
                let data = [{ key: 'Name', value: namaPermitPeriod }]

                let update = await MasterDataModel.save('permitperiod', data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Permit Period Data Controller Success')
                    )
                }
            } else {
                let newCondition = [{ key: 'Name', value: namaPermitPeriod }]
                let newPermitPeriod = await MasterDataModel.getAll('permitperiod', '*', newCondition)

                if (!newPermitPeriod.length > 0) {
                    let where = [{ key: 'PermitPeriodID', value: id }]
                    let data = [{ key: 'Name', value: namaPermitPeriod }]

                    let update = await MasterDataModel.save('permitperiod', data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Permit Period Data Controller Success')
                        )
                    }
                } else {
                    statusCode = 200
                    responseCode = '04'
                    message = 'Permit Period Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{ key: 'PermitPeriodID', value: id }]
            let hapus = await MasterDataModel.delete('permitperiod', where)

            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, where, '00', 'Delete Permit Period Data Controller Success')
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

module.exports = PermitPeriodController