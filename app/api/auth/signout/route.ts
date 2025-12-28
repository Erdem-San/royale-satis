
import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        await supabase.auth.signOut();
    }

    return NextResponse.json({ message: "Signed out successfully" }, { status: 200 });
}
