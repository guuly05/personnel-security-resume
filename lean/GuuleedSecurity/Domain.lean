/-!
# Domain model

Small, executable types used by the portfolio security model.  These types
describe policy decisions; they do not import or claim to verify the website's
TypeScript implementation.
-/

namespace GuuleedSecurity

inductive Actor where
  | anonymous
  | patient
  | staff (clinicId : Nat)
  | clinicAdmin (clinicId : Nat)
  | systemAdmin
  deriving DecidableEq, Repr

inductive Operation where
  | readPublicDirectory
  | createContact
  | createBooking
  | readOwnBooking
  | readClinicQueue (clinicId : Nat)
  | manageClinic (clinicId : Nat)
  | manageSystem
  deriving DecidableEq, Repr

inductive RequestState where
  | received
  | validated
  | humanVerified
  | accepted
  | rejected
  deriving DecidableEq, Repr

structure ContactRequest where
  emailPresent : Bool
  messagePresent : Bool
  turnstileVerified : Bool
  rateLimitAvailable : Bool
  deriving DecidableEq, Repr

structure BookingRequest where
  startMinute : Nat
  endMinute : Nat
  identityVerified : Bool
  deriving DecidableEq, Repr

structure Interval where
  start : Nat
  finish : Nat
  deriving DecidableEq, Repr

end GuuleedSecurity
