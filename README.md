# `n` – Interactively Manage Your Node.js Versions

## How To Setup

#### Windows
1. Download link => [https://github.com/idev-coder/nodejs-version-management/releases/download/v1.3.2/n.exe]("https://github.com/idev-coder/nodejs-version-management/releases/download/v1.3.2/n.exe")

2. Create New Folder Example Folder Name => `n` 

3. Copy `n.exe` Move to Folder `n`

4. Copy Path Folder `n` Example `C:\n` 

5. Set Enviroment Variables

!['Image'](https://idev-coder.github.io/nodejs-version-management/images/env.png)

#### Ubuntu
1. Download link => [https://github.com/idev-coder/nodejs-version-management/releases/download/v1.3.2/n]("https://github.com/idev-coder/nodejs-version-management/releases/download/v1.3.2/n")

2. Create New Folder Example Folder Name => `n-folder` 

3. Copy `n` Move to Folder `n-folder`

4. Copy Path Folder `n-folder` Example `/home/[username]/n-folder` 

5. Set Enviroment Variables

##### Step 1
```sh
nano ~/.bashrc
```

##### Step 2 edit file `.bashrc` and add `export PATH=$PATH:/home/[username]/n-folder`
```sh
export PATH=$PATH:/home/[username]/n-folder
```

##### Step 3
```sh
source ~/.bashrc
```

## How To Use
```sh
Usage: n [options] [COMMAND] [args]

Usage:

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

All commands:

  install: i, install, use, add                      Install and Set Default Version Node.JS 
  install-test: it, install-test
  install-ci-test: ict, install-ci-test
  uninstall: un, rm, del, uninstall, remove, delete  Remove Node.JS Version
  list: ls, list                                     List Local Node.JS Version
  list-remote: lsr, list-remote                      List Online All Node.JS Version
  run: run                                           Engine Run Auto node, npm, npx
  node: node                                         Engine Run node
  npm: npm                                           Engine Run npx
  npx: npx                                           Engine Run npx
  init: init                                         New file package.json
  access: access
  adduser: adduser
  audit: audit
  bugs: bugs
  cache: cache
  ci: ci
  completion: completion
  config: config
  dedupe: dedupe
  deprecate: deprecate
  diff: diff
  dist-tag: dt, dist-tag
  docs: docs,
  doctor: doctor
  edit: edit
  exec: exec
  explain: explain
  explore: explore
  find-dupes: fd, find-dupes
  fund: fund
  get: get
  help-search: hs, help-search
  init: init
  hook: hook
  link: link
  ll: ll
  login: login
  logout: logout
  org: org
  outdated: outdated
  query: query
  rebuild: rebuild
  repo: repo
  restart: restart
  root: root
  run-script: rs, run-script
  sbom: sbom
  search: search
  set: set
  shrinkwrap: shrinkwrap
  star: star
  stars: stars
  stop: stop
  team: team
  view: view
  whoami: whoami
  token: token
  unpublish: unpublish
  unstar: unstar
  update: u, update
  owner: owner
  pack: pack
  ping: ping
  pkg: pkg
  prefix: prefix
  profile: profile
  prune: prune
  publish: publish

Versions:

  Numeric version numbers can be complete or incomplete, with an optional leading 'v'.
  Versions can also be specified by label, or codename,
  and other downloadable releases by <remote-folder>/<version>

    4.9.1, 8, v6.1    Numeric versions
    lts               Newest Long Term Support official release
    latest            Newest official release
    boron, carbon     Codenames for release streams
```