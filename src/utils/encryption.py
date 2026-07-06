import os
import warnings
from cryptography.fernet import Fernet, InvalidToken

_fernet = None

def _get_or_create_key() -> bytes:
    key = os.environ.get("ENCRYPTION_KEY")
    if not key:
        key = Fernet.generate_key().decode('utf-8')
        os.environ["ENCRYPTION_KEY"] = key
        warnings.warn(f"\n[HEARTH ENCRYPTION WARNING] No ENCRYPTION_KEY found in environment. Generated a temporary key for this session:\n\n{key}\n\nPlease add this key to your .env file to persist it.\n")
    
    return key.encode('utf-8')

def _get_fernet() -> Fernet:
    global _fernet
    if _fernet is None:
        _fernet = Fernet(_get_or_create_key())
    return _fernet

def encrypt_text(text: str) -> str:
    """Encrypts a string and returns the encrypted token as a string."""
    if not text:
        return text
    fernet = _get_fernet()
    encrypted_bytes = fernet.encrypt(text.encode('utf-8'))
    return encrypted_bytes.decode('utf-8')

def decrypt_text(encrypted_token: str) -> str:
    """Decrypts a token back to the original string.
    If decryption fails, assumes the text was not encrypted and returns it as-is.
    """
    if not encrypted_token:
        return encrypted_token
    fernet = _get_fernet()
    try:
        decrypted_bytes = fernet.decrypt(encrypted_token.encode('utf-8'))
        return decrypted_bytes.decode('utf-8')
    except InvalidToken:
        # Fallback to returning original string for backward compatibility with unencrypted logs
        return encrypted_token
    except Exception as e:
        print(f"[HEARTH ENCRYPTION ERROR] Error decrypting text: {e}")
        return encrypted_token
