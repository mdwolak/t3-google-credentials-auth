// This is an example of how to access a session from an API route
import { NextResponse } from "next/server";

import { getSession } from "~/server/auth";

export async function GET() {
  const session = await getSession();
  return NextResponse.json(session);
}
