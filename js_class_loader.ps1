#!/bin/pwsh

$files = gci -Recurse js/app -Include "*.js" | Resolve-Path -Relative | % { "$_" }
$files = "[" + [System.String]::Join(", ", $files] + "]" > js/load.js
