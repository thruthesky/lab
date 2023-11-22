#!/usr/local/bin/ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
(0, child_process_1.execSync)(`ls -l`, { stdio: 'inherit' });
