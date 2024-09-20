import { exec } from "child_process";

let currentProcess: any = null;

export const playSong = (filepath: string) => {
  if (currentProcess) {
    currentProcess.kill("SIGSTOP");
  }

  currentProcess = exec(`mpg123 "${filepath}"`);

  currentProcess.on("exit", () => {
    currentProcess = null;
  });
};
