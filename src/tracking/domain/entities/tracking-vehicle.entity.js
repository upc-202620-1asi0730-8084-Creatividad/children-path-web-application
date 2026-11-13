/**
 * TrackingVehicle entity within the Tracking bounded context.
 * Represents a live-tracked vehicle in the fleet.
 *
 * @class TrackingVehicle
 */
export class TrackingVehicle {
    constructor({
                    id = null,
                    vehicleId = '',
                    plate = '',
                    driverName = '',
                    routeName = '',
                    schoolName = '',
                    district = '',
                    status = 'on-route',
                    latitude = 0,
                    longitude = 0,
                    speedKmh = 0,
                    etaMinutes = 0,
                    progressPercent = 0,
                    signalStrength = 0,
                    studentCount = 0,
                    nextStop = '',
                    deviationMeters = 0,
                    lastUpdate = ''
                } = {}) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.plate = plate;
        this.driverName = driverName;
        this.routeName = routeName;
        this.schoolName = schoolName;
        this.district = district;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speedKmh = speedKmh;
        this.etaMinutes = etaMinutes;
        this.progressPercent = progressPercent;
        this.signalStrength = signalStrength;
        this.studentCount = studentCount;
        this.nextStop = nextStop;
        this.deviationMeters = deviationMeters;
        this.lastUpdate = lastUpdate;
    }

    get shortId() {
        return this.vehicleId.slice(-3);
    }
}