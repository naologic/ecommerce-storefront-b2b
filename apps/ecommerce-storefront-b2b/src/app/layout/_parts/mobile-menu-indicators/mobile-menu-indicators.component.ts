import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { MyListsService } from '../../../services/my-lists.service';
import { LayoutMobileMenuService } from '../../layout-mobile-menu.service';
import { NaoUserAccessService } from '@naologic/nao-user-access';

@Component({
    selector: 'app-mobile-menu-indicators',
    templateUrl: './mobile-menu-indicators.component.html',
    styleUrls: ['./mobile-menu-indicators.component.scss'],
})
export class MobileMenuIndicatorsComponent implements OnInit {
    public isLoggedIn = false;

    constructor(
        public menu: LayoutMobileMenuService,
        public cart: CartService,
        public myLists: MyListsService,
        private naoUsersService: NaoUserAccessService
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to user LoggedIn state changes
        this.naoUsersService.isLoggedIn$.subscribe((value) => {
            this.isLoggedIn = value;
        });
    }
}
