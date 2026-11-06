import GuuleedSecurity.Domain

/-! Explicit role and clinic-scope authorization rules. -/

namespace GuuleedSecurity

def authorized (actor : Actor) (operation : Operation) : Bool :=
  match operation with
  | .readPublicDirectory => true
  | .createContact => true
  | .createBooking =>
      match actor with
      | .patient => true
      | _ => false
  | .readOwnBooking =>
      match actor with
      | .patient => true
      | _ => false
  | .readClinicQueue clinicId =>
      match actor with
      | .staff assigned => assigned == clinicId
      | .clinicAdmin assigned => assigned == clinicId
      | .systemAdmin => true
      | _ => false
  | .manageClinic clinicId =>
      match actor with
      | .clinicAdmin assigned => assigned == clinicId
      | .systemAdmin => true
      | _ => false
  | .manageSystem =>
      match actor with
      | .systemAdmin => true
      | _ => false

theorem public_directory_is_public (actor : Actor) :
    authorized actor .readPublicDirectory = true := by
  cases actor <;> rfl

theorem anonymous_cannot_create_booking :
    authorized .anonymous .createBooking = false := by rfl

theorem patient_can_create_booking :
    authorized .patient .createBooking = true := by rfl

theorem staff_cannot_create_booking (clinicId : Nat) :
    authorized (.staff clinicId) .createBooking = false := by rfl

theorem staff_cannot_read_another_clinic (assigned requested : Nat)
    (h : assigned ≠ requested) :
    authorized (.staff assigned) (.readClinicQueue requested) = false := by
  simp [authorized, h]

theorem clinic_admin_cannot_manage_another_clinic (assigned requested : Nat)
    (h : assigned ≠ requested) :
    authorized (.clinicAdmin assigned) (.manageClinic requested) = false := by
  simp [authorized, h]

theorem system_admin_can_manage_any_clinic (actor : Actor) (clinicId : Nat)
    (h : actor = .systemAdmin) : authorized actor (.manageClinic clinicId) = true := by
  subst actor
  rfl

theorem only_system_admin_manages_system (actor : Actor)
    (h : authorized actor .manageSystem = true) : actor = .systemAdmin := by
  cases actor <;> simp [authorized] at h ⊢

end GuuleedSecurity
