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
        title: 'Automate sales, marketing, document management and e-learning workflows. ERP vs CRM',
        description: 'Automate sales, marketing, document management and e-learning workflows through custom cloud apps. No programming skills required.'
    };
}
