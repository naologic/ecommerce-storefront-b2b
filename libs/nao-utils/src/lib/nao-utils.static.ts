import { isString, isArray } from 'lodash';
/**
 * Generate a random string
 */
function generateRandomString(len = 5, adds: string|string[] = null, sepp = '-'): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    if (isString(adds) && !isArray(adds)) {
        adds = [adds] as string[];
    }
    if (isArray(adds)) {
        // @ts-ignore
        return `${adds.join(sepp)}${text}`.toLowerCase();
    }

    return text.toLowerCase();
}

export {
    generateRandomString
}
