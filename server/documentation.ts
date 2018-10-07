import { Router } from "express";
import { ENABLE_DOCS } from "./constants";

/** Builds documentation for /docs pages */
export function buildDocs() {
    if (!ENABLE_DOCS) return;

}

/** Builds documentation for /docs pages */
export function documentationRouter() {
    const router = Router();
    if (!ENABLE_DOCS) return router;

    return router;
}