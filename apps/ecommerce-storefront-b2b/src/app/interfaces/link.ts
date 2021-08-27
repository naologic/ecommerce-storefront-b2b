import { CustomFields } from './custom-fields';

export interface Link {
    title: string;
    url?: string;
    external?: boolean;
    customFields?: CustomFields;
}

export interface NestedLink extends Link {
    links?: NestedLink[];
}
