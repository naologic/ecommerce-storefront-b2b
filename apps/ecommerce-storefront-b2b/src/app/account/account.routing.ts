import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NaoUserPermissionsGuard } from "@naologic/nao-user-access";
import { LayoutComponent } from './layout/layout.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageProfileComponent } from './page-profile/page-profile.component';
import { PageInvoicesComponent } from './page-invoices/page-invoices.component';
import { PageAddressesComponent } from './page-addresses/page-addresses.component';
import { PageEditAddressComponent } from './page-edit-address/page-edit-address.component';
import { PagePasswordComponent } from './page-password/page-password.component';
import { PageLoginComponent } from './page-login/page-login.component';
import { PageRegisterComponent } from "./page-register/page-register.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
            {
                path: 'dashboard',
                component: PageDashboardComponent,
            },

            {
                path: 'profile',
                component: PageProfileComponent,
            },
            {
                path: 'invoices',
                component: PageInvoicesComponent,
            },
            {
                path: 'addresses',
                component: PageAddressesComponent,
            },
            {
                path: 'addresses/new',
                component: PageEditAddressComponent,
            },
            {
                path: 'addresses/:id',
                component: PageEditAddressComponent,
            },
            {
                path: 'password',
                component: PagePasswordComponent,
            },
        ],
        canActivate: [NaoUserPermissionsGuard]
    },
    {
        path: 'login',
        component: PageLoginComponent,
        // todo: add authGuard with redirect to dashboard
        // canActivate: [AuthGuard],
        // data: {
        //     authGuardMode: 'redirectToDashboard',
        // },
    },
    {
        path: 'register',
        component: PageRegisterComponent,
        // todo: add authGuard with redirect to dashboard
        // canActivate: [AuthGuard],
        // data: {
        //     authGuardMode: 'redirectToDashboard',
        // },
    },
    // todo: uncomment this when we have the API ready for forgot password
    // {
    //     path: 'forgot-password',
    //     component: PageForgotPasswordComponent,
    //     // canActivate: [AuthGuard],
    //     // data: {
    //     //     authGuardMode: 'redirectToDashboard',
    //     // },
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountRoutingModule { }
