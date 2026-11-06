# Formally specified security rules

This Lean 4 project makes the policy reasoning behind selected portfolio
workflows inspectable and machine-checked. The model is deliberately small and
uses only Lean's standard library, so it has no mathlib dependency.

## Scope

The modules model request acceptance gates, half-open booking intervals,
idempotency-key reservation, and role/clinic authorization. The theorems prove
properties of those definitions. They do **not** prove that the production
React, TypeScript, Vercel, database, or provider code implements these same
rules. The model is a standalone specification and portfolio exercise.

## Modules

| Module | Contents |
| --- | --- |
| `Domain.lean` | Actors, operations, request states, and request/interval data |
| `Contact.lean` | Required fields, Turnstile and rate-limit gates, rejection proofs |
| `Booking.lean` | Positive-duration slots, half-open overlap, adjacency and rejection proofs |
| `Authorization.lean` | Role capabilities, clinic scoping, and least-privilege proofs |
| `Idempotency.lean` | A list-backed key ledger with reserve-once properties |
| `RateLimit.lean` | Request quota consumption, refill behavior, and invariant proofs |
| `Workflow.lean` | Composition of contact gates and end-to-end acceptance properties |

## Build

Install Lean 4 through the official Lean 4 VS Code extension or install Elan,
then run from this directory:

```sh
lake build
lake exe security-model
```

`lean-toolchain` pins the compiler used by local development and CI. At the
repository root, `npm run lean:check` runs the same `lake build` command.

## Main verified properties

- An accepted contact request has an email, a message, successful Turnstile
  verification, and rate-limit capacity.
- Missing required fields, failed bot verification, or exhausted rate capacity
  reject contact requests.
- An accepted booking has positive duration and verified identity.
- Half-open bookings that touch at an endpoint do not overlap; overlap is
  symmetric, and ordered disjoint intervals cannot overlap.
- Clinic staff and clinic administrators cannot operate on a different
  clinic's records; system administration is reserved for the system admin.
- Reserving a fresh idempotency key records it; reserving a used key leaves the
  ledger unchanged.
- Rate-limit consumption denies an empty quota, spends exactly one unit on
  success, preserves the capacity invariant, and refills to the configured
  capacity.

These are small policy theorems, not a verification of external services,
concurrency behavior, storage durability, or production implementation.
