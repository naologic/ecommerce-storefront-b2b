import { Megamenu, Menu } from './menu';
import { Link } from './link';


export interface MainMenuLink extends Link {
    submenu?: Menu | Megamenu;
}
