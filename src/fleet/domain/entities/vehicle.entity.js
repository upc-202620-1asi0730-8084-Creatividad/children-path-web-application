/**
 * Vehicle entity within the Fleet bounded context.
 * Represents a physical transportation unit in the fleet.
 *
 * @class Vehicle
 */
export class Vehicle {
    constructor({
                    id = null,
                    plate = '',
                    code = '',
                    brand = '',
                    model = '',
                    year = new Date().getFullYear(),
                    capacity = 0,
                    assignedStudents = 0,
                    driverName = '',
                    routeName = '',
                    status = 'available',
                    energyType = 'gasoline',
                    ownershipType = 'company',
                    nextMaintenanceDate = '',
                    lastInspectionDate = '',
                    mileageKm = 0,
                    availabilityScore = 100,
                    documentsValid = true
                } = {}) {
        this.id = id;
        this.plate = plate;
        this.code = code;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.capacity = capacity;
        this.assignedStudents = assignedStudents;
        this.driverName = driverName;
        this.routeName = routeName;
        this.status = status;
        this.energyType = energyType;
        this.ownershipType = ownershipType;
        this.nextMaintenanceDate = nextMaintenanceDate;
        this.lastInspectionDate = lastInspectionDate;
        this.mileageKm = mileageKm;
        this.availabilityScore = availabilityScore;
        this.documentsValid = documentsValid;
    }

    /**
     * Percentage of capacity used by assigned students.
     * @returns {number}
     */
    get capacityUsage() {
        if (!this.capacity) return 0;
        return Math.min(Math.round((this.assignedStudents / this.capacity) * 100), 100);
    }
}