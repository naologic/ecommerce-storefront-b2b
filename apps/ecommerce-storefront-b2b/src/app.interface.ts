export namespace AppInterface {
    export interface AppInfo {
        categories: Category[];
        shopInfo: {
            general: any;
            support: Support;
            about: About;
            termsAndConditions: TermsAndConditions;
            featuredItems: any;
        }
    }

    export interface About {
        docId: string;
        data: {
            text: string;
        }
    }

    export interface Category {
        docId: string;
        children?: Category[];
        data: {
            name: string;
            parentId: string;
        }
    }

    export interface Support {
        docId: string;
        data: {
            text: string;
            faqItems: { question: string; answer: string }[]
            supportEmailAddress: string;
            supportPhoneNumber: string;
        }
    }

    export interface TermsAndConditions {
        docId: string;
        data: {
            text: string;
        }
    }
}
