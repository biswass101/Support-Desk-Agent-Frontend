export interface Customer {
  id: string;
  externalId: string;
  name: string | null;
  currentTier: string;
  createdAt: string;
  updatedAt: string;
}
