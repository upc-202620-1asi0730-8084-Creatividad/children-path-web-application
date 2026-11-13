/**
 * Driver entity within the Drivers bounded context.
 * Represents a school transport driver with license and assignment data.
 *
 * @class Driver
 */
export class Driver {
    constructor({
                    id = null,
                    code = '',
                    fullName = '',
                    photoInitials = '',
                    licenseNumber = '',
                    licenseClass = '',
                    licenseExpiresAt = '',
                    phone = '',
                    email = '',
                    assignedVehicle = '',
                    assignedRoute = '',
                    status = 'available',
                    availabilityLabel = '',
                    tripsToday = 0,
                    studentsAssigned = 0,
                    safetyScore = 0,
                    punctualityScore = 0,
                    lastCheckIn = '',
                    documentsValid = true,
                    yearsOfExperience = 0
                } = {}) {
        this.id = id;
        this.code = code;
        this.fullName = fullName;
        this.photoInitials = photoInitials;
        this.licenseNumber = licenseNumber;
        this.licenseClass = licenseClass;
        this.licenseExpiresAt = licenseExpiresAt;
        this.phone = phone;
        this.email = email;
        this.assignedVehicle = assignedVehicle;
        this.assignedRoute = assignedRoute;
        this.status = status;
        this.availabilityLabel = availabilityLabel;
        this.tripsToday = tripsToday;
        this.studentsAssigned = studentsAssigned;
        this.safetyScore = safetyScore;
        this.punctualityScore = punctualityScore;
        this.lastCheckIn = lastCheckIn;
        this.documentsValid = documentsValid;
        this.yearsOfExperience = yearsOfExperience;
    }

    /**
     * Derives initials from fullName if photoInitials is empty.
     * @returns {string}
     */
    get initials() {
        if (this.photoInitials) return this.photoInitials;
        return this.fullName
            .split(' ')
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }
}