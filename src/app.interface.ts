
export namespace AppInterface {
    export interface AppInfo {
        categories: Category[];
        vendors: Vendor[];
        shopInfo: {
            general: any;
            support: Support;
            about: About;
            termsAndConditions: TermsAndConditions;
            featuredItems: any;
        };
    }

    export interface About {
        docId: string;
        data: {
            text: string;
        };
    }

    export interface Category {
        docId: string;
        data: {
            name: string;
            parentId: string;
        };
        /**
         * This: is optional and set from FE for filtering and other stuff we need
         */
        parent?: this;
        children?: this[];
    }

    export interface Vendor {
        docId: string;
        data: {
            name: string;
        };
    }

    export interface Support {
        docId: string;
        data: {
            text: string;
            faqItems: { question: string; answer: string }[];
            supportEmailAddress: string;
            supportPhoneNumber: string;
        };
    }

    export interface TermsAndConditions {
        docId: string;
        data: {
            text: string;
        };
    }

    /**
     * Account data is the document attached to this user
     */
    export interface AccountData {
        phoneNumber: string;
        website: string;
        addresses: any; // NaoUsersInterface.Address[];
        net: string;
        name?: string;
        contactName?: string;
        email?: string;
        companyTaxId?: string;
        allowedPaymentMethods: string[];
    }
}
