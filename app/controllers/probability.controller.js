const ProbabilityController = {}
const MasterDataModel = require('../models/MasterData.model');
const parseResponse = require('../helpers/parse-response')
const log = 'Probability controller';

ProbabilityController.getProbabilityController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Probability Controller`);

    try {
        let dbProbability = await MasterDataModel.getAll('probability', '*');

        // success
        res.status(200).send(
            parseResponse(true, dbProbability, '00', 'Get Probability Controller Success')
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

ProbabilityController.getProbabilityByIDController = async (req, res, next) => {
    console.log(`├── ${log} :: Get Probability By ID Controller`);

    try {
        let { id } = req.body
        let where = [{ key: 'ProbabilityID', value: id }]

        let sql = await MasterDataModel.getAll('probability', '*', where)

        // success
        res.status(200).send(
            parseResponse(true, sql, '00', 'Get Probability By ID Controller Success')
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

ProbabilityController.ActionProbabilityController = async (req, res, next) => {
    console.log(`├── ${log} :: Action Probability Data Controller`);

    try {

        let { action, namaProbability } = req.body

        if (action == "create") {
            let condition = [{ key: 'Name', value: namaProbability }]
            let checkProbability = await MasterDataModel.getAll('probability', '*', condition)

            if (checkProbability.length > 0) {
                // Probability already exists
                statusCode = 200
                responseCode = '04'
                message = 'Probability already exists !'
                acknowledge = false
                result = null
            } else {
                let data = [{ key: 'Name', value: namaProbability }]
                let insert = await MasterDataModel.save('probability', data);

                if (insert.success == true) {
                    statusCode = 200
                    responseCode = '00'
                    message = 'Insert Probability Data Controller Success'
                    acknowledge = true
                    result = data
                }
            }

            res.status(statusCode).send(
                parseResponse(acknowledge, result, responseCode, message)
            )

        } else if (action == "update") {
            let { id, namaProbability } = req.body
            let condition = [{ key: 'ProbabilityID', value: id }]
            let oldProbability = await MasterDataModel.getAll('probability', 'Name', condition)

            if (namaProbability == oldProbability[0].Name) {
                let where = [{ key: 'ProbabilityID', value: id }]
                let data = [{ key: 'Name', value: namaProbability }]

                let update = await MasterDataModel.save('probability', data, where)
                if (update.success == true) {
                    res.status(200).send(
                        parseResponse(true, data, '00', 'Update Probability Data Controller Success')
                    )
                }
            } else {
                let newCondition = [{ key: 'Name', value: namaProbability }]
                let newProbability = await MasterDataModel.getAll('probability', '*', newCondition)

                if (!newProbability.length > 0) {
                    let where = [{ key: 'ProbabilityID', value: id }]
                    let data = [{ key: 'Name', value: namaProbability }]

                    let update = await MasterDataModel.save('probability', data, where)
                    if (update.success == true) {
                        res.status(200).send(
                            parseResponse(true, data, '00', 'Update Probability Data Controller Success')
                        )
                    }
                } else {
                    statusCode = 200
                    responseCode = '04'
                    message = 'Probability Already Exist'
                    acknowledge = false
                    result = null

                    res.status(statusCode).send(
                        parseResponse(acknowledge, result, responseCode, message)
                    )
                }
            }

        } else if (action == "delete") {
            let { id } = req.body
            let where = [{ key: 'ProbabilityID', value: id }]
            let hapus = await MasterDataModel.delete('probability', where)

            if (hapus.success == true) {
                res.status(200).send(
                    parseResponse(true, where, '00', 'Delete Probability Data Controller Success')
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

module.exports = ProbabilityController