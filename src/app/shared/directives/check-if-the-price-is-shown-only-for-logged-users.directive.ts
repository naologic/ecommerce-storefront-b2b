import {Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {NaoUserAccessService} from "../../nao-user-access";
import {Subscription} from "rxjs";
import {AppService} from "../../app.service";
import {NaoSettingsInterface} from "../../nao-interfaces";

@Directive({
  selector: '[ShowOnlyIfOnlyLoggedUsersSeePrices]'
})
export class CheckIfThePriceIsShownOnlyForLoggedUsersDirective implements OnInit, OnDestroy {
  private subs = new Subscription();

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly naoUsersService: NaoUserAccessService,
    private readonly container: ViewContainerRef,
    private readonly appService: AppService,
  ) {
  }

  public ngOnInit(): void {
    // -->Subscribe: to logged in and disable the button
    this.subs.add(
      this.naoUsersService.isLoggedIn$.subscribe(() => {
        this.checkShowHide();
      }),
    );
    // -->Subscribe: to settings change
    this.subs.add(
      this.appService.settings.subscribe(() => {
        this.checkShowHide();
      }),
    );
  }

  /**
   * Check: if we need to show or hide the price element
   */
  public checkShowHide(): void {
    let show = false;
    // -->Get: logged in value
    const isLoggedIn = this.naoUsersService?.isLoggedIn$?.getValue() || false;
    // -->Get: settings
    const appSettings: NaoSettingsInterface.Settings = this.appService.settings.getValue();
    if (appSettings?.showProductPrice === 'price-logged-users') {
      show = !isLoggedIn;
    }
    // -->Clear: container
    this.container.clear();
    // -->Check: if we need to show
    if (show) {
      // -->Create: template
      this.container.createEmbeddedView(this.templateRef);
    }
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
