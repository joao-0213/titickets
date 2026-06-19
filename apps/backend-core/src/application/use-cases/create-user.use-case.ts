import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../ports/repositories/user.repository';
import { PasswordHasher } from '../ports/password-hasher.port';
import { User } from '../../domain/entities/user.entity';

export interface CreateUserCommand {
  name: string;
  email: string;
  cpf: string;
  telephone?: string;
  passwordRaw: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<Omit<User, 'passwordHash'>> {
    // verificar se usuario ja existe
    const emailExists = await this.userRepository.findByEmail(command.email);
    if (emailExists) {
      throw new ConflictException('E-mail já está em uso.');
    }

    // verificar se o CPF ja existe
    const cpfExists = await this.userRepository.findByCpf(command.cpf);

    // 2. Gerar o hash da senha usando a Porta
    const hashedPassword = await this.passwordHasher.hash(command.passwordRaw);

    // 3. Criar a Entidade de Domínio
    // O crypto.randomUUID() nativo do Node pode ser usado ou um ID gerado pelo DB
    const user = new User(
      crypto.randomUUID(),
      command.cpf,
      command.email,
      command.name,
      hashedPassword,
      command.telephone ?? null,
    );

    // 4. Salvar via Repositório
    await this.userRepository.save(user);

    // 5. Retornar os dados sanitizados (nunca retornar o hash para o Controller)
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
