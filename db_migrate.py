import subprocess
from pathlib import Path

def run_command(command):
    try:
        process = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ Success: {process.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e.stderr}")
        return False

def setup_database():
    print("🚀 Starting database migration process...")
    
    # Check if alembic is initialized
    if not Path("alembic").exists():
        print("📁 Initializing Alembic...")
        if not run_command("alembic init alembic"):
            return False

    # Stamp the database to establish the current state
    print("🔄 Stamping current database state...")
    if not run_command("alembic stamp head"):
        return False

    # Generate migration
    print("📝 Generating new migration...")
    if not run_command("alembic revision --autogenerate -m 'create_initial_tables'"):
        return False

    # Apply migration
    print("⚡ Applying migration...")
    if not run_command("alembic upgrade head"):
        return False

    print("✨ Database migration completed successfully!")
    return True

if __name__ == "__main__":
    setup_database()