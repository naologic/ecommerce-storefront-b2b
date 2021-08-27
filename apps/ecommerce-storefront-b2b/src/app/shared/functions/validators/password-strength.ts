import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Check: password strength
 *  > Checks if you have at least one lowercase character
 *                                one uppercase character
 *                                one number
 */
export function checkPasswordStrength(options = { lowerCase: 1, upperCase: 1, numeric: 1 }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        // -->Check:
        if (control.pristine || control.value === null) {
            return null;
        }

        // -->Test: string
        const lowercaseCount = control.value.match(/[a-z]/g)?.length ?? 0;
        const uppercaseCount = control.value.match(/[A-Z]/g)?.length ?? 0;
        const numericCount = control.value.match(/[0-9]/g)?.length ?? 0;

        // -->Check: if the options are meet
        if (lowercaseCount < options.lowerCase ||
            uppercaseCount < options.upperCase ||
            numericCount < options.numeric) {
            // -->Mark: as touched
            control.markAsTouched();
            // -->Return
            return { passwordNotStrongEnough: true }
        }

        return null;
    };
}
