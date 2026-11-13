/**
 * SchoolRoute entity within the Routes bounded context.
 * Represents a school transport route with its operational configuration.
 *
 * @class SchoolRoute
 */
export class SchoolRoute {
    constructor({
                    id = null,
                    code = '',
                    name = '',
                    district = '',
                    school = '',
                    scheduleLabel = '',
                    startTime = '',
                    endTime = '',
                    assignedDriver = '',
                    assignedVehicle = '',
                    assignedStudents = 0,
                    vehicleCapacity = 0,
                    stops = 0,
                    coveragePercentage = 0,
                    optimizationScore = 0,
                    estimatedDuration = '',
                    status = 'scheduled',
                    nextServiceAt = '',
                    lastOptimizedAt = '',
                    needsOptimization = false,
                    checkpoints = [],
                    coordinates = [],
                    schoolCoordinates = { lat: -12.105, lng: -77.015 },
                    color = '#1b83c9'
                } = {}) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.district = district;
        this.school = school;
        this.scheduleLabel = scheduleLabel;
        this.startTime = startTime;
        this.endTime = endTime;
        this.assignedDriver = assignedDriver;
        this.assignedVehicle = assignedVehicle;
        this.assignedStudents = assignedStudents;
        this.vehicleCapacity = vehicleCapacity;
        this.stops = stops;
        this.coveragePercentage = coveragePercentage;
        this.optimizationScore = optimizationScore;
        this.estimatedDuration = estimatedDuration;
        this.status = status;
        this.nextServiceAt = nextServiceAt;
        this.lastOptimizedAt = lastOptimizedAt;
        this.needsOptimization = needsOptimization;
        this.checkpoints = checkpoints;
        this.coordinates = coordinates;
        this.schoolCoordinates = schoolCoordinates;
        this.color = color;
    }

    get capacityUsage() {
        if (!this.vehicleCapacity) return 0;
        return Math.min(100, Math.round((this.assignedStudents / this.vehicleCapacity) * 100));
    }
}