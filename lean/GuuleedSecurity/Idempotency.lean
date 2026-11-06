import Std

/-! A minimal idempotency-key ledger with reserve-once semantics. -/

namespace GuuleedSecurity

abbrev Key := Nat
abbrev Ledger := List Key

def keyIsFresh (ledger : Ledger) (key : Key) : Prop := key ∉ ledger

/-- Reserve a key once. A repeated key leaves the ledger unchanged. -/
noncomputable def reserveKey (ledger : Ledger) (key : Key) : Ledger := by
  classical
  exact if keyIsFresh ledger key then key :: ledger else ledger

theorem reserve_fresh_key_records_it (ledger : Ledger) (key : Key)
    (fresh : key ∉ ledger) : key ∈ reserveKey ledger key := by
  simp [reserveKey, keyIsFresh, fresh]

theorem reserve_repeated_key_does_not_grow (ledger : Ledger) (key : Key)
    (used : key ∈ ledger) : reserveKey ledger key = ledger := by
  simp [reserveKey, keyIsFresh, used]

theorem reserve_preserves_old_keys (ledger : Ledger) (key old : Key)
    (present : old ∈ ledger) : old ∈ reserveKey ledger key := by
  by_cases fresh : keyIsFresh ledger key
  · simp [reserveKey, fresh, present]
  · simp [reserveKey, fresh, present]

theorem reserved_key_cannot_be_fresh (ledger : Ledger) (key : Key)
    (used : key ∈ ledger) : ¬ keyIsFresh ledger key := by
  intro fresh
  exact fresh used

theorem ledger_length_increases_only_for_fresh_keys (ledger : Ledger) (key : Key)
    (fresh : key ∉ ledger) :
    (reserveKey ledger key).length = ledger.length + 1 := by
  simp [reserveKey, keyIsFresh, fresh]

theorem ledger_length_is_unchanged_for_used_keys (ledger : Ledger) (key : Key)
    (used : key ∈ ledger) :
    (reserveKey ledger key).length = ledger.length := by
  simp [reserveKey, keyIsFresh, used]

end GuuleedSecurity
