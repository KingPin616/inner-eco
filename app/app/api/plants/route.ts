import { NextRequest, NextResponse } from "next/server";
import { getPlantById, type Plant, plantExists } from "@/utils/plants";
import { getRuntimePlantById, runtimePlantExists, saveRuntimePlant } from "@/utils/runtimePlants";

function isValidPlantPayload(payload: unknown): payload is Plant {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Plant;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name?.common === "string" &&
    typeof candidate.name?.scientific === "string" &&
    typeof candidate.age === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.imageUrl === "string"
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as unknown;

    if (!isValidPlantPayload(payload)) {
      return NextResponse.json({ error: "Invalid plant payload." }, { status: 400 });
    }

    const trimmedId = payload.id.trim();

    if (!trimmedId) {
      return NextResponse.json({ error: "Plant ID is required." }, { status: 400 });
    }

    const normalizedPlant: Plant = {
      ...payload,
      id: trimmedId,
      name: {
        common: payload.name.common.trim(),
        scientific: payload.name.scientific.trim(),
      },
      age: payload.age.trim(),
      description: payload.description.trim(),
      imageUrl: payload.imageUrl.trim(),
    };

    await saveRuntimePlant(normalizedPlant);

    return NextResponse.json({ plant: normalizedPlant });
  } catch {
    return NextResponse.json({ error: "Could not save plant." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json({ error: "Missing id query parameter." }, { status: 400 });
  }

  const staticPlant = getPlantById(id);
  const runtimePlant = staticPlant ? undefined : await getRuntimePlantById(id);
  const plant = staticPlant ?? runtimePlant;

  if (!plant) {
    return NextResponse.json({ error: "Plant not found." }, { status: 404 });
  }

  return NextResponse.json({
    plant,
    source: plantExists(id) ? "static" : (await runtimePlantExists(id)) ? "runtime" : "unknown",
  });
}