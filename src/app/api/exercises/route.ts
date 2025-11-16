import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    if (!search) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing search parameter",
          data: [],
        },
        { status: 400 }
      );
    }

    const muscleGroup = search.toLowerCase();
    console.log("Searching for muscle group:", muscleGroup);

    // Fetch from ExerciseDB API
    const url = `https://www.exercisedb.dev/api/v1/muscles/${encodeURIComponent(
      muscleGroup
    )}/exercises?limit=100`;
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Failed to fetch exercises from ExerciseDB");
    }

    // Map the response to match our expected format
    const mapped = result.data.map((ex: any) => ({
      name: ex.name,
      muscle_group: ex.bodyParts?.[0] || ex.targetMuscles?.[0] || muscleGroup,
      gif_url: ex.gifUrl || "",
    }));

    console.log(
      `Found ${mapped.length} exercises for muscle group: ${muscleGroup}`
    );

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch exercises",
        data: [],
      },
      { status: 500 }
    );
  }
}
