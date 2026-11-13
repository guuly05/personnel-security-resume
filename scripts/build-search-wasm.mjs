import { chmodSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const cargoHome = process.env.CARGO_HOME || path.join(os.homedir(), '.cargo');
const rustupHome = process.env.RUSTUP_HOME || path.join(os.homedir(), '.rustup');
const cargoBin = path.join(cargoHome, 'bin');
const rustupName = process.platform === 'win32' ? 'rustup.exe' : 'rustup';
const rustupPath = path.join(cargoBin, rustupName);
const env = {
  ...process.env,
  CARGO_HOME: cargoHome,
  RUSTUP_HOME: rustupHome,
  RUSTUP_TOOLCHAIN: 'stable',
  PATH: [cargoBin, ...(process.platform === 'linux' ? ['/rust/bin'] : []), process.env.PATH ?? ''].join(path.delimiter),
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function installRustup() {
  if (process.platform !== 'linux' || !['x64', 'arm64'].includes(process.arch)) {
    throw new Error('Rust is required. Install rustup and the wasm32-unknown-unknown target, then retry.');
  }

  const host = process.arch === 'arm64' ? 'aarch64-unknown-linux-gnu' : 'x86_64-unknown-linux-gnu';
  const installerPath = path.join(os.tmpdir(), 'rustup-init');
  const response = await fetch(`https://static.rust-lang.org/rustup/dist/${host}/rustup-init`);
  if (!response.ok) throw new Error(`Could not download rustup-init (${response.status}).`);
  writeFileSync(installerPath, Buffer.from(await response.arrayBuffer()));
  chmodSync(installerPath, 0o755);
  run(installerPath, ['-y', '--profile', 'minimal', '--default-toolchain', 'stable', '--target', 'wasm32-unknown-unknown', '--no-modify-path']);
}

function findRustup() {
  const result = spawnSync(rustupPath, ['--version'], { env, stdio: 'ignore', shell: process.platform === 'win32' });
  return result.status === 0 ? rustupPath : null;
}

let rustup = findRustup();
if (!rustup) {
  await installRustup();
  rustup = findRustup();
}
if (!rustup) throw new Error('rustup not found after install');
run(rustup, ['default', 'stable']);
run(rustup, ['target', 'add', 'wasm32-unknown-unknown', '--toolchain', 'stable']);
const wasmPack = spawnSync('wasm-pack', ['--version'], { env, stdio: 'ignore', shell: process.platform === 'win32' });
if (wasmPack.status !== 0) run(process.execPath, [path.resolve('node_modules/wasm-pack/install.js')]);
run('wasm-pack', ['build', 'search-rust', '--target', 'bundler', '--out-dir', 'pkg', '--release']);
