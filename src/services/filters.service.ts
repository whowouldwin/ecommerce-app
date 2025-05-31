import { FacetResult } from '@commercetools/platform-sdk';
import { QueryParam } from '@commercetools/ts-client';
import { apiClient } from '../commercetools-environment/apiClient.ts';

export interface ProductFilterParams {
  priceRange?: [number, number];
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  categories?: string[];
  materials?: string[];
  searchText?: string;
  language?: string;
}

export interface FilterOptions {
  brands: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
}

let cachedFilterOptions: FilterOptions | null = null;

export const getFilterOptions = async (
  cacheOptions: boolean = true,
): Promise<FilterOptions> => {
  if (cacheOptions && cachedFilterOptions) {
    return cachedFilterOptions;
  }

  try {
    const res = await apiClient
      .getApiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          limit: 0,
          facet: [
            'variants.attributes.brand',
            'variants.attributes.color',
            'variants.attributes.size',
            'variants.attributes.material',
          ],
        },
      })
      .execute();

    const facets = res.body.facets;

    const extractTerms = (facetData: FacetResult | undefined): string[] => {
      if (
        !facetData ||
        typeof facetData !== 'object' ||
        !('terms' in facetData) ||
        !Array.isArray(facetData.terms)
      ) {
        return [];
      }

      return facetData.terms.map((t) => t.term);
    };

    const options: FilterOptions = {
      brands: extractTerms(facets?.['variants.attributes.brand']),
      colors: extractTerms(facets?.['variants.attributes.color']),
      sizes: extractTerms(facets?.['variants.attributes.size']),
      materials: extractTerms(facets?.['variants.attributes.material']),
    };

    if (cacheOptions) {
      cachedFilterOptions = options;
    }
    return options;
  } catch (err) {
    console.error('Failed to load filter options from facets:', err);
    return {
      brands: [],
      colors: [],
      sizes: [],
      materials: [],
    };
  }
};

export const buildFilterQueryArgs = (
  filterParams?: ProductFilterParams,
): Record<string, QueryParam> => {
  const queryArgs: Record<string, QueryParam> = { limit: 50 };
  if (!filterParams) return queryArgs;

  const filters: string[] = [];
  const facets: string[] = [];

  if (filterParams.searchText) {
    const language = filterParams.language || 'en';
    queryArgs[`text.${language}`] = filterParams.searchText;
    queryArgs.fuzzy = true;
  }

  if (filterParams.priceRange?.length === 2) {
    const [min, max] = filterParams.priceRange;
    const minCents = Math.floor(min * 100);
    const maxCents = Math.ceil(max * 100);

    if (minCents > 0 || maxCents > minCents) {
      filters.push(
        `variants.price.centAmount:range (${minCents} to ${maxCents})`,
      );
      facets.push('variants.price.centAmount:range (0 to 100)');
    }
  }

  const addEnumFilter = (name: string, values?: string[]) => {
    if (values && values.length > 0) {
      const joined = values.map((v) => `"${v}"`).join(',');
      filters.push(`variants.attributes.${name}:${joined}`);
      facets.push(`variants.attributes.${name}`);
    }
  };

  addEnumFilter('brand', filterParams.brands);
  addEnumFilter('color', filterParams.colors);
  addEnumFilter('size', filterParams.sizes);
  addEnumFilter('material', filterParams.materials);

  if (filterParams.categories && filterParams.categories.length > 0) {
    queryArgs['filter.query'] = filterParams.categories.map(
      (id) => `categories.id:"${id}"`,
    );
    facets.push('categories.id');
  }

  if (filters.length > 0) queryArgs.filter = filters;
  if (facets.length > 0) queryArgs.facet = facets;

  return queryArgs;
};
