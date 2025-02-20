import { fileURLToPath } from "node:url"; // 👈 추가
import PluginManager from "./dist/index.js";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// 커스텀 플러그인 예시
class ExamplePlugin {
  name = "ExamplePlugin";

  async run(context) {
    // 플러그인 로직 구현
    console.log("Example plugin running with context:", context.t.logger.info('성공'));
  }
}

// 사용 예시
const manager = new PluginManager("/src");

// 플러그인 등록
manager.register(new ExamplePlugin());

// 플러그인 실행
manager.runPlugins({ data: 123 });
