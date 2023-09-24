import { container, injectable } from "tsyringe";

enum Environment {
  Dev = "development",
  local = "local",
}
@injectable()
export class EnvironmentUtil {
  private static currentEnvironment: Environment =
    (process.env.NODE_ENV as Environment) || Environment.Dev;

  static isDev(): boolean {
    return this.currentEnvironment === Environment.Dev;
  }

  static isLocal(): boolean {
    return this.currentEnvironment === Environment.local;
  }

  static runInDev(callback: () => void): void {
    if (this.isDev()) {
      callback();
    }
  }

  static runInLocal(callback: () => void): void {
    if (this.isLocal()) {
      callback();
    }
  }
}

container.register("EnvironmentUtil", { useValue: EnvironmentUtil });

export { container as environmentContainer };
