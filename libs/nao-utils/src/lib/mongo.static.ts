import { isPlainObject } from 'lodash';

type SearchTypes = 'wildcard'|'startsWith'|'equals'|'eq';

/**
 * A class for creating mongo queries
 */
export class QuickMongoQuery {
  public o: any = { condition: '$or', searchType: 'wildcard' };

  constructor() {
  }

  /**
   * Create the search query
   */
  private static searchQueryByType(searchType: SearchTypes, fieldName: string, value: any): any {
    const q = {};
    switch (searchType) {
      case 'equals':
      case 'eq':
        // -->Set: value
        q[fieldName] = value;
        break;
      case 'wildcard':
        // -->Set: value
        q[fieldName] = { $regex: `.*${value}.*`, $options : 'i' };
        break;
      case 'startsWith':
        // -->Set: value
        q[fieldName] = { $regex: `${value}.*`, $options : 'i' };
        break;
    }
    // -->Push: query
    return q;
  }

  /**
   * Create the search query for array with $elemMatch
   *    @example
   *      { 'data.variants': { $elemMatch: { manufacturerItemId: {$regex: .*10269211.* } }
   */
  private static searchQueryArrayByType(searchType: SearchTypes, arrayField: string, fieldName: string, value: any): any {
    const q = {};
    // -->Set:
    q[arrayField] = {
      $elemMatch: {}
    };
    switch (searchType) {
      case 'wildcard':
        // -->Set: value
        q[arrayField].$elemMatch[fieldName] = { $regex: `.*${value}.*` };
        break;
      case 'startsWith':
        // -->Set: value
        q[arrayField].$elemMatch[fieldName] = { $regex: `${value}.*` };
        break;
    }
    // -->Push: query
    return q;
  }

  /**
   * Create the query object
   */
  public done(): any {
    return {
      query: this.buildQuery(),
      options: this.buildQueryOptions()
    };
  }

  /**
   * Build query options
   */
  public buildQueryOptions(): any {
    const res: any = {};
    // -->Set: projection
    if (this.o.projection) {
      res.projection = this.o.projection;
    }
    if (this.o.hasOwnProperty('limit')) {
      res.limit = this.o.limit;
    }
    if (this.o.hasOwnProperty('skip')) {
      res.skip = this.o.skip;
    }
    return res;
  }


  /**
   * Build the mongo query
   */
  public buildQuery(): any {
    // -->Set: query
    const res: any = {}, query: any = [];
    let q: any = {}, iv: any;

    // -->Add: default Query pairs
    if (Array.isArray(this.o.defaultQueryPairs)) {
      const tempQuery = []
      // -->Loop: pairs
      for (const [fieldName, value] of this.o.defaultQueryPairs) {
        const qq = {}
        if (Array.isArray(value)) {
          qq[fieldName] = {$in: value}
        } else {
          qq[fieldName] = {$eq: value}
        }
        // -->Push: query
        tempQuery.push(qq);
      }
      if (tempQuery.length) {
        res.$and = tempQuery;
      }
    }


    // -->Return: empty query is no values provided
    if (!this.o.searchTerm && !Array.isArray(this.o.searchTermPairs) && !this.o.inputValue) {
      return res;
    }

    // -->Search: term pairs
    if (Array.isArray(this.o.searchTermPairs)) {
      // -->Loop: pairs
      for (const valuePair of this.o.searchTermPairs) {
        // -->Push: query
        query.push(QuickMongoQuery.searchQueryByType(valuePair[2] || this.o.searchType, valuePair[0], valuePair[1]));
      }

    } else if (this.o.searchTerm && Array.isArray(this.o.searchFields)) {
      // -->Loop: searchFields
      for (const fieldName of this.o.searchFields) {
        // -->Push: query
        query.push(QuickMongoQuery.searchQueryByType(this.o.searchType, fieldName, this.o.searchTerm));
      }
      // -->Check:
      if (Array.isArray(this.o.searchArrayFields)) {
        // -->Loop: searchArrayFields
        for (const searchField of this.o.searchArrayFields) {
          // -->Push: query
          query.push(QuickMongoQuery.searchQueryArrayByType(this.o.searchType, searchField.arrayField, searchField.field, this.o.searchTerm))
        }
      }
    }
    // -->Check: current value
    if ((this.o.inputValue && !Array.isArray(this.o.inputValue) || Array.isArray(this.o.inputValue) && this.o.inputValue.length) && this.o.inputField) {
      q = {};
      if (Array.isArray(this.o.inputValue)) {
        // -->Set: value
        iv = this.o.inputField === '_id' ? this.o.inputValue.map(v => ({ $convert: { input: v, to: 'objectId' } })) : this.o.inputValue;
        // -->Set: input field
        q[this.o.inputField] = { $in: iv };
      } else {
        // -->Set: value
        iv = this.o.inputField === '_id' ? {
          $convert: {
            input: this.o.inputValue,
            to: 'objectId'
          }
        } : this.o.inputValue;
        // -->Set: value
        q[this.o.inputField] = iv;
      }
      // -->Push: value
      query.push(q);
    }
    // -->Check: query
    if (query.length) {
      // -->Set: condition
      res[this.o.condition] = query;
    }
    // -->Return: same
    return res;
  }

  /**
   * Set what to sorts
   *    @example
   *      .sort(['info.createdAt', -1]
   *      .sort(['data.variant.price', -1]
   */
  public sort(...sorts: [string, number][]): QuickMongoQuery {
    this.o.sorts = sorts;
    return this;
  }

  /**
   * Add a search term
   *    > the term will search for every field
   */
  public searchTerm(value: string): QuickMongoQuery {
    this.o.searchTerm = value;
    return this;
  }

  /**
   * Add default query
   *    > [[data.name, 'ion'], [data.type, 'company']]
   */
  public defaultQueryPairs(...fieldValuePair: [string, string | number | string[] ][]): QuickMongoQuery {
    // -->Check: array
    if (Array.isArray(fieldValuePair)) {
      this.o.defaultQueryPairs = fieldValuePair;
    }
    return this;
  }

  /**
   * Add a series of field value pairs
   *    >  [[data.name, 'ion', 'startsWith'], [data.type, 'company', 'startsWith']]
   */
  public searchTermPairs(...fieldValuePair: [string, string | number, string][]): QuickMongoQuery {
    // -->Check: array
    if (Array.isArray(fieldValuePair)) {
      this.o.searchTermPairs = fieldValuePair;
    }
    return this;
  }

  /**
   * Set searchFields to search
   */
  public searchFields(value: string[]): QuickMongoQuery {
    this.o.searchFields = value;
    return this;
  }

  /**
   * Set search fields for array inside the doc
   *    @example
   *       value: [{arrayField: 'data.variants', field: 'manufacturerItemId'}]
   */
  public searchArrayFields(value: { arrayField: string, field: string }[]): QuickMongoQuery {
    this.o.searchArrayFields = value;
    return this;
  }

  /**
   * Represents the current value of the input field
   *    @example
   *      docId: [876237846283]
   */
  public inputValue(value: any|any[]): QuickMongoQuery {
    this.o.inputValue = value;
    return this;
  }

  /**
   * Represents the current field that the inputeValue is set to
   *    @example
   *      [docId]: 876237846283
   */
  public inputField(value: string): QuickMongoQuery {
    this.o.inputField = value;
    return this;
  }

  /**
   * Set the condition between the field values
   */
  public condition(cond: '$or'|'$and' = '$or'): QuickMongoQuery {
    this.o.condition = cond;
    return this;
  }

  /**
   * Set the type of search
   */
  public searchType(type: SearchTypes): QuickMongoQuery {
    this.o.searchType = type;
    return this;
  }

  /**
   * Set the limit
   */
  public limit(l: number): QuickMongoQuery {
    this.o.limit = l || 20;
    return this;
  }

  /**
   * How many rows to skip
   */
  public skip(s: number): QuickMongoQuery {
    this.o.skip = s || 0;
    return this;
  }

  /**
   * Set object return shape
   */
  public projection(p: any): QuickMongoQuery {
    if (isPlainObject(p)) {
      this.o.projection = p;
    }
    return this;
  }

  /**
   * Return data model
   */
  public returnDataModel(p: any): QuickMongoQuery {
    if (isPlainObject(p)) {
      this.o.projection = p;
    }
    return this;
  }
}
