import { Property } from './property.types';

export interface PropertyComparison {
  id: string;
  user_id: string;
  name?: string;
  property_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface ComparisonWithProperties extends PropertyComparison {
  properties: Property[];
}

export interface CreateComparisonInput {
  name?: string;
  property_ids: string[];
}

export interface ComparisonCategory {
  name: string;
  fields: ComparisonField[];
}

export interface ComparisonField {
  label: string;
  key: string;
  format?: (value: any) => string;
  highlight?: 'best' | 'worst' | 'none';
}
