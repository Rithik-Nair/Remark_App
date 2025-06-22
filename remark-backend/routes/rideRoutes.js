const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

router.post('/request', rideController.requestRide);
router.get('/', rideController.getAllRides)
router.post('/assign', rideController.assignDriver);
router.post('/status', rideController.updateRideStatus);
router.get('/driver/:driver_id', rideController.getRidesByDriver);
router.get('/rider/:rider_id', rideController.getRidesByRider);
router.put('/assign/:ride_id', rideController.assignDriverToRide);

router.put('/:id/assign', rideController.assignDriverToRide);


module.exports = router;
