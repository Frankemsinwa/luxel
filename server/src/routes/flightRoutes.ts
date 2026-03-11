import { Router } from 'express';
import * as flightController from '../controllers/flightController.js';

const router = Router();

router.get('/locations', flightController.searchLocations);
router.get('/search', flightController.searchFlights);
router.get('/:id', flightController.getFlightDetails);

export default router;
