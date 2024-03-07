import { Request, Response, NextFunction } from "express";
import { Namespace } from "cls-hooked";

export declare type ExpressContextOptions = {
    nsid?: string
}

export declare function expressContext(opts: ExpressContextOptions): (req: Request, res: Response, next: NextFunction) => void;

export declare function set(key: string, value: string, opts: ExpressContextOptions): void;

export declare function get(key: string, opts: ExpressContextOptions): any;

export declare function setAll(map: Map<any, any>, opts: ExpressContextOptions): any;

export declare function getAll(keys: Array<string>, opts: ExpressContextOptions): any;

export declare function getNs(opts: ExpressContextOptions): Namespace;
