# Portfolio search engine

This crate powers full-text search across public portfolio content. Rust owns
normalization, inverted-index construction, weighted field scoring, prefix and
phrase matching, ranking, and excerpt generation. The browser UI consumes the
small JSON interface exposed through WebAssembly; no search query or document
is sent to a server.

## Build the WebAssembly package

Install Rust and `wasm-pack`, then run `npm run search:wasm` from the repository
root. The generated `pkg/` output is ignored by git and recreated for builds.
Use `cargo test --manifest-path search-rust/Cargo.toml` for native unit tests.
