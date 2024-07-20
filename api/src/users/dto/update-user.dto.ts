import { PartialType } from "@nestjs/mapped-types";
import { User } from "./user.dto";

export class UpdateUserDto extends PartialType(User) {}
