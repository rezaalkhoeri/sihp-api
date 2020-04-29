const express                   = require('express')
const router                    = express.Router()
const { authentication }        = require('../middleware/auth.middleware')
const CategoryController        = require('../controllers/category.controller')
const ComplianceStatus          = require('../controllers/complianceStatus.controller')
const ClassificationController  = require('../controllers/classification.controller')
const CriteriaController        = require('../controllers/criteria.controller')
const PermitPeriodController    = require('../controllers/permitPeriod.controller')
const ProbabilityController     = require('../controllers/probability.controller')
const RelatedController         = require('../controllers/related.controller')
const SeverityController        = require('../controllers/severity.controller')

router
    .all('/*')
    // Category
    .get('/getCategory', CategoryController.getCategoryController)
    .post('/getCategoryByID', CategoryController.getCategoryByIDController)
    .post('/CategoryAction', CategoryController.ActionCategoryController)

    //Compliance Status 
    .get('/getCompStatus', ComplianceStatus.getComplianceStatusController)
    .post('/getCompStatusByID', ComplianceStatus.getComplianceStatusByIDController)
    .post('/ComplianceStatusAction', ComplianceStatus.ActionComplianceStatusController)

    // Classification
    .get('/getClassification', ClassificationController.getClassificationController)
    .post('/getClassificationByID', ClassificationController.getClassificationByIDController)
    .post('/ClassificationAction', ClassificationController.ActionClassificationController)

    // Criteria
    .get('/getCriteria', CriteriaController.getCriteriaController)
    .post('/getCriteriaByID', CriteriaController.getCriteriaByIDController)
    .post('/CriteriaAction', CriteriaController.ActionCriteriaController)

    // Permit Period
    .get('/getPermitPeriod', PermitPeriodController.getPermitPeriodController)
    .post('/getPermitPeriodByID', PermitPeriodController.getPermitPeriodByIDController)
    .post('/PermitPeriodAction', PermitPeriodController.ActionPermitPeriodController)

    // Probability
    .get('/getProbability', ProbabilityController.getProbabilityController)
    .post('/getProbabilityByID', ProbabilityController.getProbabilityByIDController)
    .post('/ProbabilityAction', ProbabilityController.ActionProbabilityController)

    // Related
    .get('/getRelated', RelatedController.getRelatedController)
    .post('/getRelatedByID', RelatedController.getRelatedByIDController)
    .post('/RelatedAction', RelatedController.ActionRelatedController)

    // Severity
    .get('/getSeverity', SeverityController.getSeverityController)
    .post('/getSeverityByID', SeverityController.getSeverityByIDController)
    .post('/SeverityAction', SeverityController.ActionSeverityController)

module.exports = router