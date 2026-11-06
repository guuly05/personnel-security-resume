import GuuleedSecurity.Domain
import Std

/-! Half-open booking intervals and overlap safety. -/

namespace GuuleedSecurity

/-- A valid interval has positive duration: `[start, finish)`. -/
def intervalValid (slot : Interval) : Prop := slot.start < slot.finish

/-- Adjacent half-open bookings are allowed; shared endpoints do not overlap. -/
def overlaps (left right : Interval) : Prop :=
  left.start < right.finish ∧ right.start < left.finish

def bookingRequestValid (request : BookingRequest) : Prop :=
  request.startMinute < request.endMinute

def bookingMayBeAccepted (request : BookingRequest) : Bool :=
  decide (request.startMinute < request.endMinute) && request.identityVerified

def bookingDecision (request : BookingRequest) : RequestState :=
  if bookingMayBeAccepted request then .accepted else .rejected

theorem accepted_booking_has_positive_duration (request : BookingRequest)
    (h : bookingDecision request = .accepted) : request.startMinute < request.endMinute := by
  simp_all [bookingDecision, bookingMayBeAccepted]

theorem accepted_booking_has_verified_identity (request : BookingRequest)
    (h : bookingDecision request = .accepted) : request.identityVerified = true := by
  simp_all [bookingDecision, bookingMayBeAccepted]

theorem invalid_duration_is_rejected (request : BookingRequest)
    (h : request.endMinute ≤ request.startMinute) : bookingDecision request = .rejected := by
  have hnot : ¬ request.startMinute < request.endMinute := Nat.not_lt.mpr h
  simp [bookingDecision, bookingMayBeAccepted, hnot]

theorem unverified_booking_is_rejected (request : BookingRequest)
    (h : request.identityVerified = false) : bookingDecision request = .rejected := by
  simp [bookingDecision, bookingMayBeAccepted, h]

theorem overlap_symmetric (left right : Interval) :
    overlaps left right ↔ overlaps right left := by
  unfold overlaps
  constructor <;> intro h <;> exact ⟨h.2, h.1⟩

theorem adjacent_intervals_do_not_overlap (left right : Interval)
    (h : left.finish = right.start) : ¬ overlaps left right := by
  intro overlap
  unfold overlaps at overlap
  omega

theorem disjoint_ordered_intervals_do_not_overlap (left right : Interval)
    (h : left.finish ≤ right.start) : ¬ overlaps left right := by
  intro overlap
  unfold overlaps at overlap
  omega

theorem overlapping_intervals_are_not_ordered_disjoint (left right : Interval)
    (h : overlaps left right) : ¬ left.finish ≤ right.start := by
  intro ordered
  unfold overlaps at h
  omega

end GuuleedSecurity
