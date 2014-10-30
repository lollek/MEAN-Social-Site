#! /usr/bin/env bash
set -x

pushd "$(dirname "$0")" > /dev/null
jscover="node_modules/jscover/bin/jscover"
mocha="node_modules/mocha/bin/mocha"

function cover_folder() {
  "$jscover" "packages/${1}/server"{,-cov}
  "$mocha"   "packages/${1}/server-cov/"* -R html-cov > "coverage_${1}.html"
}

for folder in theme system access users articles; do
  cover_folder "$(basename "$folder")"
done

popd > /dev/null
