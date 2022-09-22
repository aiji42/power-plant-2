import { $ } from "zx";

void (async function () {
  const target = "";
  $`aria2c -d /downloads --seed-time=0 --max-overall-upload-limit=1K --bt-stop-timeout=300 --lowest-speed-limit=500K ${target}`;

  await $`ls -l /downloads`;
})();
