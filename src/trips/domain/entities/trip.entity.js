/**
 * Trip entity within the Trips bounded context.
 * Represents a single operational trip in the school transport service.
 *
 * @class Trip
 */
export class Trip {
    constructor({
                    id = null,
                    code = '',
                    routeName = '',
                    vehiclePlate = '',
                    driverName = '',
                    school = '',
                    district = '',
                    shift = 'morning',
                    status = 'scheduled',
                    students = 0,
                    capacity = 18,
                    startTime = '',
                    estimatedEndTime = '',
                    actualEndTime = null,
                    nextStop = '',
                    completedStops = 0,
                    totalStops = 0,
                    progress = 0,
                    averageSpeed = 0,
                    attendanceRate = 0,
                    incidents = 0,
                    trackingStatus = 'ready',
                    validationMessage = '',
                    updatedAt = ''
                } = {}) {
        this.id = id;
        this.code = code;
        this.routeName = routeName;
        this.vehiclePlate = vehiclePlate;
        this.driverName = driverName;
        this.school = school;
        this.district = district;
        this.shift = shift;
        this.status = status;
        this.students = students;
        this.capacity = capacity;
        this.startTime = startTime;
        this.estimatedEndTime = estimatedEndTime;
        this.actualEndTime = actualEndTime;
        this.nextStop = nextStop;
        this.completedStops = completedStops;
        this.totalStops = totalStops;
        this.progress = progress;
        this.averageSpeed = averageSpeed;
        this.attendanceRate = attendanceRate;
        this.incidents = incidents;
        this.trackingStatus = trackingStatus;
        this.validationMessage = validationMessage;
        this.updatedAt = updatedAt;
    }

    get codeSuffix() {
        return this.code.split('-')[1] ?? '00';
    }

    get occupancyPercent() {
        if (!this.capacity) return 0;
        return Math.round((this.students / this.capacity) * 100);
    }
}
