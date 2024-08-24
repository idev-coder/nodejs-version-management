(()=>{"use strict";var e={8799:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);i&&!("get"in i?!t.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return i(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE=t.DIR_PATH_HOME_DOT_N_VERSION_FOLDER=t.DIR_PATH_HOME_DOT_N_FOLDER=t.DIR_PATH_HOME_FOLDER=t.DIR_PATH_PROJECT_PACKAGE_JSON_FILE=t.DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE=t.DIR_PATH_PROJECT_DOT_NVMRC_FILE=t.DIR_PATH_PROJECT_DOT_NRC_FILE=t.DIR_PATH_PROJECT=t.VERSION=t.arch=t.platform=t.MSG_REMOVE_NODE_VERSION_FAILED=t.MSG_REMOVE_NODE_VERSION_SUCCESS=t.MSG_NODE_NOT_VERSION_TYPE=t.MSG_NODE_VERSION_NOT_FOULT=t.NODE_DOWNLOAD_MIRROR_URI=t.NODE_MIRROR_URI=void 0;const _=o(n(857)),s=o(n(6928)),c=o(n(8330)),u=n(8620);t.NODE_MIRROR_URI="https://nodejs.org/dist",t.NODE_DOWNLOAD_MIRROR_URI="https://nodejs.org/download",t.MSG_NODE_VERSION_NOT_FOULT="node.js version not found",t.MSG_NODE_NOT_VERSION_TYPE="node.js not version type",t.MSG_REMOVE_NODE_VERSION_SUCCESS=e=>`remove node.js ${e} success`,t.MSG_REMOVE_NODE_VERSION_FAILED=e=>`remove node.js ${e} failed`,t.platform="win32"===_.platform()?"win":_.platform(),t.arch=_.arch(),t.VERSION=c.version,t.DIR_PATH_PROJECT=(0,u.projectPathFile)(""),t.DIR_PATH_PROJECT_DOT_NRC_FILE=(0,u.projectPathFile)(".nrc"),t.DIR_PATH_PROJECT_DOT_NVMRC_FILE=(0,u.projectPathFile)(".nvmrc"),t.DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE=(0,u.projectPathFile)(".node-version"),t.DIR_PATH_PROJECT_PACKAGE_JSON_FILE=(0,u.projectPathFile)("package.json"),t.DIR_PATH_HOME_FOLDER=_.homedir(),t.DIR_PATH_HOME_DOT_N_FOLDER=s.join(t.DIR_PATH_HOME_FOLDER,".n"),t.DIR_PATH_HOME_DOT_N_VERSION_FOLDER=s.join(t.DIR_PATH_HOME_DOT_N_FOLDER,"versions"),t.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE=s.join(t.DIR_PATH_HOME_DOT_N_FOLDER,".nrc")},4404:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);i&&!("get"in i?!t.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return i(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.engineNodeBin=function(){return"win32"===_.platform()?"node.exe":"bin/node"},t.engineNPMBin=function(){return"win32"===_.platform()?"npm":"bin/npm"},t.engineNPXBin=function(){return"win32"===_.platform()?"npx":"bin/npx"};const _=o(n(857))},1350:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);i&&!("get"in i?!t.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return i(t,e),t},_=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function _(e){try{c(r.next(e))}catch(e){o(e)}}function s(e){try{c(r.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(_,s)}c((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.readFileSystem=u,t.readNodeVersion=function(){return _(this,void 0,void 0,(function*(){try{var e,t;if(e=yield u(c.DIR_PATH_PROJECT_DOT_NRC_FILE),e=yield u(c.DIR_PATH_PROJECT_DOT_NVMRC_FILE),e=yield u(c.DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE))return e;{let n=yield u(c.DIR_PATH_PROJECT_PACKAGE_JSON_FILE);return n&&(t=JSON.parse(n)).engines&&t.engines.node?t.engines.node:e=yield u(c.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)}}catch(e){return e}}))},t.removeNodeVersion=function(e){return _(this,void 0,void 0,(function*(){try{const t=s.readdirSync(c.DIR_PATH_HOME_DOT_N_VERSION_FOLDER,{withFileTypes:!0}),n=[];t.forEach((e=>{e.isDirectory()&&n.push(e.name)}));let r=n.filter((t=>t.includes(e)));return s.rmSync(`${c.DIR_PATH_HOME_DOT_N_VERSION_FOLDER}/${r[0]}`,{recursive:!0,force:!0}),(0,c.MSG_REMOVE_NODE_VERSION_SUCCESS)(r[0])}catch(e){return e}}))};const s=o(n(9896)),c=n(8799);function u(e){try{return s.readFileSync(e,"utf8")}catch(e){return""}}},2010:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function _(e){try{c(r.next(e))}catch(e){o(e)}}function s(e){try{c(r.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(_,s)}c((r=r.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.npx=function(e){return r(this,void 0,void 0,(function*(){try{const t=yield(0,_.readNodeVersion)(),n=(0,c.engineNPXBin)(),r=u.default.join(s.DIR_PATH_HOME_DOT_N_VERSION_FOLDER,t,n),i=(0,o.spawn)(r,e,{stdio:["pipe","pipe",process.stderr],shell:!0});i.stdout.on("data",(e=>{process.stdout.write(`${e}`)})),i.on("close",(e=>{})),i.on("exit",(e=>{}))}catch(e){process.stdout.write(`${e}`)}}))};const o=n(5317),_=n(1350),s=n(8799),c=n(4404),u=i(n(6928))},8620:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);i&&!("get"in i?!t.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return i(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.projectPathFile=function(e){return u(c,e)};const _=o(n(6928)),s=o(n(9896)).realpathSync(process.cwd()),c=e=>_.resolve(s,e),u=(e,t)=>e(`${t}`)},5317:e=>{e.exports=require("child_process")},9896:e=>{e.exports=require("fs")},857:e=>{e.exports=require("os")},6928:e=>{e.exports=require("path")},8330:e=>{e.exports=JSON.parse('{"name":"@idev-coder/n","version":"1.3.5","main":"bin/n.js","homepage":"https://idev-coder.github.io/nodejs-version-management/","bugs":"https://github.com/idev-coder/nodejs-version-management/issues","contributors":[{"name":"n Contributors","url":"https://github.com/idev-coder/nodejs-version-management/graphs/contributors"}],"bin":{"n":"bin/n.js"},"scripts":{"test":"echo \\"Error: no test specified\\" && exit 1","build":"webpack","start":"ts-node ./src/index.ts","build:pkg:n":"pkg -t node18-win bin/n.js -o build/n.exe","build:pkg:node":"pkg -t node18-win bin/node.js -o build/node.exe","build:pkg:npm":"pkg -t node18-win bin/npm.js -o build/npm.exe","build:pkg:npx":"pkg -t node18-win bin/npx.js -o build/npx.exe"},"preferGlobal":true,"keywords":["nvm","node","npm","npx","manager","version"],"repository":{"type":"git","url":"git://github.com/idev-coder/nodejs-version-management.git"},"files":["bin"],"author":"Natthapat Piasangka <n.devs260340@gmail.com>","license":"ISC","description":"Node.JS Version Management","devDependencies":{"@types/progress-stream":"^2.0.5","pkg":"^5.8.1","ts-loader":"^9.5.1","ts-node":"^10.9.2","typescript":"^5.5.4","webpack":"^5.93.0","webpack-cli":"^5.1.4"},"dependencies":{"progress-stream":"^2.0.0","readline":"^1.3.0"}}')}},t={};(0,function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}(2010).npx)(process.argv.slice(2))})();