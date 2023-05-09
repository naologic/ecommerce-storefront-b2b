export namespace MetasInterface {
    export interface Metas {
        title: string;
        description: string;
        // -->Optionals
        twitterDescription?: string;
        ogDescription?: string;
        shareImg?: string;
    }
    export const DefaultMetas = {
        title: 'Welcome to Directmed Supplies',
        description: 'Unify all your data and operations into a single platform'
    };
}
