import {Params} from '@angular/router';
import {Observable, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {GetProductsListOptions} from '../../interfaces/shop';
import {AppInterface} from "../../../app.interface";


/**
 * Parse: products params
 */
export function parseProductsListParams(params: Params): GetProductsListOptions {
  const options: GetProductsListOptions = {};

  if (params['page']) {
    options.page = parseFloat(params['page']);
  }
  if (params['limit']) {
    options.limit = parseFloat(params['limit']);
  }
  if (params['sort']) {
    options.sort = params['sort'];
  }

  for (const param of Object.keys(params)) {
    const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

    if (!mr) {
      continue;
    }

    const filterSlug = mr[1];

    if (options.filters === undefined) {
      options.filters = {};
    }

    options.filters[filterSlug] = params[param];
  }

  return options;
}

/**
 * Delay: response
 */
function delayResponse<T>(input: Observable<T>, time = 500): Observable<T> {
  return timer(time).pipe(mergeMap(() => input));
}

/**
 * Clone: data
 */
function clone(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Convert: name to slug
 */
function nameToSlug(name: string): string {
  if (!name) {
    return ""
  }
  name = name.replace(/^\s+|\s+$/g, ''); // trim
  name = name.toLowerCase();

  // -->Remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    name = name.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  name = name.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return name;
}

/**
 * Get: breadcrumbs for a category
 */
function getBreadcrumbs(categories: AppInterface.Category[], categoryId: string): any[] {
  const categories$: any[] = [];

  if (!categoryId) {
    return []
  }

  // -->Get: current category
  const currentCategory = categories.find(c => c.docId === categoryId)

  // -->Get: parent category
  const parent = categories.find(c => c?.docId === currentCategory?.data?.parentId)
  if (parent) {
    categories$.push(...buildArrayOfSelectedCategories(categories, parent));
  }
  // -->Push: current category
  if (currentCategory) {
    categories$.push(currentCategory)
  }
  return categories$;
}

/**
 * Create: array with all the parents of a category
 */
function buildArrayOfSelectedCategories(items: AppInterface.Category[], parentCategory: AppInterface.Category|undefined): any[] {
  // -->Check: if the parent is root or not
  if (parentCategory?.data?.parentId) {
    const parent = items.find(c => c?.docId === parentCategory?.data?.parentId)
    // -->Return: and start the search again
    return [...buildArrayOfSelectedCategories(items, parent), parentCategory]
  }
  return [parentCategory];
}

export {
  delayResponse,
  clone,
  nameToSlug,
  getBreadcrumbs
}
