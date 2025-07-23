/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: item.ts
 * Description: Interface to define Category objects.
 */
export interface Category {
  _id: string;
  categoryId: number;
  categoryName: string;
  description: string;
  dateCreated?: string;
  dateModified?: string;
}
