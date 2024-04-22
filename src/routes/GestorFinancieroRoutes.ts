import { Router } from "express";
import { GestorFinancieroController } from "../controllers/GestorFinancieroController";

export const  router = Router();

router.get('/sucursal/:id', GestorFinancieroController);