/**
 * Student entity within the Students bounded context.
 * Represents a student enrolled in the school transport service.
 *
 * @class Student
 */
export class Student {
    constructor({
                    id = null,
                    code = '',
                    firstName = '',
                    lastName = '',
                    grade = '',
                    school = '',
                    guardianName = '',
                    guardianPhone = '',
                    guardianEmail = '',
                    emergencyContact = '',
                    routeName = null,
                    routeCode = null,
                    assignedVehicle = null,
                    assignedDriver = null,
                    pickupPoint = null,
                    dropOffPoint = null,
                    pickupWindow = null,
                    authorizationStatus = 'pending',
                    attendanceRate = 0,
                    lastAttendanceStatus = 'pending',
                    status = 'unassigned',
                    notes = ''
                } = {}) {
        this.id = id;
        this.code = code;
        this.firstName = firstName;
        this.lastName = lastName;
        this.grade = grade;
        this.school = school;
        this.guardianName = guardianName;
        this.guardianPhone = guardianPhone;
        this.guardianEmail = guardianEmail;
        this.emergencyContact = emergencyContact;
        this.routeName = routeName;
        this.routeCode = routeCode;
        this.assignedVehicle = assignedVehicle;
        this.assignedDriver = assignedDriver;
        this.pickupPoint = pickupPoint;
        this.dropOffPoint = dropOffPoint;
        this.pickupWindow = pickupWindow;
        this.authorizationStatus = authorizationStatus;
        this.attendanceRate = attendanceRate;
        this.lastAttendanceStatus = lastAttendanceStatus;
        this.status = status;
        this.notes = notes;
    }

    get fullName() {
        return `${this.firstName}${this.lastName}`.trim();
    }

    get initials() {
        return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
    }
}
