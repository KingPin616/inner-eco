import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plant } from "@/utils/plants";

const RUNTIME_PLANTS_FILE_PATH = path.join(process.cwd(), "data", "runtime-plants.json");

function normalizeId(id: string): string {
  return id.trim().toLowerCase();
}

async function readRuntimePlantList(): Promise<Plant[]> {
  try {
    const fileContent = await readFile(RUNTIME_PLANTS_FILE_PATH, "utf8");
    const parsedData = JSON.parse(fileContent) as unknown;

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData.filter((plant): plant is Plant => {
      return (
        typeof plant === "object" &&
        plant !== null &&
        typeof (plant as Plant).id === "string" &&
        typeof (plant as Plant).name?.common === "string" &&
        typeof (plant as Plant).name?.scientific === "string" &&
        typeof (plant as Plant).age === "string" &&
        typeof (plant as Plant).description === "string" &&
        typeof (plant as Plant).imageUrl === "string" &&
        (typeof (plant as Plant).qrCodeUrl === "undefined" ||
          typeof (plant as Plant).qrCodeUrl === "string")
      );
    });
  } catch {
    return [];
  }
}

async function writeRuntimePlantList(plantList: Plant[]): Promise<void> {
  await writeFile(RUNTIME_PLANTS_FILE_PATH, JSON.stringify(plantList, null, 2), "utf8");
}

export async function saveRuntimePlant(plant: Plant): Promise<Plant> {
  const runtimePlantList = await readRuntimePlantList();
  const normalizedId = normalizeId(plant.id);
  const existingPlantIndex = runtimePlantList.findIndex(
    (existingPlant) => normalizeId(existingPlant.id) === normalizedId,
  );

  const existingPlant = existingPlantIndex >= 0 ? runtimePlantList[existingPlantIndex] : undefined;
  const nextPlant: Plant = {
    ...plant,
    qrCodeUrl: plant.qrCodeUrl ?? existingPlant?.qrCodeUrl,
  };

  if (existingPlantIndex >= 0) {
    runtimePlantList[existingPlantIndex] = nextPlant;
  } else {
    runtimePlantList.push(nextPlant);
  }

  await writeRuntimePlantList(runtimePlantList);
  return nextPlant;
}

export async function getRuntimePlantById(id: string): Promise<Plant | undefined> {
  const runtimePlantList = await readRuntimePlantList();
  return runtimePlantList.find((plant) => normalizeId(plant.id) === normalizeId(id));
}

export async function runtimePlantExists(id: string): Promise<boolean> {
  const runtimePlantList = await readRuntimePlantList();
  return runtimePlantList.some((plant) => normalizeId(plant.id) === normalizeId(id));
}

export async function linkQrToRuntimePlant(id: string, qrCodeUrl: string): Promise<boolean> {
  const runtimePlantList = await readRuntimePlantList();
  const normalizedId = normalizeId(id);
  const existingPlantIndex = runtimePlantList.findIndex(
    (existingPlant) => normalizeId(existingPlant.id) === normalizedId,
  );

  if (existingPlantIndex < 0) {
    return false;
  }

  runtimePlantList[existingPlantIndex] = {
    ...runtimePlantList[existingPlantIndex],
    qrCodeUrl,
  };

  await writeRuntimePlantList(runtimePlantList);
  return true;
}