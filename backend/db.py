import sqlite3
import pathlib

SQL_SCRIPTS_PATH = str(pathlib.Path(__file__).parent.resolve()) + "/sql"

DB_NAME = 'db.sqlite'

# execute sql from script in sql folder
def execute_query_script(name: str, conn):
    with open(f'{SQL_SCRIPTS_PATH}/{name}') as script:
        conn.executescript(script.read())
        conn.commit()

# setup the database,should be called first
def setup_db():
    connection = sqlite3.connect(DB_NAME)
    execute_query_script('setup.sql', connection)
    connection.close()
