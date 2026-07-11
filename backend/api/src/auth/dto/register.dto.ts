import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'aniket@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPassword123',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    required: false,
    example: 'Aniket',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    required: false,
    example: 'Chikane',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    required: false,
    example: '9876543210',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
