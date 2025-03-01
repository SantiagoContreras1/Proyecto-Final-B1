import {config} from "dotenv"
config() // Carga todas las variables de entorno

import { initServer } from "./config/server.js"
initServer()