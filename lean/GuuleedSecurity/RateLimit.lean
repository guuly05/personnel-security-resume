import Std

/-! A deterministic request quota and proofs about its boundary behavior. -/

namespace GuuleedSecurity

structure Quota where
  capacity : Nat
  remaining : Nat
  deriving DecidableEq, Repr

def quotaInvariant (quota : Quota) : Prop := quota.remaining ≤ quota.capacity

/-- A successful request spends exactly one unit; an empty quota denies it. -/
def consumeQuota (quota : Quota) : Option Quota :=
  if quota.remaining = 0 then none
  else some { quota with remaining := quota.remaining - 1 }

/-- A new window restores the configured limit. -/
def refillQuota (quota : Quota) : Quota :=
  { quota with remaining := quota.capacity }

theorem empty_quota_denies (capacity : Nat) :
    consumeQuota ⟨capacity, 0⟩ = none := by
  simp [consumeQuota]

theorem positive_quota_allows (quota : Quota)
    (positive : 0 < quota.remaining) :
    consumeQuota quota = some { quota with remaining := quota.remaining - 1 } := by
  simp [consumeQuota, Nat.ne_of_gt positive]

theorem successful_request_spends_one (quota next : Quota)
    (consumed : consumeQuota quota = some next) : next.remaining + 1 = quota.remaining := by
  unfold consumeQuota at consumed
  by_cases empty : quota.remaining = 0
  · simp [empty] at consumed
  · cases next with
    | mk nextCapacity nextRemaining =>
      have positive : 1 ≤ quota.remaining := Nat.one_le_iff_ne_zero.mpr empty
      simp [empty] at consumed
      rcases consumed with ⟨_, remainingEq⟩
      rw [← remainingEq]
      exact Nat.sub_add_cancel positive

theorem successful_request_preserves_capacity (quota next : Quota)
    (consumed : consumeQuota quota = some next) : next.capacity = quota.capacity := by
  unfold consumeQuota at consumed
  by_cases empty : quota.remaining = 0
  · simp [empty] at consumed
  · cases next with
    | mk nextCapacity nextRemaining =>
      simp [empty] at consumed
      exact consumed.1.symm

theorem quota_never_increases_on_consume (quota next : Quota)
    (consumed : consumeQuota quota = some next) : next.remaining ≤ quota.remaining := by
  have exactSpend := successful_request_spends_one quota next consumed
  omega

theorem refill_restores_capacity (quota : Quota) :
    (refillQuota quota).remaining = quota.capacity := by
  rfl

theorem refill_preserves_capacity (quota : Quota) :
    (refillQuota quota).capacity = quota.capacity := by
  rfl

theorem quota_within_capacity_after_refill (quota : Quota) :
    quotaInvariant (refillQuota quota) := by
  simp [quotaInvariant, refillQuota]

theorem quota_invariant_after_consumption (quota next : Quota)
    (invariant : quotaInvariant quota)
    (consumed : consumeQuota quota = some next) : quotaInvariant next := by
  have exactSpend := successful_request_spends_one quota next consumed
  have sameCapacity := successful_request_preserves_capacity quota next consumed
  simp [quotaInvariant] at invariant ⊢
  rw [sameCapacity]
  omega

theorem remaining_quota_is_nonnegative (quota : Quota) : 0 ≤ quota.remaining := by
  omega

end GuuleedSecurity
