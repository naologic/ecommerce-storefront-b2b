import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { UrlService } from "../../services/url.service";
import { appInfo$ } from "../../../app.static";


interface PageInfo {
  hero: {
    title?: string;
    description?: string;
    imageUrl?: string;
  },
  featuredCategories: {
    routerLink?: string;
    title?: string;
    description?: string;
  }[]
  mostSearchProducts: {
    name: string;
    routerLink: string;
  }[]
  keyAdvantages: {
    show: boolean
    title?: string;
    description?: string;
    items: any[];
  },
  featuredProducts: {
    products: any[];
  },
  seasonalProducts: {
    products: any[];
  },
  bestSellingCategories: {
    categories: {
      name: string;
      itemsNo: string;
      imageUrl: string;
      routerLink: string;
    }[]
  }
  categoryExplainers: {
    show: false,
    categories: {
      name: string;
      description: string;
      buttonCopy: string;
      imageUrl: string;
      routerLink: string;
    }[]
  }
  partnerLogos: any[]
}


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Home info
   */
  public pageInfo: PageInfo = {
    hero: {
      title: "Over 100k medical supplies instantly available",
      description: "Your patients trust you to provide for them. You can trust us to provide the healthcare essentials you need.",
      imageUrl: "",
    },
    // todo: set css classes
    featuredCategories: [
      {
        routerLink: "/",
        title: "Patient Care & Exam Room Supplies",
        description: "Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.",
      },
      {
        routerLink: "/",
        title: "Patient Care & Exam Room Supplies",
        description: "Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.",
      },
      {
        routerLink: "/",
        title: "Patient Care & Exam Room Supplies",
        description: "Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.",
      },
      {
        routerLink: "/",
        title: "Patient Care & Exam Room Supplies",
        description: "Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.",
      },
    ],
    // -->Most; searched products
    // todo
    mostSearchProducts: [
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
      { name: "Syringes and needles", routerLink: "/" },
    ],
    keyAdvantages: {
      show: false,
      items: []
    },
    featuredProducts: {
      products: [],
    },
    seasonalProducts: {
      products: [],
    },
    bestSellingCategories: {
      categories: [
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          itemsNo: "110",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
      ],
    },
    categoryExplainers: {
      show: false,
      categories: [
        {
          name: "Needles and syringes",
          description: "Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.",
          buttonCopy: "Learn more",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
        {
          name: "Needles and syringes",
          description: "Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.",
          buttonCopy: "Learn more",
          imageUrl: "assets/images/category-placeholder.png",
          routerLink: "/",
        },
      ],
    },
    partnerLogos: [],
  };
  /**
   * Subs
   */
  private subs = new Subscription();


  constructor(
    public url: UrlService,
  ) {
  }

  public ngOnInit(): void {
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe((value) => {
        // -->Get: all categories
        const allCategories = value?.categories || [];
        /**
         * Set: hero section
         */

        /**
         * Set: featured categories
         */
        // -->Get: company information data
        const companyInformationData = value?.shopInfo?.companyInformation?.data;

        /**
         * Set: key advantages
         */
        this.pageInfo.keyAdvantages = {
          show: companyInformationData?.showKeyAdvantages || false,
          title: companyInformationData?.keyAdvantagesTitle || '',
          description: companyInformationData?.keyAdvantagesDescription || '',
          items: Array.isArray(companyInformationData?.keyAdvantages) ? companyInformationData?.keyAdvantages : []
        }

      }),
    );
  }


  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
