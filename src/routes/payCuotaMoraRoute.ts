import { Router } from "express";
import { payMoraCuotaController } from "../controllers/payCuotaMoraController";


export const router = Router();

router.put('/payMoraCuota', payMoraCuotaController)