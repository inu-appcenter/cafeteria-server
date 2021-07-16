import Injector, {ClassType, Declaration} from './Injector';
import logger from '../utils/logger';

const injector = new Injector();

let isInitialized = false;

export default function resolve<T>(type: ClassType<T>): T {
  logger.verbose(`Resolve '${type.name}'`);

  return injector.resolve(type);
}

export function init(
  declarations: Declaration<any>[],
  force = false,
  verbose = false,
) {
  if (!isInitialized || force) {
    injector.start(declarations, verbose);

    logger.verbose('의존성 주입 준비합니다.');
    isInitialized = true;
  } else {
    logger.verbose('의존성 초기화 건너뜁니다.');
  }
}
