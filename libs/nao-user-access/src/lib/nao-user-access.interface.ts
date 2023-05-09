export namespace NaoUserAccessInterface {
    export interface Locale {
        // @use https://en.wikipedia.org/wiki/ISO_4217
        // currency: any;
        lang: string;
        countryCode: string;
        currencyCode: string;
    }

    export interface LoginResponse {
        ok: boolean;
        userData: NaoUsersInterface.UserData;
        companyData: any;
        companyList: NaoCompanyInterface.Company[];
        accessToken: string;
    }
}

export namespace NaoCompanyInterface {
    export interface Company {
        createdAt: string;
        data: any;
        deploymentId: string;
        docId: string;
        licenseId: string;
        updatedAt: string;
    }
}

export namespace NaoUsersInterface {
    export interface UserData {
        avatar?: Avatar;
        companies: any[];
        companyId: string;
        email: string;
        emailHash?: string;
        firstName: string;
        lastName: string;
        locale: NaoUserAccessInterface.Locale;
        lockedScreen: boolean;
        lockedWithPin: boolean;
        phoneNo: string;
        policyList: any[];
        resetPasswordOnNextLogin: boolean;
        roleId: string;
        state: string;
        status: string;
        teamList: any[];
    }

    export interface Avatar {
        path?: string;
    }

    export interface Info {
        firstName: string;
        lastName: string;
    }

    export interface Role {
        checksum?: string;
        name: string;
        slug: string;
        badgeColorClass: string;
        policyList: Policy[];
    }

    export interface Policy {
        id: string;
        slug: string;
        name: string;
        permissions: string[];
    }

    export interface Address {
        city: string;
        country: string;
        id: string;
        line1: string;
        line2?: string;
        state: string;
        type?: string;
        zip: string | number;
    }
}
