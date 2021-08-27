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
    _id: string;
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

  export interface LinkedDoc {
      data: {
          addresses: Address[];
          phoneNo: string;
          allowedPaymentMethods: string[];
      }

  }

export interface Address {
        city: string
        country: string
        id: string
        line_1: string
        line_2?: string
        state: string
        type?: string
        zip: string | number
    }

  /**
   * @deprecated > what do we do with this?
   */
  export interface FlagsXXX {
    /**
     * Trial information
     */
    trial?: {
      startDate: string;
      plan?: string;
      status: 'active';
    };
    /**
     * Details related to payment
     */
    subscriptionPayment?: {
      status: 'failed-to-pay'|'no-payment-method'
    };
    /**
     * Verify this email
     */
    verifyEmail?: boolean;
    /**
     * Accept cookies
     */
    acceptCookie?: boolean;
    /**
     * New features
     */
    featureRelease?: any;
    /**
     * New discount code
     */
    discountOffer?: {
      discountPercentage?: number;
    };
    /**
     * Account is unpaid
     */
    unpaidAccount?: true;
    /**
     * Sends the user to the payment page and can't navigate anywhere else
     */
    suspendToPaymentPage?: true;
    /**
     * Sends user to suspended page and can't navigate anywhere else
     */
    suspended?: true;
    /**
     * Doesn't do anything. This is unauthorized access
     */
    markForDeletion?: true;
    /**
     * The email wasn't verified, so show an announcement
     */
    emailNotVerified?: true;
    /**
     * The payment failed, so show an announcement
     */
    paymentFailed?: true;
  }
}
