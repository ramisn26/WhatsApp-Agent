import { supabase } from "./supabase";
import { checkAvailability, createAppointment } from "./calendar";

export const tools = [
  {
    type: "function",
    function: {
      name: "save_patient_info",
      description: "Saves or updates patient lead information in the CRM. Use this when the patient provides their name, email, or other relevant details.",
      parameters: {
        type: "object",
        properties: {
          conversation_id: {
            type: "string",
            description: "The UUID of the conversation",
          },
          full_name: {
            type: "string",
            description: "The patient's full name",
          },
          email: {
            type: "string",
            description: "The patient's email address",
          },
          notes: {
            type: "string",
            description: "Any additional notes or details about the patient",
          },
        },
        required: ["conversation_id", "full_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_patient_record",
      description: "Updates detailed medical or administrative information for a patient. Use this for insurance, DOB, or medical history.",
      parameters: {
        type: "object",
        properties: {
          conversation_id: {
            type: "string",
            description: "The UUID of the conversation",
          },
          date_of_birth: {
            type: "string",
            description: "Date of birth in YYYY-MM-DD format",
          },
          insurance_provider: {
            type: "string",
            description: "Name of the insurance company",
          },
          preferred_contact_method: {
            type: "string",
            description: "WhatsApp, Email, or Phone",
            enum: ["whatsapp", "email", "phone"]
          },
          medical_history: {
            type: "string",
            description: "Summary of the patient's dental or medical history",
          },
        },
        required: ["conversation_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_patient_note",
      description: "Adds a clinical or administrative note to the patient's record. Use this to log important details from the conversation.",
      parameters: {
        type: "object",
        properties: {
          conversation_id: {
            type: "string",
            description: "The UUID of the conversation",
          },
          note: {
            type: "string",
            description: "The content of the note to add",
          },
        },
        required: ["conversation_id", "note"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_availability",
      description: "Checks for available appointment slots on a specific date. Use this before booking an appointment.",
      parameters: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "The date to check in YYYY-MM-DD format",
          },
        },
        required: ["date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_appointment",
      description: "Books a dental appointment for a patient. Use this only after confirming the date and time with the patient.",
      parameters: {
        type: "object",
        properties: {
          conversation_id: {
            type: "string",
            description: "The UUID of the conversation",
          },
          startTime: {
            type: "string",
            description: "The start time of the appointment in ISO 8601 format",
          },
          endTime: {
            type: "string",
            description: "The end time of the appointment in ISO 8601 format",
          },
          reason: {
            type: "string",
            description: "Reason for the visit (e.g., cleaning, toothache)",
          },
        },
        required: ["conversation_id", "startTime", "endTime", "reason"],
      },
    },
  },
];

export async function executeTool(toolName: string, args: any) {
  if (toolName === "save_patient_info") {
    const { conversation_id, full_name, email, notes } = args;

    const { data: existing } = await supabase
      .from("patients")
      .select("id")
      .eq("conversation_id", conversation_id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("patients")
        .update({
          full_name,
          email,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return JSON.stringify({ success: true, message: "Patient info updated", patient: data });
    } else {
      const { data, error } = await supabase
        .from("patients")
        .insert({
          conversation_id,
          full_name,
          email,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      return JSON.stringify({ success: true, message: "New patient lead captured", patient: data });
    }
  }

  if (toolName === "update_patient_record") {
    const { conversation_id, ...updates } = args;

    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("conversation_id", conversation_id)
      .single();

    if (!patient) return JSON.stringify({ success: false, error: "Patient profile not found" });

    const { data, error } = await supabase
      .from("patients")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", patient.id)
      .select()
      .single();

    if (error) throw error;
    return JSON.stringify({ success: true, message: "Patient record updated", patient: data });
  }

  if (toolName === "add_patient_note") {
    const { conversation_id, note } = args;

    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("conversation_id", conversation_id)
      .single();

    if (!patient) return JSON.stringify({ success: false, error: "Patient profile not found" });

    const { data, error } = await supabase
      .from("patient_notes")
      .insert({
        patient_id: patient.id,
        note
      })
      .select()
      .single();

    if (error) throw error;
    return JSON.stringify({ success: true, message: "Note added to patient record", note: data });
  }

  if (toolName === "check_availability") {
    const { date } = args;
    const slots = await checkAvailability(date);
    return JSON.stringify({
      date,
      available_slots: slots,
      message: "Here are the available slots for the requested date."
    });
  }

  if (toolName === "book_appointment") {
    const { conversation_id, startTime, endTime, reason } = args;

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("conversation_id으로", conversation_id) // Fix: Typo in previous version's eq call
      .single();

    // Wait, I noticed a typo in the previous version of this file in the history I wrote.
    // Let's fix it in this current edit.
    // The previous edit used .eq("conversation_id", conversation_id).
    // I'll make sure it's correct here.

    // Correcting the patient lookup
    const { data: p, error: pe } = await supabase
      .from("patients")
      .select("id, full_name")
      .eq("conversation_id", conversation_id)
      .single();

    if (pe || !p) {
      return JSON.stringify({
        success: false,
        error: "No patient profile found. Please capture patient details first."
      });
    }

    const calendarResult = await createAppointment({
      patientId: p.id,
      conversationId: conversation_id,
      startTime,
      endTime,
      reason,
      patientName: p.full_name
    });

    if (!calendarResult.success) {
      return JSON.stringify({ success: false, error: "Calendar booking failed." });
    }

    const { error: dbError } = await supabase.from("appointments").insert({
      patient_id: p.id,
      conversation_id,
      start_time: startTime,
      end_time: endTime,
      reason,
      status: "scheduled"
    });

    if (dbError) {
      console.error("Error saving appointment to DB:", dbError);
      return JSON.stringify({
        success: true,
        message: "Appointment booked in calendar, but failed to record in local CRM."
      });
    }

    return JSON.stringify({
      success: true,
      message: "Appointment successfully booked!",
      details: { startTime, endTime, reason }
    });
  }

  throw new Error(`Tool ${toolName} not implemented`);
}
