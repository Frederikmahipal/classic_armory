export interface Character {
  name: string;
  level: number;
  class: string;
  race: string;
}

export interface CharacterDetails extends Character {
  faction: string;
  guild?: string;
  achievementPoints?: number;
  itemLevel?: number;
  lastSeen?: string;
  // Add more fields as needed for the character detail page
} 