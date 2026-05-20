import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await params;

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("conversation_id", conversationId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await params;
  const body = await req.json();

  const { data: patient, error: fetchError } = await supabase
    .from("patients")
    .select("id")
    .eq("conversation_id", conversationId)
    .single();

  if (fetchError || !patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("patients")
    .update(body)
    .eq("id", patient.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("patients")
    .insert({
      conversation_id: conversationId,
      ...body,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
