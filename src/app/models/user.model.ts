import { RolUsuarioModel } from "./rol_usuario.model";

export class UserModel {
    usuarioId?: number;
    usuario?: string;
    clave?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    nombres?: string;
    estado?: number;
    fechaRegistro?: string;
    usuarioRegistro?: string;
    roles?: RolUsuarioModel[];
}