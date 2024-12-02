#!/usr/bin/env node
import { commands } from "./commands";

commands(process.argv.slice(2).toString().split(' '))