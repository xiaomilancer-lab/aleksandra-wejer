export type InboundEmailAttachment = {
  id: string;
  filename: string | null;
  size?: number;
  content_type: string;
  content_disposition: string | null;
};

export type InboundEmail = {
  id: string;
  resend_email_id: string;
  sender: string;
  recipients: string[];
  cc: string[];
  reply_to: string[];
  subject: string;
  body_text: string;
  attachment_metadata: InboundEmailAttachment[];
  received_at: string;
  is_read: boolean;
  read_at: string | null;
  archived_at: string | null;
};
