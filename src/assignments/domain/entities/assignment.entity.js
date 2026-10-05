/**
 * Assignment entity within the Assignments bounded context.
 * Links a student to a route, vehicle and driver for a specific shift.
 *
 * @class Assignment
 */
export class Assignment {
    constructor({
                    id = null,
                    studentCode = '',
                    studentName = '',
                    grade = '',
                    guardianName = '',
                    routeCode = '',
                    routeName = '',
                    vehiclePlate = '',
                    driverName = '',
                    shift = 'morning',
                    pickupPoint = '',
                    pickupWindow = '',
                    capacityUsage = 0,
                    validationScore = 0,
                    validation = 'ready',
                    status = 'pending',
                    lastUpdated = '',
                    notes = ''
                } = {}) {
        this.id = id;
        this.studentCode = studentCode;
        this.studentName = studentName;
        this.grade = grade;
        this.guardianName = guardianName;
        this.routeCode = routeCode;
        this.routeName = routeName;
        this.vehiclePlate = vehiclePlate;
        this.driverName = driverName;
        this.shift = shift;
        this.pickupPoint = pickupPoint;
        this.pickupWindow = pickupWindow;
        this.capacityUsage = capacityUsage;
        this.validationScore = validationScore;
        this.validation = validation;
        this.status = status;
        this.lastUpdated = lastUpdated;
        this.notes = notes;
    }

    /**
     * Initials to display on avatar (e.g. "MV" for María Vega).
     * @returns {string}
     */
    get initials() {
        return this.studentName
            .split(' ')
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }
}