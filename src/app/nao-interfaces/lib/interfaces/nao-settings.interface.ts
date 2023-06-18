export namespace NaoSettingsInterface {
  export interface Settings {
    /**
     * @Warning: when activated, we need to test all the langauge tags because they are deprecated
     */
    rating: boolean
    freeShipping: boolean
    hotOffers: boolean
    showPriceFilter: boolean
    /**
     * Show product sku
     */
    showProductSku: boolean
    /**
     * Show product price
     */
    showProductPrice: 'price-all-users' | 'price-logged-users' | 'hide-price',
    /**
     * Default sort type
     */
    defaultSortValue: 'name_asc' | 'name_desc'
  }
}
