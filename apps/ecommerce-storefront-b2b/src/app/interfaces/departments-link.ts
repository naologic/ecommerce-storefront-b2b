import { Megamenu } from './menu';
import { Link } from './link';

export interface DepartmentsLink extends Link {
    submenu?: Megamenu;
}
