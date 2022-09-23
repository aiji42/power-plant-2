import { $, fs, path } from "zx";
import ffprobe from "ffprobe";

const MIN_SIZE = 400 * 1024 * 1024; // 400M
// const MIN_SIZE = 100 * 1024 * 1024; // 100M
const DOWNLOAD_DIR = "/downloads";

void (async function () {
  const target = "";
  // TODO: timeout
  await $`aria2c -d /downloads --seed-time=0 --max-overall-upload-limit=1K --bt-stop-timeout=300 --lowest-speed-limit=500K ${target}`;

  const fileNames = listFiles(DOWNLOAD_DIR).filter(
    (filePath) => fs.statSync(filePath).size > MIN_SIZE
  );
  for (let [index, file] of Object.entries(fileNames)) {
    const meta = await scanMetaInfo(file);
    console.log(meta);
    const key = `${index}${path.extname(file)}`;
    await $`aws s3 mv --endpoint-url https://${process.env.R2_CLIENT_ID}.r2.cloudflarestorage.com ${file} s3://power-plant-2/${key}`;
  }
})();

const listFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    return dirent.isFile()
      ? [`${dir}/${dirent.name}`]
      : listFiles(`${dir}/${dirent.name}`);
  });

const scanMetaInfo = async (
  path: string
): Promise<Record<string, number | string | undefined>> => {
  try {
    const stat = fs.statSync(path);
    const {
      streams: [res],
    } = await ffprobe(path, { path: "/usr/bin/ffprobe" });

    const [n1, n2] = res.avg_frame_rate.split("/");
    const frameRate = Number(n1) / Number(n2);

    return {
      size: stat.size,
      codec: res.codec_name,
      width: res.width,
      height: res.height,
      frameRate,
      duration: res.duration,
      bitRate: res.bit_rate,
    };
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    else console.error(`Unexpected error on scanning media: ${path}`);
    return {};
  }
};
