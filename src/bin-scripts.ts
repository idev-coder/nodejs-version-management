export function binScripts(basePath: string, name: string, type: string) {

  if (name === "npx") {
    if (type === "sh") {
      return `#!/usr/bin/env bash

# This is used by the Node.js installer, which expects the cygwin/mingw
# shell script to already be present in the npm dependency folder.

(set -o igncr) 2>/dev/null && set -o igncr; # cygwin encoding fix

basedir=${basePath}

case ${'`uname`'} in
  *CYGWIN*) basedir=${'`cygpath -w "$basedir"`'};;
esac

if [ ${'`uname`'} = 'Linux' ] && type wslpath &>/dev/null ; then
  IS_WSL="true"
fi

NODE_EXE="$basedir/node.exe"
if ! [ -x "$NODE_EXE" ]; then
  NODE_EXE="$basedir/node"
fi
if ! [ -x "$NODE_EXE" ]; then
  NODE_EXE=node
fi

# this path is passed to node.exe, so it needs to match whatever
# kind of paths Node.js thinks it's using, typically win32 paths.
CLI_BASEDIR="$("$NODE_EXE" -p 'require("path").dirname(process.execPath)' 2> /dev/null)"

NPX_CLI_JS="$CLI_BASEDIR/node_modules/npm/bin/npx-cli.js"
if [ $? -ne 0 ]; then
  no_node_dir
fi


"$NODE_EXE" "$NPX_CLI_JS" "$@"
`
    } else if (type === "cmd") {
      return `:: Created by npm, please don't edit manually.
@ECHO OFF

SETLOCAL

SET "NODE_EXE=${basePath}\\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

SET "NPX_CLI_JS=${basePath}\\node_modules\\npm\\bin\\npx-cli.js"

"%NODE_EXE%" "%NPX_CLI_JS%" %*
`
    } else if (type === "pwsh") {
      return `#!/usr/bin/env pwsh

$NODE_EXE="${basePath}/node.exe"
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="${basePath}/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

$NPX_CLI_JS="${basePath}/node_modules/npm/bin/npx-cli.js"

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | & $NODE_EXE $NPX_CLI_JS $args
} else {
  & $NODE_EXE $NPX_CLI_JS $args
}

exit $LASTEXITCODE

`
    }
  } else if (name === "npm") {
    if (type === "sh") {
      return `#!/usr/bin/env bash

# This is used by the Node.js installer, which expects the cygwin/mingw
# shell script to already be present in the npm dependency folder.

(set -o igncr) 2>/dev/null && set -o igncr; # cygwin encoding fix

basedir=${basePath}

case ${'`uname`'} in
  *CYGWIN*) basedir=${'`cygpath -w "$basedir"`'};;
esac

if [ ${'`uname`'} = 'Linux' ] && type wslpath &>/dev/null ; then
  IS_WSL="true"
fi

NODE_EXE="$basedir/node.exe"
if ! [ -x "$NODE_EXE" ]; then
  NODE_EXE="$basedir/node"
fi
if ! [ -x "$NODE_EXE" ]; then
  NODE_EXE=node
fi

# this path is passed to node.exe, so it needs to match whatever
# kind of paths Node.js thinks it's using, typically win32 paths.
CLI_BASEDIR="$("$NODE_EXE" -p 'require("path").dirname(process.execPath)' 2> /dev/null)"

NPM_CLI_JS="$CLI_BASEDIR/node_modules/npm/bin/npm-cli.js"
if [ $? -ne 0 ]; then
  no_node_dir
fi


"$NODE_EXE" "$NPM_CLI_JS" "$@"

`
    } else if (type === "cmd") {
      return `:: Created by npm, please don't edit manually.
@ECHO OFF

SETLOCAL

SET "NODE_EXE=${basePath}\\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

SET "NPM_CLI_JS=${basePath}\\node_modules\\npm\\bin\\npm-cli.js"

"%NODE_EXE%" "%NPM_CLI_JS%" %*
`
    } else if (type === "pwsh") {
      return `#!/usr/bin/env pwsh
$NODE_EXE="${basePath}/node.exe"
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="${basePath}/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

$NPM_CLI_JS="${basePath}/node_modules/npm/bin/npm-cli.js"

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | & $NODE_EXE $NPM_CLI_JS $args
} else {
  & $NODE_EXE $NPM_CLI_JS $args
}

exit $LASTEXITCODE
`
    }
  } else if (name === "node") {
    if (type === "sh") {
      return `#!/usr/bin/env bash

# This is used by the Node.js installer, which expects the cygwin/mingw
# shell script to already be present in the npm dependency folder.

(set -o igncr) 2>/dev/null && set -o igncr; # cygwin encoding fix

basedir=${basePath}

case ${'`uname`'} in
  *CYGWIN*) basedir=${'`cygpath -w "$basedir"`'};;
esac

if [ ${'`uname`'} = 'Linux' ] && type wslpath &>/dev/null ; then
  IS_WSL="true"
fi

NODE_EXE="$basedir/node.exe"
if ! [ -x "$NODE_EXE" ]; then
  NODE_EXE="$basedir/node"
fi
if ! [ -x "$NODE_EXE" ]; then
  NODE_EXE=node
fi

# this path is passed to node.exe, so it needs to match whatever
# kind of paths Node.js thinks it's using, typically win32 paths.
CLI_BASEDIR="$("$NODE_EXE" -p 'require("path").dirname(process.execPath)' 2> /dev/null)"

"$NODE_EXE" "$@"
`
    } else if (type === "cmd") {
      return `:: Created by npm, please don't edit manually.
@ECHO OFF

SETLOCAL

SET "NODE_EXE=${basePath}\\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

"%NODE_EXE%" %*
`
    } else if (type === "pwsh") {
      return `#!/usr/bin/env pwsh

$NODE_EXE="${basePath}/node.exe"
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="${basePath}/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | & $NODE_EXE $args
} else {
  & $NODE_EXE $args
}

exit $LASTEXITCODE
`
    }
  } else if (name === "n_script") {
    if (type === "sh") {
      return `#!/usr/bin/env bash

# กำหนดตำแหน่งของไฟล์ node
NODE_EXE="$PWD/bin/node.exe"

# ตรวจสอบว่าไฟล์ที่กำหนดมีอยู่หรือไม่
if [ ! -f "$NODE_EXE" ]; then
  NODE_EXE="$PWD/bin/node"
fi
if [ ! -f "$NODE_EXE" ]; then
  NODE_EXE="node"
fi

# กำหนดตำแหน่งของ n-cli.js
N_CLI_JS="$PWD/node_modules/@idev-coder/bin/n-cli.js"

# รัน node กับ n-cli.js และเก็บผลลัพธ์
N_BIN=$("$NODE_EXE" "$N_CLI_JS" "$@")

if [ -n "$N_BIN" ]; then
    # แยกผลลัพธ์โดยใช้เว้นวรรค
    IFS=' ' read -r -a array <<< "$N_BIN"
    cmd=${"${array[0]}"}
    args=${"${array[@]:1}"
}
    case "$cmd" in
        *node*)
            "$cmd" $args
            ;;
        *npm*)
            "$cmd" $args
            ;;
        *npx*)
            "$cmd" $args
            ;;
        *)
            echo "$N_BIN"
            ;;
    esac
else
    # ถ้า $N_BIN ไม่มีค่า
    N_V=$("$NODE_EXE" "$N_CLI_JS" "-v")
    NODE_V=$(node -v)
    NPM_V=$(npm -v)
    NPX_V=$(npx -v)

    echo "n $N_V"
    echo "node $NODE_V"
    echo "npm v$NPM_V"
    echo "npx v$NPX_V"
fi
`
    } else if (type === "cmd") {
      return `@echo off
setlocal

rem กำหนดตำแหน่งของไฟล์ node
set "NODE_EXE=%~dp0bin\node.exe"

rem ตรวจสอบว่าไฟล์ที่กำหนดมีอยู่หรือไม่
if not exist "%NODE_EXE%" set "NODE_EXE=%~dp0bin\node"
if not exist "%NODE_EXE%" set "NODE_EXE=node"

rem กำหนดตำแหน่งของ n-cli.js
set "N_CLI_JS=%~dp0node_modules\@idev-coder\bin\n-cli.js"

rem รัน node กับ n-cli.js และเก็บผลลัพธ์
for /f "delims=" %%i in ('"%NODE_EXE%" "%N_CLI_JS%" %*') do set "N_BIN=%%i"

if defined N_BIN (
    rem แยกผลลัพธ์โดยใช้เว้นวรรค
    for /f "tokens=1,* delims= " %%a in ("%N_BIN%") do (
        set "cmd=%%a"
        set "args=%%b"
    )

    rem รันคำสั่งที่เกี่ยวข้อง
    if "%cmd%"=="node" (
        %cmd% %args%
    ) else if "%cmd%"=="npm" (
        %cmd% %args%
    ) else if "%cmd%"=="npx" (
        %cmd% %args%
    ) else (
        echo %N_BIN%
    )
) else (
    rem ถ้า %N_BIN% ไม่มีค่า
    for /f "delims=" %%v in ('"%NODE_EXE%" "%N_CLI_JS%" -v') do set "N_V=%%v"
    for /f "delims=" %%v in ('node -v') do set "NODE_V=%%v"
    for /f "delims=" %%v in ('npm -v') do set "NPM_V=%%v"
    for /f "delims=" %%v in ('npx -v') do set "NPX_V=%%v"
    
    echo n %N_V%
    echo node %NODE_V%
    echo npm v%NPM_V%
    echo npx v%NPX_V%
)

endlocal
`
    } else if (type === "pwsh") {
      return `#!/usr/bin/env pwsh
$NODE_EXE="$PSScriptRoot/bin/node.exe"

if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="$PSScriptRoot/bin/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

$N_CLI_JS="$PSScriptRoot/node_modules/@idev-coder/bin/n-cli.js"

$N_BIN = & $NODE_EXE $N_CLI_JS $args

if($N_BIN) {
    $array = $N_BIN -split " "
    if($array[0] -like "*node*") {
        $NODE_ARGS = $array[1..($array.Length - 1)]
        $BIN_NODE = $array[0]
        & $BIN_NODE $NODE_ARGS
    }elseif($array[0] -like "*npm*") {
        $NPM_ARGS = $array[1..($array.Length - 1)]
        $BIN_NPM = $array[0]
        & $BIN_NPM $NPM_ARGS
    }elseif($array[0] -like "*npx*") {
        $NPX_ARGS = $array[1..($array.Length - 1)]
        $BIN_NPX = $array[0]
        & $BIN_NPX $NPX_ARGS
    }else {
        Write-Output $N_BIN
    }
}else {
    $N_V = & $NODE_EXE $N_CLI_JS "-v"
    $NODE_V = & "node" "-v"
    $NPM_V = & "npm" "-v"
    $NPX_V = & "npx" "-v"
    Write-Output "n $N_V"
    Write-Output "node $NODE_V"
    Write-Output "npm v$NPM_V"
    Write-Output "npx v$NPX_V"
}

`
    }
  }
}
