/**
 * https://medium.muz.li/the-science-of-color-contrast-an-expert-designers-guide-33e84c41d156
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */

export type RgbColor = [number, number, number];
export type ColorType = 'white'|'light'|'dark'|'black';

export function hexToRgb(hex: string): RgbColor|null {
    if (!/^#(([A-Fa-f0-9]{3}){1,2})$/.test(hex)) {
        return null;
    }

    hex = hex.substr(1);
    let rgb;

    if (hex.length === 3) {
        const matches = hex.match(/./g);

        if (matches === null) {
            return null;
        }

        rgb = matches.map(x => x + x);
    } else {
        rgb = hex.match(/.{2}/g);

        if (rgb === null) {
            return null;
        }
    }

    return rgb.map(x => parseInt(x, 16)) as RgbColor;
}

export function luminance(color: string): number|null {
    let rgb = hexToRgb(color);

    if (!rgb) {
        return null;
    }

    rgb = rgb.map(x => x / 255).map(x => {
        if (x <= 0.03928) {
            return x / 12.92;
        } else {
            return Math.pow((x + 0.055) / 1.055, 2.4);
        }
    }) as RgbColor;

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export function contrast(color1: string, color2: string): number|null {
    const l1 = luminance(color1);
    const l2 = luminance(color2);

    if (l1 === null || l2 === null) {
        return null;
    }

    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const cache: {[color: string]: ColorType} = {};

export function colorType(color: string): ColorType {
    if (color in cache) {
        return cache[color];
    }

    const whiteContras = contrast(color, '#fff');
    const blackContras = contrast(color, '#000');
    let result: ColorType;

    if (whiteContras === null || blackContras === null) {
        result = 'white';
    } else if (whiteContras === 1 && blackContras === 21) {
        result = 'white';
    } else if (whiteContras === 21 && blackContras === 1) {
        result = 'black';
    } else if (whiteContras >= 3 && blackContras < 10) {
        result = 'dark';
    } else {
        result = 'light';
    }

    return cache[color] = result;
}
