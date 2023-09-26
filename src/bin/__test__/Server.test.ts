/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
// import { ServerInit } from "../Server";
import { SocketService } from "../SocketIo";
import { container } from "tsyringe";
import { LoggerUtil } from "../../utils/logger.util";
import { MongoDB } from "../../services/mongodb.service";

describe("ServerInit", () => {
  //   let serverInit: ServerInit;

  beforeAll(() => {
    container.register<LoggerUtil>(LoggerUtil, { useValue: jest.fn() });
    container.register<MongoDB>("MongoDB", { useClass: jest.fn() });
    container.register<SocketService>("SocketService", {
      useClass: jest.fn(),
    });
  });

  beforeEach(() => {
    // serverInit = container.resolve(ServerInit);
  });

  it("should be defined", () => {
    // need to consider async dependencies
  });
});
