
/**
 * Check: if a product is available
 */
const checkIfProductIsAvailable = (availability: string, available: boolean): boolean => {
    // -->Check: Availability
    if (availability === 'available') {
        return true;
    } else if (availability === 'request') {
        return true;
    } else if (availability === 'next-day') {
        return true
    } else if (availability === 'drop-ship-from-manufacturer') {
        return true
    } else if (availability && availability.endsWith('Days')) {
        return true
    } else return !availability && available;
};

export {
    checkIfProductIsAvailable
};
