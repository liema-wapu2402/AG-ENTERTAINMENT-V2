import type { ReactNode } from 'react';
import type { AdminRow } from '@/types';

// Describes one admin screen. AdminResourcePage reads this config and builds
// the table, the add/edit form, delete and CSV import - so a new resource
// is just a new config object (see admin/resources.tsx).

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'file' | 'url';

export interface Option { value: string | number; label: string }

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Required only when adding (e.g. the mp3 of a new song). */
  requiredOnCreate?: boolean;
  options?: Option[];
  /** Load select options from another admin resource. */
  optionsFrom?: { resource: string; label: string };
  accept?: string;
  help?: string;
  step?: string;
  /** Row key holding the current file URL (shows a preview while editing). */
  preview?: string;
  /** Take the full width of the form (textarea, files). */
  full?: boolean;
}

export interface Column {
  label: string;
  render: (row: AdminRow) => ReactNode;
  className?: string;
}

export interface ResourceConfig {
  resource: string;          // API path: /api/admin/<resource>
  title: string;
  singular: string;
  module: 'movies' | 'music' | 'books';
  viewPath: string;          // public page of this module
  columns: Column[];
  fields: Field[];
  searchPlaceholder: string;
  /** Optional dropdown filter (e.g. movie category). */
  filter?: { name: string; label: string; options: Option[] };
  /** CSV import (movies, books). */
  csv?: { headers: string[]; sample: string };
  /** Extra buttons next to "Add" (e.g. mp3 upload). */
  toolbar?: (reload: () => void) => ReactNode;
}
