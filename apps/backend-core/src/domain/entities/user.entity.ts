export class User {
  constructor(
    public readonly id: string,
    public readonly cpf: string,
    public email: string,
    public name: string,
    public passwordHash: string,
    public telephone: string | null = null,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  deactivate(): void {
    if (!this.isActive) {
      throw new Error('Usuário já está inativo.');
    }
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
