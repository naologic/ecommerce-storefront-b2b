## Description
This eCommerce open-source website is built with Angular 16 Server Side Rendering and optimized for SEO. It can be deployed to Google Cloud Run, a docker orchestration
service with auto-scaling, self-healing and designed for large production deployments, without any loss of performance.

## Integration
The system integrates with Naologic no-code eCommerce platform.
Features:

**Sales performance through automation**: The system allows sending quotes to customers, generating sales orders, and automatically sending the purchase order to the vendor. 
You can track the shipping progress, analyze sales performance on a dedicated sales dashboard and easily collect rebates through generated sales reports.

**Procurement and vendor collaboration automation**: The system can automatically send purchase orders to your vendors when customers place new orders. 
It synchronizes purchases with your accounting system and manages vendor bills.

**Warehouse and drop-shipping inventory performance**: It allows you to track stock levels, set up alerts for low stock levels, and generate reports on inventory movement. 
It also includes tools for managing vendor relationships and purchasing, including creating and tracking purchase orders and receiving and tracking deliveries.

**Faster collection of rebates from GPO providers**: The system allows for automatic import of products, generation of reports, and collection of rebates using the GPO integration.
It can connect with major GPO providers like ProVista, Vizient, NDC, and more.

**Processing more orders with a SEO-optimized eCommerce portal**: The system can automate wholesale customer signups checkouts and accept payments through debit/credit card, cheque, or online bank transfers. 
It enables purchasing, tracking, and re-ordering of products for your B2B customers and reordering directly from product lists.

**Synchronization of data with Quickbooks, Sage, and others**: It can synchronize your invoices from Quickbooks, Sage and others through an accounting 
integration that automatically synchronizes and updates.

**Streamlined purchasing**: The system allows you to create vendor logins and fully control access rights. It enables you to communicate, review collaboratively, 
and grant rights to download relevant purchase orders and invoices.

**Automation of GPO & rebates**: It enables you to create GPO contracts, automatically apply specific pricing to specific customers, generate 
group purchasing reports, and automate rebate collection.

**Product and inventory automation**: The system can automatically update your product offering using Naologic’s proprietary NDC product 
import tool. You can continue to customize your product listings even after import.

## Install

Clone the repository
```bash
git clone https://github.com/naologic/ecommerce-storefront-b2b
```

Install the npm dependencies. Sometimes you might need to pass `--legacy-peer-deps` flag
```bash
npm install --legacy-peer-deps
```


## Commands
Run `npm run dev:ssr` for a dev server. Navigate to `http://localhost:4201/`. The application will automatically reload if you change any of the source files.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

Run `npm run build:ssr` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running
Run `npm run serve:ssr` to serve it locally `http://localhost:4000/`.


## Deployment as a static page
Static pages offer great performance at low cost and auto-scale with the number of requests.

### Deploy to [Vercel](vercel.com)

1. pick your repository
2. go to "Configure Project"
3. open "Build and Output Settings"
4. set the "OUTPUT DIRECTORY" to "dist/browser"
5. open "Environment Variables" and set values from your [naologic](https://naologic.com) account
   1. set `API_URL` to `api url value from Workspace`
   2. set `NAO_TOKEN` to `token value from Tokens`
6. Go to `src.environment.prod.ts`
   1. set `API.server.url` to `API URL value from Workspace`
   2. set `API.naoToken` to `token value from Tokens`
7. Enjoy :rocket:

### Deploy to [Cloudflare Pages](https://pages.cloudflare.com/)

1. pick your repository
2. open "Framework preset" and set "None"
3. open "Build command" and set "npm run build:ssr"
4. open "Root directory (advanced)" and set "dist/browser"
5. open "Environment Variables" and set values from your [naologic](https://naologic.com) account
   1. set `API_URL` to `api url value from Tokens`
   2. set `NAO_TOKEN` to `token value from Tokens`
6. Go to `src.environment.prod.ts`
   1. set `API.server.url` to `API URL value from Workspace`
   2. set `API.naoToken` to `token value from Tokens`
7. In "Build system version" select version 2
8. Enjoy :rocket:

### Deploy to [Cloudflare Pages](https://pages.cloudflare.com/) as SSR (COMING SOON)

## License
[MIT license](LICENSE.md)
