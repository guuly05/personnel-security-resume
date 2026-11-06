import GuuleedSecurity.Contact
import GuuleedSecurity.Booking

/-! Composition of independent validation gates into a request workflow. -/

namespace GuuleedSecurity

def passContactGates (request : ContactRequest) : Bool :=
  contactFieldsValid request && request.turnstileVerified && request.rateLimitAvailable

def contactWorkflow (request : ContactRequest) : RequestState :=
  if passContactGates request then .accepted else .rejected

theorem contact_workflow_matches_gate_decision (request : ContactRequest) :
    contactWorkflow request = contactDecision request := by
  rfl

theorem workflow_acceptance_implies_all_contact_gates (request : ContactRequest)
    (accepted : contactWorkflow request = .accepted) :
    request.emailPresent = true ∧ request.messagePresent = true ∧
      request.turnstileVerified = true ∧ request.rateLimitAvailable = true := by
  simp [contactWorkflow, passContactGates, contactFieldsValid] at accepted
  exact accepted

theorem workflow_never_accepts_without_turnstile (request : ContactRequest)
    (unverified : request.turnstileVerified = false) :
    contactWorkflow request = .rejected := by
  simp [contactWorkflow, passContactGates, unverified]

theorem workflow_never_accepts_when_rate_limited (request : ContactRequest)
    (limited : request.rateLimitAvailable = false) :
    contactWorkflow request = .rejected := by
  simp [contactWorkflow, passContactGates, limited]

end GuuleedSecurity
