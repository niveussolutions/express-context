import { Request, Response, NextFunction } from "express";
import { Namespace } from "cls-hooked";

export declare type ExpressContextOptions = {
    nsid?: string
}

export declare function expressContextMiddleware(opts: ExpressContextOptions): (req: Request, res: Response, next: NextFunction) => void;

export declare function set(key: string, value: string, opts: ExpressContextOptions): void;

export declare function get(key: string, opts: ExpressContextOptions): any;

export declare function setMany(map: Map<any, any>, opts: ExpressContextOptions): any;

export declare function getMany(keys: Array<string>, opts: ExpressContextOptions): Array<any>;

export declare function getNs(opts: ExpressContextOptions): Namespace;
