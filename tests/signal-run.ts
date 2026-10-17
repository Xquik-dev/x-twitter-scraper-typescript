// SPDX-FileCopyrightText: 2026 Xquik contributors
//
// SPDX-License-Identifier: Apache-2.0

import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const leftoverStep = '#!/bin/sh\nmktemp >/dev/null\nmktemp -d >/dev/null\n';

export const waitingStep = `${leftoverStep}touch "$SIGNAL_RUN_STARTED"\nwhile [ ! -e "$SIGNAL_RUN_RELEASE" ]; do sleep 0.05; done\n`;

type Run = { env: NodeJS.ProcessEnv; root: string; signal: NodeJS.Signals; processGroup?: boolean };

export const runUntilStarted = async (
  command: string,
  args: Array<string>,
  { env, root, signal, processGroup = false }: Run,
): Promise<{ code: number | null; signal: NodeJS.Signals | null }> => {
  const started = join(root, 'signal-run-started');
  const release = join(root, 'signal-run-release');
  const child = spawn(command, args, {
    env: { ...env, SIGNAL_RUN_STARTED: started, SIGNAL_RUN_RELEASE: release },
    stdio: 'ignore',
    detached: processGroup,
  });
  const stop = (stopSignal: NodeJS.Signals) => {
    if (processGroup && child.pid !== undefined) process.kill(-child.pid, stopSignal);
    else child.kill(stopSignal);
  };
  const exited = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve) =>
    child.on('exit', (code, stopSignal) => resolve({ code, signal: stopSignal })),
  );
  const deadline = Date.now() + 15_000;
  while (!existsSync(started)) {
    if (Date.now() > deadline) {
      stop('SIGKILL');
      throw new Error(`${command} never reached the waiting step.`);
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  stop(signal);
  writeFileSync(release, '');
  return exited;
};
