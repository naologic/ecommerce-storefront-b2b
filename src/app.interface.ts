export namespace AppInterface {
  /**
   * Interface: holding all the app info
   */
  export interface AppInfo {
    categories: Category[];
    vendors: Vendor[];
    shopInfo: {
      general: GeneralSettings;
      support: Support;
      seo: SEO;
      storefrontSearch: StorefrontSearch;
      productSettings: ProductSettings;
      storefrontSettings: StorefrontSettings;
      storefrontDisplay: StorefrontDisplay;
      about: About;
      termsAndConditions: TermsAndConditions;
      featuredItems: any;
    };
  }

  /**
   * Interface: for general settings
   */
  interface GeneralSettings {
    docId: string;
    data: {
      roleId: string;
      storefrontUrl: string;
    };
  }

  /**
   * Interface for support and FAQ
   */
  export interface Support {
    docId: string;
    data: {
      faqItems: { question: string; answer: string }[];
    };
  }

  /**
   * Interface for SEO
   */
  export interface SEO {
    docId: string;
    data: {
      metaTitle: string;
      metaDescription: string;
      metaKeywords: string[];
    };
  }

  /**
   * Interface for Storefront Search
   */
  export interface StorefrontSearch {
    docId: string;
    data: {
      allowPriceFiltering: boolean;
      productSort: 'name_asc' | 'name_desc';
    };
  }

  /**
   * Interface for Product settings
   */
  export interface ProductSettings {
    docId: string;
    data: {
      showProductPrice: 'price-all-users' | 'price-logged-users' | 'hide-price';
      showProductSku: boolean;
    };
  }

  /**
   * Interface for Storefront settings
   */
  export interface StorefrontSettings {
    docId: string;
    data: {
      online: boolean;
      downForMaintenanceMessage: string;
      storeName: string;
      location: string;
      supportEmail: string;
      phoneNumber: string;
      workingHours: string;
    };
  }

  /**
   * Interface for Storefront display
   */
  export interface StorefrontDisplay {
    docId: string;
    data: {
      companyLogo: string;
      partnerLogos: {
        fileName: string,
        cdnLink: string,
        alt: string,
        i: number,
      }[]
    };
  }

  /**
   * Interface for About page
   */
  export interface About {
    docId: string;
    data: {
      text: string;
    };
  }

  /**
   * Interface for Terms and conditions
   */
  export interface TermsAndConditions {
    docId: string;
    data: {
      text: string;
    };
  }


  /**
   * Category interface
   */
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




  /**
   * Account data is the document attached to this user
   */
  export interface AccountData {
    phoneNumber: string;
    website: string;
    addresses: Address[];
    net: string;
    name?: string;
    contactName?: string;
    email?: string;
    companyTaxId?: string;
    allowedPaymentMethods: string[];
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
