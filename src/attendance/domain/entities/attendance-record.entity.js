/**
 * Attendance record entity within the Attendance bounded context.
 * Tracks the current status of a student during a service day.
 *
 * @class AttendanceRecord
 */
export class AttendanceRecord {
    constructor({
                    id = null,
                    studentCode = '',
                    studentName = '',
                    grade = '',
                    routeName = '',
                    vehiclePlate = '',
                    driverName = '',
                    pickupPoint = '',
                    school = '',
                    estimatedArrival = '',
                    checkInTime = null,
                    dropOffTime = null,
                    status = 'waiting',
                    reliability = 0,
                    lastEvent = '',
                    notes = '',
                    guardianName = ''
                } = {}) {
        this.id = id;
        this.studentCode = studentCode;
        this.studentName = studentName;
        this.grade = grade;
        this.routeName = routeName;
        this.vehiclePlate = vehiclePlate;
        this.driverName = driverName;
        this.pickupPoint = pickupPoint;
        this.school = school;
        this.estimatedArrival = estimatedArrival;
        this.checkInTime = checkInTime;
        this.dropOffTime = dropOffTime;
        this.status = status;
        this.reliability = reliability;
        this.lastEvent = lastEvent;
        this.notes = notes;
        this.guardianName = guardianName;
    }

    /**
     * Avatar initials derived from the student name.
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