// WoW related interfaces

export interface Realm {
  name: string;
  slug: string;
  id: number;
}

export interface RealmResponse {
  realms: Realm[];
} 