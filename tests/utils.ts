import { eq, desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { userTable, userVerificationCodeTable } from '../src/lib/server/db/schema/user';
import * as schema from '../src/lib/server/db/schema';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

export async function getVerificationCodeForTesting(username: string): Promise<string> {
    console.log('Buscando código de verificação para o usuário:', username);
  try {

    const user = await db.select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.username, username))
      .get();

    if (!user) {
      throw new Error(`Usuário '${username}' não encontrado`);
    }

    const verificationCode = await db.select({ code: userVerificationCodeTable.code })
      .from(userVerificationCodeTable)
      .where(eq(userVerificationCodeTable.userId, user.id))
      .orderBy(desc(userVerificationCodeTable.id))
      .limit(1)
      .get();

    if (!verificationCode) {
      throw new Error(`Código de verificação não encontrado para o usuário '${username}'`);
    }

    return verificationCode.code;
  } catch (error) {
    console.error('Erro ao buscar código de verificação:', error);
    throw error;
  }
}

export async function deleteUserForTesting(username: string): Promise<void> {
  console.log('Deletando usuário de teste:', username);
  try {
  
    const user = await db.select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.username, username))
      .get();

    if (!user) {
      console.log(`Usuário '${username}' não encontrado. Nada para deletar.`);
      return;
    }


    await db.delete(userVerificationCodeTable)
      .where(eq(userVerificationCodeTable.userId, user.id))
      .execute();

    await db.delete(userTable)
      .where(eq(userTable.id, user.id))
      .execute();

    console.log(`Usuário '${username}' e dados associados foram deletados com sucesso.`);
  } catch (error) {
    console.error('Erro ao deletar usuário de teste:', error);
    throw error;
  }
}