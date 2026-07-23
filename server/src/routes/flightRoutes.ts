import { Router } from 'express';
import * as flightController from '../controllers/flightController.js';
import * as taxController from '../controllers/taxController.js';

const router = Router();

router.get('/locations', flightController.searchLocations);
router.post('/request-assistance', flightController.requestFlightAssistance);
router.post('/requests/:id/confirm-payment', flightController.confirmAssistancePayment);
router.get('/search', flightController.searchFlights);
router.get('/taxes', taxController.getAllTaxes);
router.get('/:id', flightController.getFlightDetails);

export default router;
