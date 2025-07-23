/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: item.ts
 * Description: Interface to define Category objects.
 */
export interface Supplier {
  _id: string;
  supplierId: number;
  supplierName: string;
  contactInformation: string;
  address: string;
  dateCreated: string;
  dateModified?: string;
}

export type AddSupplierDTO = Omit<Supplier, '_id' | 'supplierId' | 'dateModified'>;
export type UpdateSupplierDTO = Omit<Supplier, '_id' | 'supplierId' | 'dateCreated' | 'dateModified'>;
