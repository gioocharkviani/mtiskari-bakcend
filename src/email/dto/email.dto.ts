import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class emailDto {
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  recipients!: string[];
  @IsString()
  subject!: string;
  @IsString()
  html!: string;
  @IsOptional()
  @IsString()
  text?: string;
  @IsOptional()
  @IsString()
  replyTo?: string;
}
