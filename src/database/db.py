import os
import sqlite3

# Central database file path resolved relative to this directory
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../journal.db'))

def get_db_connection() -> sqlite3.Connection:
    """Creates and returns a connection to the unified SQLite journal database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(drop_tables: bool = False):
    """Initializes the database schema, dropping existing tables if specified to start afresh."""
    conn = get_db_connection()
    if drop_tables:
        conn.execute("DROP TABLE IF EXISTS journal_entries")
        print("[HEARTH DB] Existing journal_entries table dropped.")
        
    conn.execute("""
        CREATE TABLE IF NOT EXISTS journal_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            emotion_path TEXT,
            summary TEXT,
            user_id TEXT
        )
    """)
    conn.commit()
    conn.close()
    print(f"[HEARTH DB] SQLite database initialized at: {DB_PATH}")
