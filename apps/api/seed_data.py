"""
Database seeding script for Essential Eight framework and controls.
"""
import uuid
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Framework, Control, Requirement

def seed_essential_eight(db: Session):
    """Seed the Essential Eight framework with controls and requirements."""
    
    # Create Essential Eight framework
    framework = Framework(
        id=uuid.uuid4(),
        name="Essential Eight",
        version="2023",
        description="The Essential Eight are a set of strategies to help organisations protect themselves against cyber security threats, developed by the Australian Cyber Security Centre (ACSC)."
    )
    db.add(framework)
    db.flush()  # Flush to get the ID
    
    # Control 1: Application Control
    app_control = Control(
        framework_id=framework.id,
        code="EE-1",
        title="Application Control",
        description="Application control prevents the execution of unapproved/malicious programs including .exe, DLL, scripts (e.g. Windows Script Host, PowerShell, HTA, JavaScript, VBScript) and installers."
    )
    db.add(app_control)
    db.flush()
    
    # Application Control Requirements
    app_control_reqs = [
        {
            "req_code": "EE-1.1",
            "text": "Application control is implemented on all workstations.",
            "maturity_level": 1,
            "guidance": "Implement Microsoft Windows Defender Application Control, Software Restriction Policies or equivalent."
        },
        {
            "req_code": "EE-1.2", 
            "text": "Application control is implemented on all internet-facing servers.",
            "maturity_level": 2,
            "guidance": "Extend application control to servers exposed to the internet."
        },
        {
            "req_code": "EE-1.3",
            "text": "Application control is implemented on all servers.",
            "maturity_level": 3,
            "guidance": "Deploy application control across the entire server environment."
        }
    ]
    
    for req_data in app_control_reqs:
        requirement = Requirement(
            control_id=app_control.id,
            req_code=req_data["req_code"],
            text=req_data["text"],
            maturity_level=req_data["maturity_level"],
            guidance=req_data["guidance"]
        )
        db.add(requirement)
    
    # Control 2: Patch Applications
    patch_apps = Control(
        framework_id=framework.id,
        code="EE-2",
        title="Patch Applications",
        description="Security vulnerabilities in applications can be used to execute malicious code. Patching applications prevents this."
    )
    db.add(patch_apps)
    db.flush()
    
    # Patch Applications Requirements
    patch_apps_reqs = [
        {
            "req_code": "EE-2.1",
            "text": "Security vulnerabilities in applications are patched within 48 hours of release or vendor availability.",
            "maturity_level": 1,
            "guidance": "Focus on internet-facing applications and those processing untrusted data."
        },
        {
            "req_code": "EE-2.2",
            "text": "A vulnerability scanner is used to detect missing application patches.",
            "maturity_level": 2,
            "guidance": "Implement automated vulnerability scanning for all applications."
        },
        {
            "req_code": "EE-2.3",
            "text": "An application control or application management solution is used to automatically apply security patches.",
            "maturity_level": 3,
            "guidance": "Automate the patch deployment process where possible."
        }
    ]
    
    for req_data in patch_apps_reqs:
        requirement = Requirement(
            control_id=patch_apps.id,
            req_code=req_data["req_code"],
            text=req_data["text"],
            maturity_level=req_data["maturity_level"],
            guidance=req_data["guidance"]
        )
        db.add(requirement)
    
    # Control 3: Configure Microsoft Office Macro Settings
    macro_control = Control(
        framework_id=framework.id,
        code="EE-3",
        title="Configure Microsoft Office Macro Settings",
        description="Microsoft Office macros can be used to execute malicious code. Appropriately configuring macro settings prevents this."
    )
    db.add(macro_control)
    db.flush()
    
    # Macro Settings Requirements
    macro_reqs = [
        {
            "req_code": "EE-3.1",
            "text": "Microsoft Office macros are disabled for users who do not have a legitimate business requirement.",
            "maturity_level": 1,
            "guidance": "Disable macros by default and only enable for users who require them."
        },
        {
            "req_code": "EE-3.2",
            "text": "Microsoft Office macros are blocked from the internet, and only macro-enabled files from trusted locations are allowed to execute.",
            "maturity_level": 2,
            "guidance": "Block macros from internet sources and email attachments."
        },
        {
            "req_code": "EE-3.3",
            "text": "Microsoft Office macros are blocked, and only macros that are digitally signed by a trusted publisher are allowed to execute.",
            "maturity_level": 3,
            "guidance": "Only allow digitally signed macros from trusted publishers."
        }
    ]
    
    for req_data in macro_reqs:
        requirement = Requirement(
            control_id=macro_control.id,
            req_code=req_data["req_code"],
            text=req_data["text"],
            maturity_level=req_data["maturity_level"],
            guidance=req_data["guidance"]
        )
        db.add(requirement)
    
    # Control 4: User Application Hardening
    user_hardening = Control(
        framework_id=framework.id,
        code="EE-4",
        title="User Application Hardening",
        description="Web browsers and PDF viewers are common targets for delivering malicious content. Hardening these applications prevents exploitation."
    )
    db.add(user_hardening)
    db.flush()
    
    # User Application Hardening Requirements
    hardening_reqs = [
        {
            "req_code": "EE-4.1",
            "text": "Web browsers are configured to block or disable support for Flash Player content, and Java is disabled or blocked in web browsers.",
            "maturity_level": 1,
            "guidance": "Remove or disable Adobe Flash and Java in all web browsers."
        },
        {
            "req_code": "EE-4.2",
            "text": "Web browsers are configured to block advertisements and unsubscribe from unnecessary services.",
            "maturity_level": 2,
            "guidance": "Implement ad-blocking and disable unnecessary browser services."
        },
        {
            "req_code": "EE-4.3",
            "text": "PDF viewers are configured to disable JavaScript and embedded content execution capabilities.",
            "maturity_level": 3,
            "guidance": "Harden PDF viewers to prevent malicious content execution."
        }
    ]
    
    for req_data in hardening_reqs:
        requirement = Requirement(
            control_id=user_hardening.id,
            req_code=req_data["req_code"],
            text=req_data["text"],
            maturity_level=req_data["maturity_level"],
            guidance=req_data["guidance"]
        )
        db.add(requirement)
    
    # Control 5: Restrict Administrative Privileges
    admin_privileges = Control(
        framework_id=framework.id,
        code="EE-5", 
        title="Restrict Administrative Privileges",
        description="Administrative privileges provide attackers with unfettered access to systems. Restricting administrative privileges limits the ability of malicious code to access important data and systems."
    )
    db.add(admin_privileges)
    db.flush()
    
    # Administrative Privileges Requirements
    admin_reqs = [
        {
            "req_code": "EE-5.1",
            "text": "Users are assigned standard user accounts and administrative privileges are only granted to users who require them.",
            "maturity_level": 1,
            "guidance": "Follow principle of least privilege for user account assignments."
        },
        {
            "req_code": "EE-5.2",
            "text": "Administrative accounts are subject to additional security controls such as requiring multi-factor authentication.",
            "maturity_level": 2,
            "guidance": "Implement additional security controls for administrative accounts."
        },
        {
            "req_code": "EE-5.3",
            "text": "Administrative activities are monitored and logged.",
            "maturity_level": 3,
            "guidance": "Log and monitor all administrative activities for security review."
        }
    ]
    
    for req_data in admin_reqs:
        requirement = Requirement(
            control_id=admin_privileges.id,
            req_code=req_data["req_code"],
            text=req_data["text"],
            maturity_level=req_data["maturity_level"],
            guidance=req_data["guidance"]
        )
        db.add(requirement)
    
    # Control 6: Patch Operating Systems
    patch_os = Control(
        framework_id=framework.id,
        code="EE-6",
        title="Patch Operating Systems", 
        description="Security vulnerabilities in operating systems can be exploited to gain access to systems. Patching operating systems prevents this."
    )
    db.add(patch_os)
    db.flush()
    
    # Patch OS Requirements
    patch_os_reqs = [
        {
            "req_code": "EE-6.1",
            "text": "Operating system security vulnerabilities are patched within 48 hours of release or vendor availability.",
            "maturity_level": 1,
            "guidance": "Prioritize critical and high-severity operating system patches."
        },
        {
            "req_code": "EE-6.2",
            "text": "A vulnerability scanner is used to detect missing operating system patches.",
            "maturity_level": 2,
            "guidance": "Implement automated vulnerability scanning for operating systems."
        },
        {
            "req_code": "EE-6.3",
            "text": "Operating system patches are automatically applied or applied via a centralized patch management solution.",
            "maturity_level": 3,
            "guidance": "Automate the operating system patch deployment process."
        }
    ]
    
    for req_data in patch_os_reqs:
        requirement = Requirement(
            control_id=patch_os.id,
            req_code=req_data["req_code"],
            text=req_data["text"],
            maturity_level=req_data["maturity_level"],
            guidance=req_data["guidance"]
        )
        db.add(requirement)
    
    # Control 7: Multi-Factor Authentication (MFA) - The star of our demo!
    mfa_control = Control(
        framework_id=framework.id,
        code="EE-7",
        title="Multi-Factor Authentication",
        description="Multi-factor authentication provides an additional layer of security, making it harder for attackers to gain access to systems and data even if they have compromised passwords."
    )
    db.add(mfa_control)
    db.flush()
    
    # MFA Requirements - Detailed for our demo
    mfa_reqs = [
        {
            "req_code": "EE-7.1",
            "text": "Multi-factor authentication is used to authenticate all users when accessing important data repositories.",
            "maturity_level": 1,
            "guidance": "Implement MFA for access to sensitive data repositories, file servers, and databases."
        },
        {
            "req_code": "EE-7.2",
            "text": "Multi-factor authentication is used to authenticate all privileged users and any other positions of trust when accessing any system.",
            "maturity_level": 2,
            "guidance": "Extend MFA to all administrative accounts and privileged users across all systems."
        },
        {
            "req_code": "EE-7.3",
            "text": "Multi-factor authentication is used to authenticate all users when accessing any system.",
            "maturity_level": 3,
            "guidance": "Deploy MFA for all users accessing any organizational systems and applications."
        },
        {
            "req_code": "EE-7.4",
            "text": "Hardware tokens or biometric authentication factors are used for multi-factor authentication.",
            "maturity_level": 3,
            "guidance": "Use phishing-resistant authentication methods such as hardware security keys or biometric factors."
        },
        {
            "req_code": "EE-7.5",
            "text": "Single sign-on is implemented with multi-factor authentication for accessing multiple systems.",
            "maturity_level": 3,
            "guidance": "Implement SSO solutions that incorporate multi-factor authentication capabilities."
        }
    ]
    
    for req_data in mfa_reqs:
        requirement = Requirement(
            control_id=mfa_control.id,
            req_code=req_data["req_code"],
            text=req_data["text"],
            maturity_level=req_data["maturity_level"],
            guidance=req_data["guidance"]
        )
        db.add(requirement)
    
    # Control 8: Regular Backups
    backups = Control(
        framework_id=framework.id,
        code="EE-8",
        title="Regular Backups",
        description="Backups provide a way to restore data and system functionality in the event of data corruption, system failure, or malicious activity."
    )
    db.add(backups)
    db.flush()
    
    # Regular Backups Requirements
    backup_reqs = [
        {
            "req_code": "EE-8.1",
            "text": "Backups of important data, software and configuration settings are performed and tested regularly.",
            "maturity_level": 1,
            "guidance": "Perform regular backups and test restore procedures for critical data."
        },
        {
            "req_code": "EE-8.2",
            "text": "Backups are stored offline, in a different location or in an immutable format.",
            "maturity_level": 2,
            "guidance": "Store backups offline or in immutable storage to protect against ransomware."
        },
        {
            "req_code": "EE-8.3",
            "text": "Backups are automatically created and managed by a centralised backup solution.",
            "maturity_level": 3,
            "guidance": "Implement automated centralized backup solutions with appropriate retention."
        }
    ]
    
    for req_data in backup_reqs:
        requirement = Requirement(
            control_id=backups.id,
            req_code=req_data["req_code"],
            text=req_data["text"],
            maturity_level=req_data["maturity_level"],
            guidance=req_data["guidance"]
        )
        db.add(requirement)
    
    # Commit all changes
    db.commit()
    print("Essential Eight framework seeded successfully!")
    return framework.id

def run_seed():
    """Run the seeding process."""
    db = SessionLocal()
    try:
        # Check if framework already exists
        existing = db.query(Framework).filter(Framework.name == "Essential Eight").first()
        if existing:
            print("Essential Eight framework already exists. Skipping seed.")
            return
        
        # Seed the framework
        framework_id = seed_essential_eight(db)
        print(f"Seeded Essential Eight framework with ID: {framework_id}")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()