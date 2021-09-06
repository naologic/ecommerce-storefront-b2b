import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { NaoUserAccessService } from "@naologic/nao-user-access";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private naoUsersService: NaoUserAccessService, private router: Router) {}

    public canActivate(): boolean {
        if (this.naoUsersService.isLoggedIn$.getValue()) {
            this.router.navigate(['/account/dashboard']).then();
            return false;
        } else {
            return true;
        }
    }
}
