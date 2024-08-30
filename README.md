<div align="center">
<a href="https://github.com/idev-coder/nodejs-version-management">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/idev-coder/nodejs-version-management/main/images/logo.svg" />
    <img src="https://raw.githubusercontent.com/idev-coder/nodejs-version-management/main/images/logo.svg" height="50" alt="nvm project logo" />
  </picture>
</a>
 <br>
<h1>Node.JS Version Management</h1>
<br>

[![npm][npm]][npm-url] 

 <br>

<a href="https://npmcharts.com/compare/@idev-coder/n?minimal=true">
		<img src="https://img.shields.io/npm/dm/@idev-coder/n.svg">
</a> 
<a href="https://packagephobia.com/result?p=@idev-coder/n">
		<img src="https://packagephobia.com/badge?p=@idev-coder/n" alt="install size">
</a>
<a href="https://opencollective.com/nodejs-version-management#sponsors">
		<img src="https://opencollective.com/nodejs-version-management/sponsors/badge.svg">
</a>
<a href="https://github.com/idev-coder/nodejs-version-management/graphs/contributors">
		<img src="https://img.shields.io/github/contributors/idev-coder/nodejs-version-management.svg">
</a>

 <br>

 <p>
 n is a tool used for managing and switching between different versions of Node.js with ease. With its concise and convenient commands, users can quickly install and switch between various Node.js versions without needing to reconfigure or reinstall. Additionally, n helps users efficiently manage Node.js versions without worrying about code compatibility across different versions of Node.js. 
  </p>
 <br>
  <a href="https://github.com/idev-coder/nodejs-version-management/releases/latest" target="_blank">Download!</a>
</div>


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
  npm: npm                                           Engine Run npm
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

[npm]: https://img.shields.io/npm/v/@idev-coder/n.svg
[npm-url]: https://npmjs.com/package/@idev-coder/n