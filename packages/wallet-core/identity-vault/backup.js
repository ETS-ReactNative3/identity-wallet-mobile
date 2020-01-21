import { System } from '../system';
const crypto = System.getCrypto();
import { unlockVault } from './index';

// import keccak from 'keccak';

export function encryptData(data, password, options = {}) {
  const rounds = options.rounds || 262144;
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(64);
  const derivedKey = crypto.pbkdf2Sync(password, salt, rounds, 32, 'sha256');
  const mac = crypto.createHmac('sha256', password).update(derivedKey).digest('hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    version: '0.1',
    value: encrypted,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    mac: mac.toString('hex'),
  };
}

export function decryptData(data, password, options = {}) {
  const rounds = options.rounds || 262144;
  const derivedKey = crypto.pbkdf2Sync(password, Buffer.from(data.salt, 'hex'), rounds, 32, 'sha256');
  const mac = crypto.createHmac('sha256', password).update(derivedKey).digest('hex');

  if (mac !== data.mac) {
    throw 'Wrong password';
  }

  const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, Buffer.from(data.iv, 'hex'));

  let decrypted = decipher.update(data.value, 'hex');
  decrypted += decipher.final();

  return decrypted.toString('utf8');
}

export async function generateBackup(vaultId, password) {
  const vault = await unlockVault(vaultId, password);

  return {
    version: '0.1',
    /**
     * For the import process we can verify the public db for existent vaults with this ID
     * If so, should allert the user that the vault is already in place and give the chooice to abort the import
     * or replace the current vault data
     */
    vaultId: vaultId,
    keystoreItems: [{
      id: 'mnemonic',
      value: vault.mnemonic
    }],
    identityItems: [],
    wallets: [],
  };
}
