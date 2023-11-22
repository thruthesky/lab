#!/usr/local/bin/ts-node
import { execSync } from "child_process";
execSync(`ls -l`, { stdio: 'inherit' });

