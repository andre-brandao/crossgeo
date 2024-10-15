import type { InsertUser, UserPermissions } from '$db/schema'
import { hash } from '@node-rs/argon2'
import { generateId } from 'lucia'

/**
 * Classe que armazena um usuário.
 */
export class User {
  username: string
  email: string
  emailVerified: boolean
  phone: string
  phoneVerified: boolean
  password: string
  permissions: UserPermissions
  usedCredits: number
  maxCredits: number

  /**
   * Constrói uma nova instância de User
   * @param username Nome do usuário.
   * @param email Email do usuário.
   * @param emailVerified Se o email foi verificado.
   * @param phone Telefone do usuário.
   * @param phoneVerified Se o telefone foi verificado.
   * @param password Senha do usuário.
   * @param permissions Permissões do usuário.
   * @param usedCredits Créditos do usuário.
   * @param maxCredits Máximo de crédito do usuário.
   */
  constructor(username: string, email: string, emailVerified: boolean,
              phone: string, phoneVerified: boolean, password: string,
              permissions: UserPermissions, usedCredits: number,
              maxCredits: number) {
    this.username = username
    this.email = email
    this.emailVerified = emailVerified
    this.phone = phone
    this.phoneVerified = phoneVerified
    this.password = password
    this.permissions = permissions
    this.usedCredits = usedCredits
    this.maxCredits = maxCredits
  }

  /**
   * Gera a hash da senha.
   * @return String com a hash da senha.
   */
  async generatePasswordHash(): Promise<string> {
    return await hash(this.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 2,
      parallelism: 1,
    })
  }

  /**
   * Converte um usuário do tipo User em um InsertUser.
   * @return Promessa de um InsertUser.
   */
  async toInsertUser(): Promise<InsertUser> {
    return {
      id: generateId(15),
      username: this.username,
      phone: this.phone,
      phoneVerified: this.phoneVerified,
      email: this.email,
      password_hash: await this.generatePasswordHash(),
      emailVerified: this.emailVerified,
      permissions: this.permissions,
      used_credits: this.usedCredits,
      max_credits: this.maxCredits,
    }
  }
}