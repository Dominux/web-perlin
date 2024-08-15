download_perlinjs:
	wget -O ./benchmark/perlin.js https://raw.githubusercontent.com/josephg/noisejs/master/perlin.js

gen_wasm:
	cd ./wasm-perlin && wasm-pack build --target web --out-dir ../benchmark/wasm-perlin-pkg || cd -

run_server:
	cd ./benchmark && python3 -m http.server || cd -
