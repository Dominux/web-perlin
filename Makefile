gen_wasm:
	cd wasm-perlin && wasm-pack build --target web --out-dir ../benchmark/wasm-perlin-pkg || cd -

run_server:
	cd benchmark && python3 -m http.server || cd -
