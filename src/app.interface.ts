import { Product } from "./app/interfaces/product";

export namespace AppInterface {
  /**
   * Window details
   */
  export interface WindowDetails {
    innerScreen: {
      width: number,
      height: number
    },
    screen: {
      width: number,
      height: number
    },
    devicePixelRatio: number
    isApple: boolean
  }
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
      navigationAndFooter: NavigationAndFooter;
      companyInformation: CompanyInformation;
      featuredItems: FeaturedItems;
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
      online?: boolean
      downForMaintenanceMessage?: string
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
   * Interface for Navigation and Footer
   */
  export interface NavigationAndFooter {
    docId: string;
    data: {
      /** @default primary */
      bannerColor?: string
      bannerText?: string
      /** @default hidden */
      bannerVisibility?: "hidden" | "show" | "show-logged-only"
      featuredHeaderCategories?: {
        categoryId: string
      }[]
      /** @default */
      displaySocialIcons?: boolean
      socialMediaIcons?: {
        socialMediaType: string
        url: string
      }[]
      footerContactUs: string
      footerOurGuarantee?: string
      footerOurGuaranteeTitle?: string
    };
  }

  /**
   * Interface for Featured items
   */
  export interface FeaturedItems {
    docId: string;
    data: {
      heroTitle: string
      heroImageUrl: string
      heroDescription: string
      primaryFeaturedCategories?: FeaturedCategory[]
      mostPopularProducts?: Product[]
      productHits?: Product[]
      bestSellingCategories?: { docId: string, totalProducts: number }[]
      seasonalProducts?: Product[]
      /** @default */
      showCategoryExplainers: boolean
      categoryExplainers?: CategoryExplainer[]
    };
  }

  /**
   * Interface for Company Information
   */
  export interface CompanyInformation {
    docId: string,
    data: {
      storeName: string
      location: string
      supportEmail?: string
      phoneNumber?: string
      workingHours?: string
      /** @default */
      showKeyAdvantages: boolean
      keyAdvantagesTitle?: string
      keyAdvantagesDescription?: string
      keyAdvantages?: {
        title: string
        description: string
        /** @default phone */
        icon: string
      }[]
      /** @default */
      showCallToAction: boolean
      callToActionTitle?: string
      callToActionDescription?: string
      callToActionOptions?: {
        title: string
        description: string
        /** @default phone */
        icon: string
        button: string
      }[]
    }
  }

  /**
   * Featured category
   */
  interface FeaturedCategory {
    categoryId?: string
  }

  /**
   * Category Explainer
   */
  interface CategoryExplainer {
    categoryId: string
    buttonCopy: string
  }


  /**
   * Category interface
   */
  export interface Category {
    docId: string;
    data: {
      name: string
      parentId?: string
      /** A numeric id that represents the category Id from other data sources */
      categoryId?: string
      metaTitle?: string
      metaDescription?: string
      description?: string
      imageUrl?: string
    };
    /**
     * This: is optional and set from FE for filtering and other stuff we need
     */
    parent?: this;
    children?: this[];
  }

  /**
   * Vendor
   */
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
