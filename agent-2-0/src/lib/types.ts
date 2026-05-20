export interface Conversation {
  id: string;
  phone: string;
  name: string | null;
  mode: "agent" | "human";
  updated_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  whatsapp_msg_id: string | null;
  created_at: string;
}

export interface ConversationWithLastMessage extends Conversation {
  last_message: string | null;
}

export interface Patient {
  id: string;
  conversation_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: "lead" | "patient" | "archived";
  date_of_birth: string | null;
  insurance_provider: string | null;
  medical_history: string | null;
  preferred_contact_method: "whatsapp" | "email" | "phone" | null;
  created_at: string;
  updated_at: string;
}

export interface PatientNote {
  id: string;
  patient_id: string;
  note: string;
  created_at: string;
  created_by: string;
}
