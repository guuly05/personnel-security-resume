import Lake
open Lake DSL

package «guuleed-security» where
  version := v!"0.1.0"

lean_lib GuuleedSecurity

@[default_target]
lean_exe «security-model» where
  root := `Main
