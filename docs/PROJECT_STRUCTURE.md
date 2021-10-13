
## Routing schema
`AppBrowserModule` module is the entry point of the application. It bootstraps the `AppComponent` component which will redirect us to the `RootComponent` component of the `LayoutModule` module after loading was completed with no errors.
`RootComponent` takes care of the site structure and renders navigation from children routes. This makes it possible that the header and footer of the site are always visible.

The main children routes registered (using lazy loading) are the following:

    .
    ├── ''          ->  HomeModule
    ├── 'shop'      ->  ShopModule
    ├── 'account'   ->  AccountModule
    └── 'site'      ->  SiteModule

### Home routes

    .
    └── ''  ->  HomeComponent

### Shop routes

    .
    ├── 'shop/'
        ├── ''                                              ->  PageShopListComponent
        ├── 'category/products'                             ->  PageShopListComponent
        ├── 'category/:categorySlug/:categoryId/products'   ->  PageShopListComponent
        ├── 'products/:productSlug/:productId'              ->  PageProductComponent
        ├── 'cart'                                          ->  PageCartComponent
        ├── 'checkout'                                      ->  PageCheckoutComponent
        ├── 'my-list'                                       ->  PageMyListComponent
        └── 'compare'                                       ->  PageCompareComponent

### Account routes

    .
    ├── 'account/'
        ├── ''              ->  LayoutComponent
        ├── 'dashboard'     ->  PageDashboardComponent
        ├── 'profile'       ->  PageProfileComponent
        ├── 'invoices'      ->  PageInvoicesComponent
        ├── 'addresses'     ->  PageAddressesComponent
        ├── 'addresses/new' ->  PageEditAddressComponent
        ├── 'addresses/:id' ->  PageEditAddressComponent
        ├── 'password'      ->  PagePasswordComponent
        ├── 'login'         ->  PageLoginComponent
        └── 'register'      ->  PageRegisterComponent

### Site routes

    .
    ├── 'site/'
        ├── ''              ->  PageAboutUsComponent
        ├── 'about-us'      ->  PageAboutUsComponent
        ├── 'terms'         ->  PageTermsComponent
        └── 'faq'           ->  PageFaqComponent

## Project Structure
Find bellow the overall project structure.

    .
    ├── ...
    ├── apps                                        # Source files
    │   └── ecommerce-storefront-b2b
    │       └── src                                 # Ecommerce source files
    │           ├── app                             # Application source files
    │               ├── account                     # Account module (handles user authentication and profile edition)
    │               ├── default-pages               # Default static pages
    │               ├── home                        # Home module
    │               ├── interfaces                  # Application interfaces
    │               ├── layout                      # Layout module
    │               ├── services                    # Application services
    │               ├── shared                      # Shared module (common components, functions, directives and pipes)
    │               ├── shop                        # Shop module (shop pages and services)
    │               ├── site                        # Site module (FAQ, about-us and terms pages)
    │               ├── ...
    │               ├── app.module.ts               # App module (handles modules configuration)
    │               └── app-browser.module.ts       # App browser module (entry point)
    │           ├── ...
    │           ├── assets                          # Site assets (images, internationalization files)
    │           ├── environments                    # Environments configurations
    │           └── scss                            # Styles
    ├── libs                                        # Libraries
    │   ├── nao-http2                               # Public library to handle http requests
    │   ├── nao-interfaces                          # Public library that holds nao interfaces (options, requests, settings)
    │   ├── nao-locale                              # Public library to handle locale data (currency, language)
    │   ├── nao-user-access                         # Public library to handle user access and permissions
    │   └── nao-utils                               # Public library that holds utility files (local storage definition, helper functions, shared interfaces)
    ├── ...
    └── README.md

For more details about any of the showcased items please scroll down to its designated section.

### App directory
App directory contains the source code of the ecommerce-storefront-b2b application. It leverages some actions such as API interaction and user access and permission management by using naologic libraries.

### Account module
`AccountModule` module main responsibilities are handling user authentication and profile edition. The module structure can be found bellow:

    .
    ├── ...
    ├── app
        ├── account
            ├── layout                  # Layout component (main/routing component)
            ├── page-addresses          # PageAddresses component (remove address from user profile)
            ├── page-dashboard          # PageDashboard component (displays logged in user information)
            ├── page-edit-address       # PageEditAddress component (add or edit user address)
            ├── page-forgot-password    # PageForgotPassword component (handles password reset)
            ├── page-invoices           # PageInvoices component (displays user invoices)
            ├── page-login              # PageLogin component (handles user login)
            ├── page-password           # PagePassword component (handles password changes)
            ├── page-profile            # PageProfile component (handles user profile updates)
            └── page-register           # PageRegister component (handles user registrations)
        └── ...
    └── ...

### Default pages directory
Default pages directory is home to the static error pages.

    .
    ├── ...
    ├── app
        ├── default-pages
            ├── page-error          # PageError component (used for 500 error)
            └── page-not-found      # PageNotFound component (used for 404 error)
        └── ...
    └── ...

### Home module
`HomeModule` module contains the `HomeComponent`.

    .
    ├── ...
    ├── app
        ├── home
            └── home        # Home component (landing page, displays featured products)
        └── ...
    └── ...

### Interfaces directory
This directory contains interfaces definitions being used across the entire application.

    .
    ├── ...
    ├── app
        ├── interfaces
            ├── brand.ts               # Definition for Brand interface used in BlockBrandsComponent
            ├── cart.ts                # Definitions for cart interfaces used in CartService, RemoveFromCartDirective and PageCartComponent
            ├── category.ts            # Definitions for category interfaces used in CategoryFilter, UrlService and PageShopLayout
            ├── custom-fields.ts       # Definition for CustomFields interface used in Link and BaseAttributeGroup
            ├── departments-link.ts    # Definition for DepartmentsLink interface used in DepartmentsComponent and HeaderComponent
            ├── filter.ts              # Definitions for filter interfaces used in multiple components within ShopModule
            ├── link.ts                # Definitions for link interfaces used in MenuComponent and HeaderComponent
            ├── list.ts                # Definitions for list interfaces used in PageShopListComponent and ShopService
            ├── main-menu-link.ts      # Definition for MainMenuLink interface used in MainMenuComponent
            ├── menu.ts                # Definitions for menu interfaces used in DepartmentsLink and MegamenuComponent
            ├── mobile-menu-link.ts    # Definition for MobileMenuLink interface used in MobileMenuLinksComponent, MobileMenuSettingsComponent and MobileMenuComponent
            ├── product.ts             # Definition for product interfaces used in multiple files across the application such as components and services within SharedModule and ShopModule
            ├── review.ts              # Definition for Review interface used in ReviewsListComponent
            ├── shop.ts                # Definition for GetProductsListOptions interface used in ShopService and utils functions
            └── vendor.ts              # Definition for Vendor interface used in utils functions
        └── ...
    └── ...

Notice that there are some other interfaces defined as part of the `NaoInterfacesModule` in use as well.

### Layout module
`LayoutModule` module handles the entire site structure. Find the main components displayed below:

    .
    ├── ...
    ├── app
        ├── layout
            ├── footer      # Footer component (displays data such as contact, helpful links and copyright information)
            ├── header      # Header component (displays components such as main menus, navbar, indicators, search)
            └── root        # Root component (handles site structure)
        └── ...
    └── ...

### Services directory
This directory contains some services that are being used across different modules of the application.

    .
    ├── ...
    ├── app
        ├── services
            ├── cart.service.ts         # CartService handles cart operations. Used by LayoutModule, SharedModule and ShopModule
            ├── compare.service.ts      # CompareService handles product compare list operations. Used by LayoutModule, SharedModule and ShopModule
            ├── photo-swipe.service.ts  # PhotoSwipeService loads and create a photo swipe gallery. Used in ProductGalleryComponent
            ├── quickview.service.ts    # QuickviewService keeps track of the product to show on in the quick view. Used in QuickViewComponent and ProductCardComponent
            ├── resources.service.ts    # ResourcesService handles resources load tasks. Used by PhotoSwipeService
            ├── url.service.ts          # UrlService builds URLs (static and with params). Used in every module of the application
            └── my-lists.service.ts     # MyListsService handles products operations in user lists. Used by LayoutModule, SharedModule and ShopModule
        └── ...
    └── ...

### Shared module
`SharedModule` module is home to common components, functions, directives and pipes.
All of these files are being used by two or more modules within the application.

    .
    ├── ...
    ├── app
        ├── shared
            ├── avatar-icon             # AvatarIcon component (displays icon with user initials)
            ├── checkbox                # Checkbox component
            ├── currency                # Currency module
                ├── interfaces          # Currency interfaces
                ├── pipes               # Currency pipe (handles currency format transformations)
                └── services            # Currency services (interacts with user preferences)
            ├── directives              # Shared directives (such as collapse items, add or remove items from user lists)
            ├── dispatchers             # Shared dispatchers (checkbox and radiobutton)
            ├── functions               # Shared functions (validators, utils and rxjs helpers)
            ├── icon                    # Icon component (collection of svg shown according to an input)
            ├── input-number            # InputNumber component (enhanced input element)
            ├── language                # Language module
                ├── interfaces          # Language interfaces
                └── services            # Language services (interacts with user preferences)
            ├── pagination              # Pagination component
            ├── pipes                   # Shared pipes (such as text transformers, image renderers, error checkers)
            ├── product-card            # ProductCard component (product detail view)
            ├── product-gallery         # ProductGallery component (products overview. Multiple layouts supported)
            ├── product-variants        # ProductVariants component (displays product variants)
            ├── radio-button            # RadioButton component
            ├── rating                  # Rating component
            ├── status-badge            # StatusBadge component
            └── terms                   # Terms component (displays term and conditions information)
        └── ...
    └── ...

### Shop module
`ShopModule` module handles all the shop logic which includes product listing and filtering, products comparison and the entire checkout process. It also manages user preferences concepts such as user lists.

    .
    ├── ...
    ├── app
        ├── shop
            ├── page-cart               # PageCart component (displays products in cart and handles cart interactions)
            ├── page-checkout           # PageCheckout component (handles order checkouts)
            ├── page-compare            # PageCompare component (enhanced view for products comparison)
            ├── page-product            # PageProduct component (full specification detailed product view)
            ├── page-shop               # PageShop component (main shop component. Displays products according to filters. Multiple layouts supported)
            ├── page-track-order        # PageTrackOrder component
            └── page-my-list            # PageMyList component (displays products on user list) 
        └── ...
    └── ...

### Site module
`SiteModule` module contains FAQ, about-us and terms pages.

    .
    ├── ...
    ├── app
        ├── site
            ├── page-about-us           # PageAboutUs component
            ├── page-faq                # PageFaq component
            └── page-terms              # PageTerms component
        └── ...
    └── ...
