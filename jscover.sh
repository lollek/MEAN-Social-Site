#! /usr/bin/env bash
set -ex

pushd "$(dirname "$0")" > /dev/null
jscover="node_modules/jscover/bin/jscover"
mocha="node_modules/mocha/bin/mocha"



function cover_folder() {
  "$jscover" "packages/${1}/server"{,-cov}
  rm -rf     "packages/${1}/server-cov/tests"
  "$mocha"   "packages/${1}/server-cov/"* -R html-cov > "coverage_${1}.html"
  rm -rf     "packages/${1}/server-cov"
}

for folder in packages/*; do
  cover_folder "$(basename "$folder")"
done

popd > /dev/null
