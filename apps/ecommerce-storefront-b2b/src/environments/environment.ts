export const environment = {
    production: false,
    localDatabase: {
        company: {
            dbName: 'company',
            collections: [{ name: 'cache', schema: 'any' }],
        },
        nao: {
            dbName: 'nao',
            collections: [
                { name: 'sessions', schema: 'any' },
                { name: 'companycache', schema: 'any' },
            ],
        },
    },
    API: {
        server: {
            $id: 'server',
            protocol: 'https',
            port: 443,
            // url: 'template-b2b-commerce-business-logic-api-d8039-dev.naologic.space',
            url: 'dms1-business-logic-api-d2651930-dev.naologic.space',
            prefix: 'api/v2/',
            ssl: true
        },
        // server: {
        //     $id: 'server',
        //     protocol: 'https',
        //     port: 443,
        //     url: 'api-v2-dms.naologic.com',
        //     prefix: 'api/v2/',
        //     ssl: false
        // },
        naoToken: 'naoproductionCFNjXpqmXseZAYvGPv1F7W22p',
        webSocket: {
            enabled: false,
        },
        basicAuth: {
            user: 'gabriel',
            password: 'gabriel',
        }
    },
    naoUsers: {
        ws: {
            enabled: false,
        },
        users: {
            updateEverySeconds: 60 * 5,
        },
        subscribeTo: {
            companyUpdates: true,
            userUpdates: true,
        },
        api: { root: 'users-auth/auth' },
        cfpPath: 'ecommerce-api/ecommerce-api',
        naoQueryOptions: {
            docName: 'guest-external-ecommerce',
            cfpPath: 'users/users',
            userMode: 'guest-external',
        },
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as zone.run, zoneDelegate.invokeTask.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
