function shScript(name: string, pathName: string): any {
    const data: any = {}
    data.name = name
    data.script = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case ${'`uname`'} in
    *CYGWIN*|*MINGW*|*MSYS*)
        if command -v cygpath > /dev/null 2>&1; then
            basedir=${'`cygpath -w "$basedir"`'}
        fi
    ;;
esac

exec "$basedir/node_modules/${pathName}"   "$@"
    `
    return data
}

function cmdScript(name: string, pathName: string) {
    const data: any = {}
    data.name = name
    data.script = `
@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\\node.exe" (
  SET "_prog=%dp0%\\node.exe"
) ELSE (
  SET "_prog=node"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%dp0%\\node_modules\\${pathName}" %*
    `
    return data
}

function ps1Script(name: string, pathName: string) {
    const data: any = {}
    data.name = name
    data.script = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir/node$exe") {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "$basedir/node$exe"  "$basedir/node_modules/${pathName}" $args
  } else {
    & "$basedir/node$exe"  "$basedir/node_modules/${pathName}" $args
  }
  $ret=$LASTEXITCODE
} else {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "node$exe"  "$basedir/node_modules/${pathName}" $args
  } else {
    & "node$exe"  "$basedir/node_modules/${pathName}" $args
  }
  $ret=$LASTEXITCODE
}
exit $ret
    `
    return data
}

const binPaths = [
    {
        path: "bun/bin/bun.exe",
        files: [
            "bun",
            "bunx",
            "bun.cmd",
            "bunx.cmd",
            "bun.ps1",
            "bunx.ps1"
        ]
    },
    {
        path: "@idev-coder/n/bin/n-cli.cjs",
        files: [
            "n",
            "n.cmd",
            "n.ps1"
        ]
    },
    {
        path: "pnpm/bin/pnpm.cjs",
        files: [
            "pnpm",
            "pnpm.cmd",
            "pnpm.ps1"
        ]
    },
    {
        path: "pnpm/bin/pnpx.cjs",
        files: [
            "pnpx",
            "pnpx.cmd",
            "pnpx.ps1"
        ]
    },
    {
        path: "yarn/bin/yarn.js",
        files: [
            "yarn",
            "yarn.cmd",
            "yarn.ps1",
            "yarnpkg",
            "yarnpkg.cmd",
            "yarnpkg.ps1"
        ]
    }
]

const binScripts = binPaths.map(({ path, files }) => {
    return files.map(val => {
        if (val.includes(".cmd")) {
            return cmdScript(val, path.replaceAll('/', '\\'))
        } else if (val.includes(".ps1")) {
            return ps1Script(val, path)
        } else {
            return shScript(val, path)
        }

    })
}).flat()

export default binScripts
