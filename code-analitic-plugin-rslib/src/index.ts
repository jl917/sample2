import chalk from "chalk";
import path from "node:path";
import { globSync } from "glob";

const GLOB_PATTERN = ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx", "**/*.cjs", "**/*.mjs"]
const IGNORE = ["**/node_modules/**"];

// 플러그인 인터페이스 정의
interface Plugin {
  name: string;
  run: (context: any) => Promise<void> | void;
}

type ParserType = 'babel' | 'swc';

// 로거 레벨 타입 정의
type LogLevel = "info" | "warn" | "error";

// 로거 인터페이스
interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

class PluginManager {
  protected logger: Logger;
  protected filePaths: string[] = [];
  protected parser: ParserType;

  private plugins: Plugin[] = [];

  constructor(
    { parser = 'babel', basePath = './src', globPattern = GLOB_PATTERN, ignore = IGNORE }: { parser?: ParserType, basePath?: string, globPattern?: string | string[], ignore?: string | string[] } = {}) {
    // 검사할 파일들을 가져옴
    this.parser = parser;
    this.filePaths = globSync(globPattern, { cwd: path.resolve(basePath), ignore, }).map(e => path.resolve(basePath, e));
    // 기본 로거 구현 또는 커스텀 로거 사용
    this.logger = {
      info: (message: string) => console.log(`${chalk.green("[INFO]")} ${message}`),
      warn: (message: string) => console.warn(`${chalk.yellow("[WARN]")} ${message}`),
      error: (message: string) => console.error(`${chalk.red("[ERROR]")} ${message}`),
    };
  }

  // 플러그인 등록
  register(plugin: Plugin): void {
    this.plugins.push(plugin);
  }

  // 플러그인 실행
  async runPlugins<T>(context: T): Promise<void> {
    for (const plugin of this.plugins) {
      try {
        await plugin.run({ t: this, context });
        // this.logger.info(`Plugin "${plugin.name}" completed successfully`);
      } catch (error) {
        this.logger.error(`Plugin "${plugin.name}" failed: ${error}`);
        throw error;
      }
    }
  }

  // 로그 레벨별 메시지 출력
  log(level: LogLevel, message: string): void {
    this.logger[level](message);
  }

  // 플러그인 목록 조회
  getPlugins(): Plugin[] {
    return [...this.plugins];
  }
}

export default PluginManager;
