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

function no_node_dir {
  # if this didn't work, then everything else below will fail
  echo "Could not determine Node.js install directory" >&2
  exit 1
}

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
if [ $? -ne 0 ]; then
  # this fails under WSL 1 so add an additional message. we also suppress stderr above
  # because the actual error raised is not helpful. in WSL 1 node.exe cannot handle
  # output redirection properly. See https://github.com/microsoft/WSL/issues/2370
  if [ "$IS_WSL" == "true" ]; then
    echo "WSL 1 is not supported. Please upgrade to WSL 2 or above." >&2
  fi
  no_node_dir
fi
NPM_PREFIX_JS="$CLI_BASEDIR/node_modules/npm/bin/npm-prefix.js"
NPX_CLI_JS="$CLI_BASEDIR/node_modules/npm/bin/npx-cli.js"
NPM_PREFIX=${'`"$NODE_EXE" "$NPM_PREFIX_JS"`'}
if [ $? -ne 0 ]; then
  no_node_dir
fi
NPM_PREFIX_NPX_CLI_JS="$NPM_PREFIX/node_modules/npm/bin/npx-cli.js"

# a path that will fail -f test on any posix bash
NPX_WSL_PATH="/.."

# WSL can run Windows binaries, so we have to give it the win32 path
# however, WSL bash tests against posix paths, so we need to construct that
# to know if npm is installed globally.
if [ "$IS_WSL" == "true" ]; then
  NPX_WSL_PATH=${'`wslpath "$NPM_PREFIX_NPX_CLI_JS"`'}
fi
if [ -f "$NPM_PREFIX_NPX_CLI_JS" ] || [ -f "$NPX_WSL_PATH" ]; then
  NPX_CLI_JS="$NPM_PREFIX_NPX_CLI_JS"
fi

"$NODE_EXE" "$NPX_CLI_JS" "$@"


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

function no_node_dir {
  # if this didn't work, then everything else below will fail
  echo "Could not determine Node.js install directory" >&2
  exit 1
}

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
if [ $? -ne 0 ]; then
  # this fails under WSL 1 so add an additional message. we also suppress stderr above
  # because the actual error raised is not helpful. in WSL 1 node.exe cannot handle
  # output redirection properly. See https://github.com/microsoft/WSL/issues/2370
  if [ "$IS_WSL" == "true" ]; then
    echo "WSL 1 is not supported. Please upgrade to WSL 2 or above." >&2
  fi
  no_node_dir
fi
NPM_PREFIX_JS="$CLI_BASEDIR/node_modules/npm/bin/npm-prefix.js"
NPM_CLI_JS="$CLI_BASEDIR/node_modules/npm/bin/npm-cli.js"
NPM_PREFIX=${'`"$NODE_EXE" "$NPM_PREFIX_JS"`'}
if [ $? -ne 0 ]; then
  no_node_dir
fi
NPM_PREFIX_NPM_CLI_JS="$NPM_PREFIX/node_modules/npm/bin/npm-cli.js"

# a path that will fail -f test on any posix bash
NPM_WSL_PATH="/.."

# WSL can run Windows binaries, so we have to give it the win32 path
# however, WSL bash tests against posix paths, so we need to construct that
# to know if npm is installed globally.
if [ "$IS_WSL" == "true" ]; then
  NPM_WSL_PATH=${'`wslpath "$NPM_PREFIX_NPM_CLI_JS"`'}
fi
if [ -f "$NPM_PREFIX_NPM_CLI_JS" ] || [ -f "$NPM_WSL_PATH" ]; then
  NPM_CLI_JS="$NPM_PREFIX_NPM_CLI_JS"
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

SET "NPM_PREFIX_JS=${basePath}\\node_modules\\npm\\bin\\npm-prefix.js"
SET "NPM_CLI_JS=${basePath}\\node_modules\\npm\\bin\\npm-cli.js"
FOR /F "delims=" %%F IN ('CALL "%NODE_EXE%" "%NPM_PREFIX_JS%"') DO (
  SET "NPM_PREFIX_NPM_CLI_JS=%%F\\node_modules\\npm\\bin\\npm-cli.js"
)
IF EXIST "%NPM_PREFIX_NPM_CLI_JS%" (
  SET "NPM_CLI_JS=%NPM_PREFIX_NPM_CLI_JS%"
)

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

$NPM_PREFIX_JS="${basePath}/node_modules/npm/bin/npm-prefix.js"
$NPM_CLI_JS="${basePath}/node_modules/npm/bin/npm-cli.js"
$NPM_PREFIX=(& $NODE_EXE $NPM_PREFIX_JS)

if ($LASTEXITCODE -ne 0) {
  Write-Host "Could not determine Node.js install directory"
  exit 1
}

$NPM_PREFIX_NPM_CLI_JS="$NPM_PREFIX/node_modules/npm/bin/npm-cli.js"
if (Test-Path $NPM_PREFIX_NPM_CLI_JS) {
  $NPM_CLI_JS=$NPM_PREFIX_NPM_CLI_JS
}

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

function no_node_dir {
  # if this didn't work, then everything else below will fail
  echo "Could not determine Node.js install directory" >&2
  exit 1
}

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
if [ $? -ne 0 ]; then
  # this fails under WSL 1 so add an additional message. we also suppress stderr above
  # because the actual error raised is not helpful. in WSL 1 node.exe cannot handle
  # output redirection properly. See https://github.com/microsoft/WSL/issues/2370
  if [ "$IS_WSL" == "true" ]; then
    echo "WSL 1 is not supported. Please upgrade to WSL 2 or above." >&2
  fi
  no_node_dir
fi

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
  
if ($LASTEXITCODE -ne 0) {
  Write-Host "Could not determine Node.js install directory"
  exit 1
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

# Define the BIN_EXE variable
BIN_EXE="$(dirname "$0")/bin.exe"

# Check if the file exists
if [ ! -f "$BIN_EXE" ]; then
    BIN_EXE="$(dirname "$0")/bin"
fi

# Check if the file still does not exist
if [ ! -f "$BIN_EXE" ]; then
    BIN_EXE="bin"
fi

# Run the executable and capture its output
N_BIN=$("$BIN_EXE" "$@")
EXIT_CODE=$?

# Check the exit code
if [ $EXIT_CODE -eq 0 ]; then
    if [ -n "$N_BIN" ]; then
        # Split the output into array elements
        IFS=' ' read -r -a array <<< "$N_BIN"
        first_token=${"${array[0]}"}
        remaining_tokens=${"${array[@]:1}"}

        case "$first_token" in
            node*)
                $first_token $remaining_tokens
                ;;
            npm*)
                $first_token $remaining_tokens
                ;;
            npx*)
                $first_token $remaining_tokens
                ;;
            *)
                echo "$N_BIN"
                ;;
        esac
    else
        # Output the version information
        N_V=$("$BIN_EXE" -v)
        NODE_V=$(node -v)
        NPM_V=$(npm -v)
        NPX_V=$(npx -v)

        echo "n $N_V"
        echo "node $NODE_V"
        echo "npm v$NPM_V"
        echo "npx v$NPX_V"
    fi
else
    echo "Node.js script failed with exit code $EXIT_CODE"
fi
`
    } else if (type === "cmd") {
      return `@echo off
setlocal

REM Define the BIN_EXE variable
set "BIN_EXE=%~dp0bin.exe"

REM Check if the file exists
if not exist "%BIN_EXE%" (
    set "BIN_EXE=%~dp0bin"
)

REM Check if the file still does not exist
if not exist "%BIN_EXE%" (
    set "BIN_EXE=bin"
)

REM Run the executable and capture its output
for /f "delims=" %%i in ('"%BIN_EXE%" %*') do set "N_BIN=%%i"

REM Check the error level (equivalent to $LASTEXITCODE in PowerShell)
if %ERRORLEVEL% equ 0 (
    if not "%N_BIN%"=="" (
        REM Split the output into array elements
        setlocal enabledelayedexpansion
        set "array=!N_BIN!"
        for /f "tokens=1,* delims= " %%a in ("!array!") do (
            set "first_token=%%a"
            set "remaining_tokens=%%b"
        )

        REM Check the first token and execute the corresponding command
        if /i "%first_token%"=="node" (
            call %first_token% %remaining_tokens%
        ) else if /i "%first_token%"=="npm" (
            call %first_token% %remaining_tokens%
        ) else if /i "%first_token%"=="npx" (
            call %first_token% %remaining_tokens%
        ) else (
            echo %N_BIN%
        )
        endlocal
    ) else (
        REM Output the version information
        for /f "delims=" %%v in ('"%BIN_EXE% -v"') do set "N_V=%%v"
        for /f "delims=" %%v in ('"node -v"') do set "NODE_V=%%v"
        for /f "delims=" %%v in ('"npm -v"') do set "NPM_V=%%v"
        for /f "delims=" %%v in ('"npx -v"') do set "NPX_V=%%v"

        echo n %N_V%
        echo node %NODE_V%
        echo npm v%NPM_V%
        echo npx v%NPX_V%
    )
) else (
    echo Node.js script failed with exit code %ERRORLEVEL%
)

endlocal
`
    } else if (type === "pwsh") {
      return `#!/usr/bin/env pwsh
$BIN_EXE="$PSScriptRoot/bin.exe"

if (-not (Test-Path $BIN_EXE)) {
  $BIN_EXE="$PSScriptRoot/bin"
}
if (-not (Test-Path $BIN_EXE)) {
  $BIN_EXE="bin"
}

$N_BIN = & $BIN_EXE $args
if ($LASTEXITCODE -eq 0) {
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
        $N_V = & $BIN_EXE "-v"
        $NODE_V = & "node" "-v"
        $NPM_V = & "npm" "-v"
        $NPX_V = & "npx" "-v"
        Write-Output "n $N_V"
        Write-Output "node $NODE_V"
        Write-Output "npm v$NPM_V"
        Write-Output "npx v$NPX_V"
    }
} else {
    Write-Output "Node.js script failed with exit code $LASTEXITCODE"
}

`
    }
  }
}
