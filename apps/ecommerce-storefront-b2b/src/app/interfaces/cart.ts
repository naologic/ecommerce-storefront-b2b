import { ProductVariant } from './product';

export interface CartItem extends ProductVariant {
    // options: {
    //     name: string;
    //     value: string;
    // }[];
    quantity: number;
}

export interface CartTotal {
    title: string;
    price: number;
    type: 'shipping' | 'fee' | 'tax' | 'other';
}

export interface CartData {
    items: CartItem[];
    quantity: number;
    subtotal: number;
    totals: CartTotal[];
    total: number;
}
