import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { UserRepository } from '../../../../application/ports/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { users } from '../schemas/base';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(
    @Inject('DRIZZLE_CONNECTION')
    private readonly db: NodePgDatabase,
  ) {}

  async save(user: User): Promise<void> {
    await this.db
      .insert(users)
      .values({
        id: user.id,
        cpf: user.cpf,
        email: user.email,
        name: user.name,
        telephone: user.telephone,
        passwordHash: user.passwordHash,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email,
          name: user.name,
          telephone: user.telephone,
          passwordHash: user.passwordHash,
          isActive: user.isActive,
          updatedAt: new Date(),
        },
      });
  }

  async findById(id: string): Promise<User | null> {
    const [record] = await this.db.select().from(users).where(eq(users.id, id));

    if (!record) return null;

    return this.mapToDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [record] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!record) return null;

    return this.mapToDomain(record);
  }

  async findByCPF(cpf: string): Promise<User | null> {
    const [record] = await this.db
      .select()
      .from(users)
      .where(eq(users.cpf, cpf));

    if (!record) return null;

    return this.mapToDomain(record);
  }

  /**
   * Mapeamento Pragmático: Converte o retorno do Drizzle (inferido pelo esquema)
   * na Entidade de Domínio pura exigida pela aplicação.
   */
  private mapToDomain(record: typeof users.$inferSelect): User {
    return new User(
      record.id,
      record.cpf,
      record.email,
      record.name,
      record.passwordHash,
      record.telephone,
      record.isActive ?? true,
      record.createdAt ?? new Date(),
      record.updatedAt ?? new Date(),
    );
  }
}
