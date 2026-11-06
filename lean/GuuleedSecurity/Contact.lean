import GuuleedSecurity.Domain

/-! Contact submission gates and their safety properties. -/

namespace GuuleedSecurity

def contactFieldsValid (request : ContactRequest) : Bool :=
  request.emailPresent && request.messagePresent

def contactMayBeAccepted (request : ContactRequest) : Bool :=
  contactFieldsValid request && request.turnstileVerified && request.rateLimitAvailable

def contactDecision (request : ContactRequest) : RequestState :=
  if contactMayBeAccepted request then .accepted else .rejected

theorem accepted_contact_has_email (request : ContactRequest)
    (h : contactDecision request = .accepted) : request.emailPresent = true := by
  simp_all [contactDecision, contactMayBeAccepted, contactFieldsValid]

theorem accepted_contact_has_message (request : ContactRequest)
    (h : contactDecision request = .accepted) : request.messagePresent = true := by
  simp_all [contactDecision, contactMayBeAccepted, contactFieldsValid]

theorem accepted_contact_is_verified (request : ContactRequest)
    (h : contactDecision request = .accepted) : request.turnstileVerified = true := by
  simp_all [contactDecision, contactMayBeAccepted, contactFieldsValid]

theorem accepted_contact_has_rate_capacity (request : ContactRequest)
    (h : contactDecision request = .accepted) : request.rateLimitAvailable = true := by
  simp_all [contactDecision, contactMayBeAccepted, contactFieldsValid]

theorem unverified_contact_is_rejected (request : ContactRequest)
    (h : request.turnstileVerified = false) : contactDecision request = .rejected := by
  simp [contactDecision, contactMayBeAccepted, h]

theorem rate_limited_contact_is_rejected (request : ContactRequest)
    (h : request.rateLimitAvailable = false) : contactDecision request = .rejected := by
  simp [contactDecision, contactMayBeAccepted, h]

theorem missing_email_is_rejected (request : ContactRequest)
    (h : request.emailPresent = false) : contactDecision request = .rejected := by
  simp [contactDecision, contactMayBeAccepted, contactFieldsValid, h]

theorem missing_message_is_rejected (request : ContactRequest)
    (h : request.messagePresent = false) : contactDecision request = .rejected := by
  simp [contactDecision, contactMayBeAccepted, contactFieldsValid, h]

end GuuleedSecurity
