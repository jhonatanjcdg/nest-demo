import { SetMetadata } from "@nestjs/common";
import { Rol } from "src/roles.enum";

export const Roles = (...roles: Rol[]) => SetMetadata('roles', roles)