import { Map } from '../model/map.model';
import maps from '../data/maps.json';

export function getMaps() {
  return maps as Map[];
}

export function getMap(id: number) {
  const map = maps.find(m => m.id === id);
  if (map === undefined) {
    throw new Error('Map not found');
  }

  return map;
}
