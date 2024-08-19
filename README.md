# `n` – Interactively Manage Your Node.js Versions

### How To Use
```sh
Usage: n [options] [COMMAND] [args]

Commands:

  n                              Display downloaded Node.js versions and install selection
  n [args ...]                   Execute with [args ...]
  n latest                       Install the latest Node.js release (downloading if necessary)
  n lts                          Install the latest LTS Node.js release (downloading if necessary)
  n <version>                    Install Node.js <version> (downloading if necessary)
  n install <version>            Install Node.js <version> (downloading if necessary)
  n run [args ...]               Execute with [args ...]
  n rm <version ...>             Remove the given downloaded version(s)
  n ls [version]                 Output downloaded versions
  n ls-remote [version]          Output matching versions available for download
  n uninstall                    Remove the installed Node.js
  n node                         Run Node
  n npm                          Run NPM
  n npx                          Run NPX
  n version                      Output Version n
  n init [args ...]              New file package.json

Options:

  -v, -V, -version, --version         Output version of n
  -h, -H, --help                      Display help information

Aliases:

  install: i, install, use, add                      Install and Set Default Version Node.JS 
  uninstall: un, rm, del, uninstall, remove, delete  Remove Node.JS Version
  list: ls, list                                     List Local Node.JS Version
  list-remote: lsr, list-remote                      List Online All Node.JS Version
  run: run                                           Engine Run Auto node, npm, npx
  node: node                                         Engine Run node
  npm: npm                                           Engine Run npx
  npx: npx                                           Engine Run npx
  init: init                                         New file package.json

Versions:

  Numeric version numbers can be complete or incomplete, with an optional leading 'v'.
  Versions can also be specified by label, or codename,
  and other downloadable releases by <remote-folder>/<version>

    4.9.1, 8, v6.1    Numeric versions
    lts               Newest Long Term Support official release
    latest            Newest official release
    boron, carbon     Codenames for release streams
```