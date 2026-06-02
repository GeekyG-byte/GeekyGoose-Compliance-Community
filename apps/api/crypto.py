"""
Encryption utilities for sensitive secrets stored in the database.
Requires ENCRYPTION_KEY environment variable set to a valid Fernet key.

Generate a key with:
    python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
"""
import os
import logging

logger = logging.getLogger(__name__)

# Fernet ciphertext always starts with this prefix (base64 of version byte 0x80)
_FERNET_PREFIX = "gAAAAA"


def _get_fernet():
    from cryptography.fernet import Fernet
    key = os.getenv("ENCRYPTION_KEY")
    if not key:
        raise RuntimeError("ENCRYPTION_KEY environment variable is not set")
    return Fernet(key.encode() if isinstance(key, str) else key)


def encrypt_secret(value: str) -> str:
    """Encrypt a plaintext secret. Returns URL-safe base64-encoded ciphertext."""
    return _get_fernet().encrypt(value.encode()).decode()


def decrypt_secret(encrypted_value: str) -> str:
    """Decrypt a Fernet-encrypted secret. Returns plaintext."""
    return _get_fernet().decrypt(encrypted_value.encode()).decode()


def is_encrypted(value: str) -> bool:
    """Return True if the value looks like a Fernet ciphertext (not plaintext)."""
    return isinstance(value, str) and value.startswith(_FERNET_PREFIX)
