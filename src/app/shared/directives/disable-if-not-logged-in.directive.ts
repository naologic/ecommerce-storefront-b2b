import {ChangeDetectorRef, Directive, HostBinding, Input, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {CartService} from "../../services/cart.service";
import {NaoUserAccessService} from "../../nao-user-access";

@Directive({
  selector: "[disableIfNotLoggedIn]",
})
export class LoadingButtonDirective implements OnInit, OnDestroy {
  @Input() @HostBinding("disabled") disableButton: boolean = false;

  private subs = new Subscription();

  constructor(private cart: CartService, private cd: ChangeDetectorRef, private naoUsersService: NaoUserAccessService) {
    this.disableButton = !this.naoUsersService.isLoggedIn$.getValue();
  }

  public ngOnInit(): void {
    // -->Subscribe: to logged in and disable the button
    this.subs.add(
      this.naoUsersService.isLoggedIn$.subscribe((isLoggedIn) => {
        this.disableButton = !isLoggedIn;
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
