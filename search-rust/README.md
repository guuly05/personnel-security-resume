# Portfolio search engine

This crate powers full-text search across public portfolio content. Rust owns
normalization, inverted-index construction, weighted field scoring, prefix and
phrase matching, ranking, and excerpt generation. The browser UI consumes the
small JSON interface exposed through WebAssembly; no search query or document
is sent to a server.

Open search from the header or press `Ctrl+K` (`⌘K` on macOS). The index is
loaded on first use, then queries run synchronously in WebAssembly against the
public portfolio corpus already bundled in the browser.

## Build the WebAssembly package

Run `npm run build`; the build script installs stable Rust on Linux when needed,
adds the WebAssembly target, and generates the package before building the site.
To generate it separately, run `npm run search:wasm` from the repository root.
For local Windows development, install Rust and the Visual C++ build tools first.
Use `cargo test --manifest-path search-rust/Cargo.toml` for native unit tests.
