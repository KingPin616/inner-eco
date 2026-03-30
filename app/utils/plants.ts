import plants from "@/data/plants.json";

export type Plant = {
  id: string;
  name: {
    common: string;
    scientific: string;
  };
  age: string;
  description: string;
  imageUrl: string;
};

const plantList = plants as Plant[];

export function getPlants(): Plant[] {
  return plantList;
}

export function getPlantById(id: string): Plant | undefined {
  return plantList.find((plant) => plant.id === id);
}

export function plantExists(id: string): boolean {
  return plantList.some((plant) => plant.id === id);
}
