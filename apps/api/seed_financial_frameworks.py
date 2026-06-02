"""
Database seeding for Australian financial compliance frameworks:
  - PCI DSS v4.0           (global payment card standard, widely adopted in Australia)
  - APRA CPS 234 (2019)    (mandatory for APRA-regulated entities: banks, insurers, super funds)
  - APRA CPS 230 (2024)    (operational risk management, effective 1 July 2025)
  - AUSTRAC AML/CTF (2006) (Anti-Money Laundering and Counter-Terrorism Financing Act)
  - Privacy Act APPs       (Australian Privacy Principles under the Privacy Act 1988)
"""
import uuid
from sqlalchemy.orm import Session
from models import Framework, Control, Requirement


# ---------------------------------------------------------------------------
# PCI DSS v4.0
# ---------------------------------------------------------------------------

def seed_pci_dss(db: Session):
    framework = Framework(
        id=uuid.uuid4(),
        name="PCI DSS",
        version="4.0",
        description=(
            "The Payment Card Industry Data Security Standard (PCI DSS) v4.0 is a global "
            "security standard administered by the PCI Security Standards Council. In Australia, "
            "compliance is enforced by the major card brands (Visa, Mastercard) and is required "
            "for all entities that store, process, or transmit payment card data."
        ),
    )
    db.add(framework)
    db.flush()

    controls_data = [
        {
            "code": "PCI-1",
            "title": "Install and Maintain Network Security Controls",
            "description": "Network security controls (NSCs) restrict inbound and outbound traffic to only that necessary for the cardholder data environment (CDE).",
            "requirements": [
                ("PCI-1.1", "Network security controls are installed, configured, and maintained at all connections to the CDE.", 1,
                 "Firewalls or equivalent NSCs must be in place at every connection between untrusted networks and CDE components."),
                ("PCI-1.2", "NSC rulesets are reviewed at least every six months.", 2,
                 "Document all rules; remove unused rules after each review cycle."),
                ("PCI-1.3", "Inbound and outbound traffic is restricted to only that necessary for the CDE.", 2,
                 "Apply deny-by-default policies and document all permitted traffic flows with business justification."),
                ("PCI-1.4", "Network connections between trusted and untrusted networks are controlled via DMZ architecture.", 3,
                 "Restrict direct routes between untrusted networks and CDE; deploy a DMZ for public-facing services."),
            ],
        },
        {
            "code": "PCI-2",
            "title": "Apply Secure Configurations to All System Components",
            "description": "Default passwords and settings create vulnerabilities. Secure configurations based on industry benchmarks reduce the attack surface.",
            "requirements": [
                ("PCI-2.1", "All default passwords and security parameters are changed before production deployment.", 1,
                 "Maintain a hardening checklist; verify no defaults remain before any system goes live."),
                ("PCI-2.2", "System configuration standards are developed and implemented for all in-scope components.", 2,
                 "Base standards on CIS Benchmarks or DISA STIGs; review at least annually."),
                ("PCI-2.3", "Wireless access points in scope are configured securely.", 2,
                 "Use WPA3 or WPA2-AES, change default SSIDs, and disable WPS on all in-scope wireless devices."),
            ],
        },
        {
            "code": "PCI-3",
            "title": "Protect Stored Account Data",
            "description": "Stored cardholder data must be protected through encryption, truncation, masking, or tokenisation.",
            "requirements": [
                ("PCI-3.1", "Data retention is minimised; cardholder data is purged when no longer needed.", 1,
                 "Implement a data retention policy; run automated purge processes at least quarterly."),
                ("PCI-3.2", "Sensitive authentication data (SAD) is not retained after authorisation.", 1,
                 "Do not store full magnetic-stripe, CVV/CVC, or PIN data under any circumstances after auth."),
                ("PCI-3.3", "Primary account numbers (PAN) are rendered unreadable wherever stored.", 2,
                 "Use strong one-way hashing, tokenisation, index tokens, or encryption to protect stored PANs."),
                ("PCI-3.4", "Cryptographic keys protecting account data are secured and managed via formal key-management procedures.", 3,
                 "Implement split knowledge and dual control for key-encrypting keys; rotate keys at least annually."),
            ],
        },
        {
            "code": "PCI-4",
            "title": "Protect Cardholder Data During Transmission Over Open, Public Networks",
            "description": "Cardholder data transmitted over open networks must be encrypted to prevent interception.",
            "requirements": [
                ("PCI-4.1", "Strong cryptography (TLS 1.2+) is used for all transmissions of PAN over open, public networks.", 1,
                 "Disable TLS 1.0 and 1.1, SSL, and early TLS; use TLS 1.2 or higher with strong cipher suites."),
                ("PCI-4.2", "PANs are not transmitted via unprotected messaging technologies (email, chat, SMS).", 1,
                 "Prohibit unprotected PAN transmission; implement controls and user training to enforce this."),
            ],
        },
        {
            "code": "PCI-5",
            "title": "Protect All Systems and Networks from Malicious Software",
            "description": "Anti-malware controls protect system components from known and emerging malware threats.",
            "requirements": [
                ("PCI-5.1", "Anti-malware solutions are deployed on all system components commonly affected by malware.", 1,
                 "Deploy anti-malware on all workstations, servers, and mobile devices in scope."),
                ("PCI-5.2", "Anti-malware mechanisms are maintained and cannot be disabled by users.", 2,
                 "Ensure automatic definition updates and prevent user-level disabling of anti-malware."),
                ("PCI-5.3", "Anti-phishing mechanisms are implemented (DMARC, DKIM, SPF).", 3,
                 "Deploy email authentication standards and conduct phishing awareness training for all staff."),
            ],
        },
        {
            "code": "PCI-6",
            "title": "Develop and Maintain Secure Systems and Software",
            "description": "Vulnerabilities in software are commonly exploited. Secure development and patch management reduce this risk.",
            "requirements": [
                ("PCI-6.1", "Security vulnerabilities are identified and risk-ranked.", 1,
                 "Subscribe to vulnerability intelligence feeds; rank vulnerabilities by risk and track remediation."),
                ("PCI-6.2", "Bespoke and custom software is developed securely.", 2,
                 "Apply OWASP Top 10 mitigations; conduct code review or SAST scanning during development."),
                ("PCI-6.3", "Public-facing web applications are protected by a WAF.", 2,
                 "Deploy a web application firewall in blocking mode in front of all public-facing applications."),
                ("PCI-6.4", "Public-facing applications are reviewed for vulnerabilities at least annually.", 3,
                 "Conduct penetration testing or automated DAST scanning after significant changes and at least annually."),
            ],
        },
        {
            "code": "PCI-7",
            "title": "Restrict Access to System Components and Cardholder Data by Need to Know",
            "description": "Access to cardholder data must be limited to individuals with a legitimate business need.",
            "requirements": [
                ("PCI-7.1", "Access is granted on a need-to-know basis only, using role-based access control.", 1,
                 "Document access requirements per role; deny access by default and grant explicitly."),
                ("PCI-7.2", "User access rights are reviewed at least every six months.", 2,
                 "Formally recertify access rights semi-annually; revoke unnecessary access promptly."),
                ("PCI-7.3", "All access to in-scope systems is assigned to an individual user account.", 2,
                 "Prohibit shared, generic, or anonymous accounts for interactive logins to CDE systems."),
            ],
        },
        {
            "code": "PCI-8",
            "title": "Identify Users and Authenticate Access to System Components",
            "description": "Unique user identification and strong authentication enables accountability and prevents unauthorised access.",
            "requirements": [
                ("PCI-8.1", "All users are assigned a unique ID before access to in-scope systems is allowed.", 1,
                 "Prohibit shared, generic, or anonymous accounts; enforce unique user IDs across all CDE systems."),
                ("PCI-8.2", "Multi-factor authentication is required for all non-console administrative access and remote access to the CDE.", 2,
                 "Implement phishing-resistant MFA (hardware token or passkey); software OTP is minimum acceptable."),
                ("PCI-8.3", "Passwords meet minimum complexity: 12+ characters with mixed case, numerals, and special characters.", 2,
                 "Configure password policy enforcement at directory and application level."),
                ("PCI-8.4", "Inactive accounts are disabled within 90 days.", 3,
                 "Automate account suspension based on last login date; review quarterly."),
            ],
        },
        {
            "code": "PCI-9",
            "title": "Restrict Physical Access to Cardholder Data",
            "description": "Physical access to cardholder data or in-scope systems must be controlled and monitored.",
            "requirements": [
                ("PCI-9.1", "Physical access to sensitive areas is restricted with appropriate controls.", 1,
                 "Use badge readers, locks, or biometric controls at entry points to server rooms and data centres."),
                ("PCI-9.2", "Individual physical access is monitored and logged.", 2,
                 "Maintain access logs and review them for anomalies at least monthly."),
                ("PCI-9.3", "Point-of-interaction (POI) devices are protected from tampering and substitution.", 2,
                 "Maintain a device inventory; inspect POI devices periodically for signs of tampering."),
            ],
        },
        {
            "code": "PCI-10",
            "title": "Log and Monitor All Access to System Components and Cardholder Data",
            "description": "Comprehensive audit logging enables detection of anomalies and supports forensic investigation.",
            "requirements": [
                ("PCI-10.1", "Audit logs capture all access to cardholder data including user ID, event type, date/time, and success/failure.", 1,
                 "Enable logging on all in-scope systems; validate log completeness periodically."),
                ("PCI-10.2", "Audit logs are retained for at least 12 months, with three months immediately available.", 2,
                 "Implement centralised log management; archive logs for 12 months and keep 3 months online."),
                ("PCI-10.3", "Audit logs are protected from modification or destruction.", 2,
                 "Use write-once storage or cryptographic integrity verification for audit logs."),
                ("PCI-10.4", "Security alerts and anomalies are reviewed at least daily.", 3,
                 "Deploy a SIEM or equivalent; configure automated alerts and require daily review by security staff."),
            ],
        },
        {
            "code": "PCI-11",
            "title": "Test Security of Systems and Networks Regularly",
            "description": "Regular security testing verifies that controls remain effective as the environment and threat landscape evolve.",
            "requirements": [
                ("PCI-11.1", "Authorised and unauthorised wireless access points are identified at least quarterly.", 1,
                 "Conduct wireless scans quarterly; investigate and remediate any unauthorised access points."),
                ("PCI-11.2", "Internal and external vulnerability scans are performed at least quarterly.", 2,
                 "Use an Approved Scanning Vendor (ASV) for external scans; remediate critical/high findings before passing."),
                ("PCI-11.3", "Penetration testing is conducted at least annually and after significant infrastructure changes.", 3,
                 "Test at network and application layers; remediate all exploitable findings and retest."),
                ("PCI-11.4", "Intrusion detection/prevention systems are deployed at the CDE perimeter and on internal network segments.", 3,
                 "Configure IDS/IPS to alert on and block known attack signatures; review alerts daily."),
            ],
        },
        {
            "code": "PCI-12",
            "title": "Support Information Security with Organisational Policies and Programs",
            "description": "A security policy and supporting programme establishes the foundation for PCI DSS compliance and sets expectations for all personnel.",
            "requirements": [
                ("PCI-12.1", "An information security policy is documented, published, and reviewed at least annually.", 1,
                 "Communicate the policy to all personnel; obtain annual acknowledgements."),
                ("PCI-12.2", "Acceptable use policies are implemented and acknowledged by all personnel annually.", 1,
                 "Require sign-off on acceptable use policies covering all technologies in scope."),
                ("PCI-12.3", "A formal risk assessment process is conducted at least annually and after significant changes.", 2,
                 "Document methodology, risk owners, and remediation plans; report results to senior management."),
                ("PCI-12.4", "Security awareness training is delivered to all personnel upon hire and at least annually.", 2,
                 "Include phishing simulations, social engineering awareness, and role-specific modules."),
                ("PCI-12.5", "An incident response plan is documented and tested at least annually.", 3,
                 "Define roles, responsibilities, and communication procedures; conduct tabletop or live exercises."),
            ],
        },
    ]

    for ctrl in controls_data:
        control = Control(
            framework_id=framework.id,
            code=ctrl["code"],
            title=ctrl["title"],
            description=ctrl["description"],
        )
        db.add(control)
        db.flush()
        for req_code, text, level, guidance in ctrl["requirements"]:
            db.add(Requirement(
                control_id=control.id,
                req_code=req_code,
                text=text,
                maturity_level=level,
                guidance=guidance,
            ))

    db.commit()
    print("PCI DSS v4.0 seeded successfully.")
    return framework.id


# ---------------------------------------------------------------------------
# APRA CPS 234 (2019)
# ---------------------------------------------------------------------------

def seed_apra_cps234(db: Session):
    framework = Framework(
        id=uuid.uuid4(),
        name="APRA CPS 234",
        version="2019",
        description=(
            "APRA Prudential Standard CPS 234 Information Security (effective 1 July 2019) "
            "is mandatory for all APRA-regulated entities including authorised deposit-taking "
            "institutions (ADIs), general and life insurers, and superannuation funds. It requires "
            "entities to maintain information security capabilities commensurate with the size and "
            "extent of threats to their information assets."
        ),
    )
    db.add(framework)
    db.flush()

    controls_data = [
        {
            "code": "CPS234-1",
            "title": "Roles and Responsibilities",
            "description": "The Board, senior management, governing bodies, and individuals must have clearly defined information security responsibilities.",
            "requirements": [
                ("CPS234-1.1", "The Board is ultimately responsible for information security and must be satisfied that the entity maintains adequate capability.", 1,
                 "The Board must approve the information security policy and receive at least annual reporting on the entity's security posture and material incidents."),
                ("CPS234-1.2", "A Chief Information Security Officer (CISO) or equivalent is appointed with appropriate authority.", 2,
                 "The CISO must have direct access to the Board on material security matters and sufficient resources to fulfil the role."),
                ("CPS234-1.3", "Information security responsibilities of all personnel are clearly defined and communicated.", 2,
                 "Embed security responsibilities in position descriptions; include security obligations in employment contracts and induction programmes."),
            ],
        },
        {
            "code": "CPS234-2",
            "title": "Information Security Capability",
            "description": "The entity must maintain an information security capability commensurate with the size and extent of threats to its information assets, and that evolves with the threat environment.",
            "requirements": [
                ("CPS234-2.1", "The entity maintains and actively develops its information security capability in response to the evolving threat environment.", 1,
                 "Regularly assess capability against current threats; document and remediate identified gaps within defined timeframes."),
                ("CPS234-2.2", "The entity ensures that information assets managed by third parties are protected by controls equivalent to those applied internally.", 2,
                 "Include CPS 234 security requirements in contracts with third parties; conduct assurance reviews at least annually."),
                ("CPS234-2.3", "The entity maintains sufficient skilled and qualified information security resources.", 2,
                 "Invest in personnel training, professional certification (CISSP, CISM, CISA), and succession planning to sustain capability."),
            ],
        },
        {
            "code": "CPS234-3",
            "title": "Policy Framework",
            "description": "The entity must maintain a comprehensive information security policy framework that supports its obligations under CPS 234.",
            "requirements": [
                ("CPS234-3.1", "The entity maintains an information security policy framework addressing all material information assets.", 1,
                 "Policies must be approved by the Board or delegated authority and reviewed at least annually."),
                ("CPS234-3.2", "The policy framework is reviewed and updated following significant incidents, organisational changes, or technology changes.", 2,
                 "Trigger policy reviews based on defined events; document version history and approval dates."),
            ],
        },
        {
            "code": "CPS234-4",
            "title": "Information Asset Identification and Classification",
            "description": "All information assets must be identified and classified according to criticality and sensitivity to ensure appropriate controls are applied.",
            "requirements": [
                ("CPS234-4.1", "The entity maintains an up-to-date register of all information assets, including those managed by third parties.", 1,
                 "The asset register must be reviewed at least quarterly and updated following material changes."),
                ("CPS234-4.2", "Information assets are classified by criticality and sensitivity using a documented classification scheme.", 1,
                 "Apply a tiered classification scheme (e.g., Restricted, Confidential, Internal, Public) aligned with ACSC guidelines."),
                ("CPS234-4.3", "Controls are implemented commensurate with the criticality and sensitivity of information assets.", 2,
                 "Map control requirements to classification tiers; verify implementation through testing and audit."),
            ],
        },
        {
            "code": "CPS234-5",
            "title": "Implementation of Controls",
            "description": "Controls must be implemented to protect information assets from vulnerabilities and threats throughout the entire information asset lifecycle.",
            "requirements": [
                ("CPS234-5.1", "Controls protect the confidentiality, integrity, and availability of information assets commensurate with the cyber threat environment.", 1,
                 "Implement layered defences including network controls, endpoint security, identity management, and data protection."),
                ("CPS234-5.2", "Controls address the full information asset lifecycle, including secure disposal and destruction.", 2,
                 "Implement certified media disposal procedures; log and audit all asset disposal events."),
                ("CPS234-5.3", "Controls over information assets managed by third parties are equivalent to those applied to internally managed assets.", 3,
                 "Conduct or commission independent assurance reviews of third-party controls for critical outsourced functions annually."),
            ],
        },
        {
            "code": "CPS234-6",
            "title": "Incident Management",
            "description": "The entity must have robust mechanisms to detect, contain, and recover from information security incidents.",
            "requirements": [
                ("CPS234-6.1", "The entity has mechanisms to detect and respond to information security incidents in a timely manner.", 1,
                 "Implement 24/7 monitoring and a documented incident response plan with defined escalation thresholds and contact trees."),
                ("CPS234-6.2", "Material information security incidents are notified to APRA as soon as practicable and no later than 72 hours after becoming aware.", 1,
                 "Define 'material incident' criteria consistent with APRA's guidance; designate a responsible officer for all APRA notifications."),
                ("CPS234-6.3", "Lessons learned from incidents are systematically captured and incorporated into the security programme.", 2,
                 "Conduct post-incident reviews for all material events; update controls, procedures, and training within 30 days of finalisation."),
            ],
        },
        {
            "code": "CPS234-7",
            "title": "Testing Control Effectiveness",
            "description": "The entity must regularly test the effectiveness of its information security controls, commensurate with the threats it faces.",
            "requirements": [
                ("CPS234-7.1", "The effectiveness of information security controls is tested at least annually, with higher frequency for critical systems.", 1,
                 "Define a control testing programme covering all material controls; document results and remediation plans."),
                ("CPS234-7.2", "Penetration testing of critical systems is conducted at least annually by qualified personnel.", 2,
                 "Engage qualified independent testers; remediate critical findings within 30 days and high findings within 90 days."),
                ("CPS234-7.3", "Vulnerabilities identified during testing are tracked and remediated within defined timeframes.", 2,
                 "Maintain a vulnerability register with risk ratings, owners, and target remediation dates; escalate overdue items."),
                ("CPS234-7.4", "Threat intelligence is incorporated into the security testing programme to ensure test scenarios reflect current threats.", 3,
                 "Subscribe to Australian threat intelligence sources (ACSC, FS-ISAC); use threat intelligence to design realistic test scenarios."),
            ],
        },
        {
            "code": "CPS234-8",
            "title": "Internal Audit",
            "description": "Internal audit must provide independent assurance to the Board and senior management over the information security control framework.",
            "requirements": [
                ("CPS234-8.1", "The internal audit function provides independent assurance over the design and operating effectiveness of information security controls.", 1,
                 "Include information security in the internal audit plan; report findings and recommendations to the Board Audit Committee."),
                ("CPS234-8.2", "Internal audit has sufficient skills and resources to assess information security effectively.", 2,
                 "Ensure audit staff hold relevant certifications (CISA, CISSP) or engage specialist co-source resources for technical assessments."),
            ],
        },
        {
            "code": "CPS234-9",
            "title": "Notification to APRA",
            "description": "APRA must be notified promptly of material information security incidents and material control weaknesses.",
            "requirements": [
                ("CPS234-9.1", "APRA is notified within 72 hours of a material information security incident.", 1,
                 "Maintain a documented notification process; conduct regular drills to verify the process works within required timeframes."),
                ("CPS234-9.2", "APRA is notified of material information security control weaknesses as soon as practicable.", 1,
                 "Define escalation criteria for material weaknesses; assign a senior officer responsible for APRA communications."),
                ("CPS234-9.3", "The Board provides an annual declaration to APRA confirming the adequacy of information security arrangements.", 2,
                 "Prepare the annual declaration based on documented evidence; obtain Board sign-off before submission."),
            ],
        },
    ]

    for ctrl in controls_data:
        control = Control(
            framework_id=framework.id,
            code=ctrl["code"],
            title=ctrl["title"],
            description=ctrl["description"],
        )
        db.add(control)
        db.flush()
        for req_code, text, level, guidance in ctrl["requirements"]:
            db.add(Requirement(
                control_id=control.id,
                req_code=req_code,
                text=text,
                maturity_level=level,
                guidance=guidance,
            ))

    db.commit()
    print("APRA CPS 234 (2019) seeded successfully.")
    return framework.id


# ---------------------------------------------------------------------------
# APRA CPS 230 – Operational Risk Management (2024, effective 1 July 2025)
# ---------------------------------------------------------------------------

def seed_apra_cps230(db: Session):
    framework = Framework(
        id=uuid.uuid4(),
        name="APRA CPS 230",
        version="2024",
        description=(
            "APRA Prudential Standard CPS 230 Operational Risk Management was finalised in "
            "July 2023 and is effective from 1 July 2025. It applies to all APRA-regulated "
            "entities and introduces strengthened requirements for operational risk management, "
            "business continuity, and third-party (service provider) management."
        ),
    )
    db.add(framework)
    db.flush()

    controls_data = [
        {
            "code": "CPS230-1",
            "title": "Operational Risk Management Framework",
            "description": "The entity must maintain a comprehensive operational risk management framework (ORMF) approved by the Board.",
            "requirements": [
                ("CPS230-1.1", "The Board approves and oversees the operational risk management framework.", 1,
                 "The Board must approve the ORMF and receive at least annual reporting on operational risk exposures and incidents."),
                ("CPS230-1.2", "The ORMF defines the entity's risk appetite, tolerance thresholds, and escalation criteria for operational risks.", 1,
                 "Document risk appetite statements and quantitative tolerance thresholds for material operational risks; review at least annually."),
                ("CPS230-1.3", "The entity identifies, assesses, and manages operational risks across the organisation.", 2,
                 "Implement a risk and control self-assessment (RCSA) process; update following material changes to the operating environment."),
            ],
        },
        {
            "code": "CPS230-2",
            "title": "Operational Risk Appetite and Tolerances",
            "description": "The entity must define risk appetite and tolerance levels for operational risks and monitor against these thresholds.",
            "requirements": [
                ("CPS230-2.1", "Operational risk appetite is clearly defined and approved by the Board.", 1,
                 "Align operational risk appetite with overall risk strategy; review at least annually and following material incidents."),
                ("CPS230-2.2", "Tolerance thresholds are established for material operational risks, including disruptions to critical operations.", 2,
                 "Define maximum tolerable disruption (MTD) for critical business services; use these to drive BCP/DR requirements."),
                ("CPS230-2.3", "Breaches of risk tolerances are escalated promptly to senior management and the Board.", 2,
                 "Implement automated monitoring and escalation triggers; document all tolerance breaches and management responses."),
            ],
        },
        {
            "code": "CPS230-3",
            "title": "Business Continuity Planning",
            "description": "The entity must maintain a business continuity plan (BCP) that enables it to continue critical operations through disruptions.",
            "requirements": [
                ("CPS230-3.1", "The entity identifies all critical business services and the minimum level of service required during a disruption.", 1,
                 "Maintain a register of critical business services with defined Recovery Time Objectives (RTOs) and Recovery Point Objectives (RPOs)."),
                ("CPS230-3.2", "A business continuity plan is documented, Board-approved, and kept up to date.", 1,
                 "Review and update the BCP at least annually and following material changes; obtain Board approval."),
                ("CPS230-3.3", "BCP scenarios cover a broad range of disruptions, including extreme but plausible events.", 2,
                 "Include scenarios such as cyber attacks, pandemic, natural disasters, third-party failure, and site outages."),
                ("CPS230-3.4", "Business continuity plans are tested at least annually with results reviewed by senior management.", 2,
                 "Conduct tabletop exercises and operational tests; document findings and track remediation to closure."),
                ("CPS230-3.5", "Recovery capabilities are tested to confirm that RTOs and RPOs can be met.", 3,
                 "Conduct end-to-end DR tests that validate actual recovery times against defined objectives."),
            ],
        },
        {
            "code": "CPS230-4",
            "title": "Service Provider Management",
            "description": "The entity must effectively manage risks arising from its use of service providers, including fourth-party risks.",
            "requirements": [
                ("CPS230-4.1", "The entity maintains a register of all material service providers.", 1,
                 "The register must include the services provided, risk classification, and contract expiry dates; review quarterly."),
                ("CPS230-4.2", "Due diligence is conducted before engaging a material service provider.", 1,
                 "Assess financial stability, security posture, business continuity capability, and regulatory compliance before onboarding."),
                ("CPS230-4.3", "Contracts with material service providers include minimum standards for operational resilience and security.", 2,
                 "Include provisions for APRA access, audit rights, notification obligations, and exit management in all material contracts."),
                ("CPS230-4.4", "The entity monitors the ongoing performance and risk posture of material service providers.", 2,
                 "Conduct annual assurance reviews of material service providers; escalate significant findings to senior management."),
                ("CPS230-4.5", "The entity has documented exit strategies for material service providers.", 3,
                 "Maintain and test exit plans for all material service providers; update plans at least annually."),
            ],
        },
        {
            "code": "CPS230-5",
            "title": "Incident and Disruption Management",
            "description": "The entity must have robust processes to identify, escalate, respond to, and recover from operational incidents and disruptions.",
            "requirements": [
                ("CPS230-5.1", "The entity has defined processes for identifying and escalating operational incidents.", 1,
                 "Define incident severity classifications and escalation pathways; communicate these to all relevant staff."),
                ("CPS230-5.2", "Material incidents are reported to APRA as soon as practicable.", 1,
                 "Notify APRA within 72 hours of becoming aware of a material operational incident; follow up with a detailed report."),
                ("CPS230-5.3", "Post-incident reviews are conducted for material incidents, and lessons learned are incorporated into the ORMF.", 2,
                 "Complete post-incident reviews within 30 days; update controls, procedures, and training based on findings."),
            ],
        },
        {
            "code": "CPS230-6",
            "title": "Change and Project Risk Management",
            "description": "The entity must manage operational risks arising from significant changes, including technology projects and outsourcing transitions.",
            "requirements": [
                ("CPS230-6.1", "Operational risks associated with significant changes are identified and managed.", 1,
                 "Incorporate operational risk assessment into the change management and project governance frameworks."),
                ("CPS230-6.2", "The entity's change management process requires sign-off from risk and compliance functions for material changes.", 2,
                 "Define materiality thresholds; require risk function approval before production deployment of material changes."),
            ],
        },
    ]

    for ctrl in controls_data:
        control = Control(
            framework_id=framework.id,
            code=ctrl["code"],
            title=ctrl["title"],
            description=ctrl["description"],
        )
        db.add(control)
        db.flush()
        for req_code, text, level, guidance in ctrl["requirements"]:
            db.add(Requirement(
                control_id=control.id,
                req_code=req_code,
                text=text,
                maturity_level=level,
                guidance=guidance,
            ))

    db.commit()
    print("APRA CPS 230 (2024) seeded successfully.")
    return framework.id


# ---------------------------------------------------------------------------
# AUSTRAC AML/CTF Act (2006) — Anti-Money Laundering and Counter-Terrorism Financing
# ---------------------------------------------------------------------------

def seed_austrac_amlctf(db: Session):
    framework = Framework(
        id=uuid.uuid4(),
        name="AUSTRAC AML/CTF",
        version="2006",
        description=(
            "The Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (AML/CTF Act) "
            "is administered by AUSTRAC (Australian Transaction Reports and Analysis Centre). "
            "It applies to reporting entities providing designated services in Australia, "
            "including banks, credit providers, remittance dealers, digital currency exchanges, "
            "and financial planners."
        ),
    )
    db.add(framework)
    db.flush()

    controls_data = [
        {
            "code": "AML-1",
            "title": "AML/CTF Program",
            "description": "Reporting entities must adopt and maintain an AML/CTF program that identifies, mitigates, and manages money laundering and terrorism financing (ML/TF) risks.",
            "requirements": [
                ("AML-1.1", "The entity has a documented AML/CTF program that is approved by the Board or senior management.", 1,
                 "The AML/CTF program must include Part A (general) and Part B (customer identification) and be reviewed at least every three years."),
                ("AML-1.2", "The AML/CTF program is risk-based and tailored to the entity's designated services and customer base.", 1,
                 "Conduct an ML/TF risk assessment at least every three years or following material changes to the business."),
                ("AML-1.3", "An AML/CTF Compliance Officer is appointed with appropriate authority and resources.", 2,
                 "The Compliance Officer must have direct access to the Board, sufficient seniority, and adequate operational support."),
                ("AML-1.4", "The AML/CTF program is reviewed and updated to reflect changes in the ML/TF risk environment.", 2,
                 "Review the program following AUSTRAC guidance updates, significant regulatory changes, or material business changes."),
            ],
        },
        {
            "code": "AML-2",
            "title": "Customer Identification and Verification (KYC)",
            "description": "Reporting entities must identify and verify the identity of customers before providing designated services.",
            "requirements": [
                ("AML-2.1", "The entity implements customer identification procedures (CIP) for all new customers before designated services commence.", 1,
                 "Collect and verify full name, date of birth, residential address, and government-issued ID for individuals."),
                ("AML-2.2", "Enhanced customer due diligence (ECDD) is applied to high-risk customers and politically exposed persons (PEPs).", 2,
                 "Classify customers by risk rating; apply ECDD including senior management approval for high-risk relationships."),
                ("AML-2.3", "Beneficial ownership of legal entities and trusts is identified and verified.", 2,
                 "Collect beneficial ownership information for all entities with >25% ownership threshold; verify against authoritative sources."),
                ("AML-2.4", "Customer due diligence is reviewed and updated when the entity becomes aware of material changes.", 2,
                 "Implement event-driven and periodic CDD refresh processes; re-verify high-risk customers at least annually."),
            ],
        },
        {
            "code": "AML-3",
            "title": "Ongoing Customer Due Diligence and Transaction Monitoring",
            "description": "Reporting entities must monitor customer transactions on an ongoing basis to detect suspicious activity.",
            "requirements": [
                ("AML-3.1", "The entity implements an ongoing customer due diligence (OCDD) program.", 1,
                 "Monitor customer transactions against expected behaviour; implement risk-based review cycles for customer profiles."),
                ("AML-3.2", "A transaction monitoring system (TMS) is implemented to detect suspicious transactions.", 2,
                 "Deploy a TMS with risk-based scenarios relevant to the entity's services; tune scenarios regularly to reduce false positives."),
                ("AML-3.3", "Alerts generated by the TMS are investigated promptly by trained staff.", 2,
                 "Define SLAs for alert investigation; document outcomes and escalation decisions for all material alerts."),
                ("AML-3.4", "Enhanced monitoring is applied to high-risk customers, products, and geographies.", 3,
                 "Apply additional TMS scenarios and manual review for high-risk relationships; document the enhanced monitoring rationale."),
            ],
        },
        {
            "code": "AML-4",
            "title": "Suspicious Matter Reporting (SMR)",
            "description": "Reporting entities must submit Suspicious Matter Reports (SMRs) to AUSTRAC when they suspect a transaction may be related to ML/TF activity.",
            "requirements": [
                ("AML-4.1", "The entity has documented procedures for identifying, escalating, and submitting SMRs to AUSTRAC.", 1,
                 "SMRs must be submitted to AUSTRAC as soon as practicable; no later than 3 business days after forming a suspicion."),
                ("AML-4.2", "Staff are trained to identify and escalate potential suspicious matters.", 1,
                 "Deliver AML/CTF training to all relevant staff upon hire and at least annually; tailor content to role-specific risk exposure."),
                ("AML-4.3", "The entity does not tip off customers that an SMR has been submitted or is under consideration.", 1,
                 "Implement tipping-off controls including communication restrictions and legal hold procedures when an SMR is filed."),
                ("AML-4.4", "SMR quality and completeness is reviewed periodically to ensure AUSTRAC reporting obligations are met.", 2,
                 "Conduct periodic quality reviews of submitted SMRs; address identified deficiencies through training and process improvement."),
            ],
        },
        {
            "code": "AML-5",
            "title": "Threshold Transaction Reporting (TTR)",
            "description": "Reporting entities must submit Threshold Transaction Reports (TTRs) to AUSTRAC for all cash transactions of AUD 10,000 or more.",
            "requirements": [
                ("AML-5.1", "All cash transactions of AUD 10,000 or more are reported to AUSTRAC within 10 business days.", 1,
                 "Implement automated TTR generation and submission via the AUSTRAC Online portal; validate completeness of all fields."),
                ("AML-5.2", "Structuring transactions to avoid TTR thresholds is identified and reported as suspicious.", 1,
                 "Configure TMS to detect structuring patterns (multiple transactions below AUD 10,000 with similar timing or payees)."),
            ],
        },
        {
            "code": "AML-6",
            "title": "International Funds Transfer Instructions (IFTI) Reporting",
            "description": "Reporting entities must report international funds transfer instructions (IFTIs) of any amount to AUSTRAC.",
            "requirements": [
                ("AML-6.1", "All IFTIs into or out of Australia are reported to AUSTRAC within 10 business days of sending or receiving.", 1,
                 "Implement automated IFTI reporting via AUSTRAC Online; validate all required originator and beneficiary fields are populated."),
                ("AML-6.2", "Correspondent banking relationships are subject to enhanced due diligence.", 2,
                 "Assess respondent banks against FATF standards; obtain senior management approval for all correspondent relationships."),
            ],
        },
        {
            "code": "AML-7",
            "title": "Record Keeping",
            "description": "Reporting entities must maintain records relating to designated services, customer identification, and AUSTRAC reports for seven years.",
            "requirements": [
                ("AML-7.1", "The entity retains all AML/CTF records for a minimum of seven years.", 1,
                 "Implement secure, tamper-evident record storage; verify retention schedules are enforced through automated archiving."),
                ("AML-7.2", "Records are accessible to AUSTRAC upon request within reasonable timeframes.", 1,
                 "Maintain an index of all AML/CTF records; test retrieval capability at least annually."),
                ("AML-7.3", "Customer identification records are retained for seven years after the customer relationship ends.", 2,
                 "Implement retention tracking linked to CRM/customer lifecycle events; conduct periodic audits of record completeness."),
            ],
        },
        {
            "code": "AML-8",
            "title": "AML/CTF Training and Awareness",
            "description": "All relevant staff must receive AML/CTF training appropriate to their role and the entity's risk exposure.",
            "requirements": [
                ("AML-8.1", "AML/CTF training is provided to all relevant staff upon commencement and at least annually thereafter.", 1,
                 "Deliver role-specific training modules; document completion rates and address non-compliance through escalation."),
                ("AML-8.2", "Senior management and the Board receive AML/CTF training appropriate to their oversight responsibilities.", 2,
                 "Provide Board-level briefings at least annually covering regulatory developments, enforcement actions, and the entity's risk profile."),
                ("AML-8.3", "The effectiveness of AML/CTF training is assessed and the programme updated accordingly.", 2,
                 "Measure training effectiveness through assessments; update training content following regulatory changes or significant incidents."),
            ],
        },
        {
            "code": "AML-9",
            "title": "Independent Review and Audit",
            "description": "Reporting entities must have their AML/CTF program reviewed by an independent and suitably qualified party on a risk-based basis.",
            "requirements": [
                ("AML-9.1", "An independent review of the AML/CTF program is conducted at least every three years.", 1,
                 "Engage an independent reviewer with AML/CTF expertise; provide findings to the Board and senior management."),
                ("AML-9.2", "Findings from independent reviews are remediated within defined timeframes.", 2,
                 "Track all findings in a remediation register; escalate overdue items to senior management and the Board."),
                ("AML-9.3", "Internal audit provides ongoing assurance over the operation of AML/CTF controls.", 2,
                 "Include AML/CTF controls in the annual internal audit plan; report findings to the Board Audit Committee."),
            ],
        },
    ]

    for ctrl in controls_data:
        control = Control(
            framework_id=framework.id,
            code=ctrl["code"],
            title=ctrl["title"],
            description=ctrl["description"],
        )
        db.add(control)
        db.flush()
        for req_code, text, level, guidance in ctrl["requirements"]:
            db.add(Requirement(
                control_id=control.id,
                req_code=req_code,
                text=text,
                maturity_level=level,
                guidance=guidance,
            ))

    db.commit()
    print("AUSTRAC AML/CTF Act (2006) seeded successfully.")
    return framework.id


# ---------------------------------------------------------------------------
# Australian Privacy Act 1988 – Australian Privacy Principles (APPs)
# ---------------------------------------------------------------------------

def seed_privacy_act_apps(db: Session):
    framework = Framework(
        id=uuid.uuid4(),
        name="Privacy Act (APPs)",
        version="1988",
        description=(
            "The Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth) set "
            "out how Australian Government agencies and private sector organisations with an "
            "annual turnover exceeding AUD 3 million must handle personal information. "
            "Financial services entities regulated by APRA or ASIC are generally covered "
            "regardless of turnover threshold."
        ),
    )
    db.add(framework)
    db.flush()

    controls_data = [
        {
            "code": "APP-1",
            "title": "Open and Transparent Management of Personal Information",
            "description": "Organisations must manage personal information in an open and transparent way, including maintaining a clearly expressed and up-to-date privacy policy.",
            "requirements": [
                ("APP-1.1", "The entity maintains a clearly expressed, up-to-date privacy policy available free of charge.", 1,
                 "The policy must describe the kinds of personal information collected, purposes of collection, how it is held, how to access/correct it, and how to complain."),
                ("APP-1.2", "The privacy policy is reviewed at least annually and updated to reflect changes in practice.", 2,
                 "Assign a privacy officer responsible for policy maintenance; communicate material updates to customers."),
            ],
        },
        {
            "code": "APP-2",
            "title": "Anonymity and Pseudonymity",
            "description": "Individuals must have the option to interact with the entity anonymously or using a pseudonym, where lawful and practicable.",
            "requirements": [
                ("APP-2.1", "The entity allows individuals to interact without identifying themselves where lawful and practicable.", 1,
                 "Document the circumstances where anonymity or pseudonymity is lawfully required or impracticable (e.g., AML/CTF verification)."),
            ],
        },
        {
            "code": "APP-3",
            "title": "Collection of Solicited Personal Information",
            "description": "Organisations may only collect personal information that is reasonably necessary for one or more of the entity's functions or activities.",
            "requirements": [
                ("APP-3.1", "Personal information is only collected if it is reasonably necessary for the entity's functions or activities.", 1,
                 "Document the purpose of each data collection point; remove collection of data that is no longer necessary."),
                ("APP-3.2", "Sensitive information is only collected with consent or as permitted by law.", 1,
                 "Obtain explicit consent before collecting sensitive information (health, financial, biometric); document consent records."),
                ("APP-3.3", "Personal information is collected by lawful and fair means and directly from the individual where practicable.", 2,
                 "Use clear and non-deceptive collection notices; document any indirect collection and the lawful basis."),
            ],
        },
        {
            "code": "APP-4",
            "title": "Dealing with Unsolicited Personal Information",
            "description": "If an organisation receives personal information it did not solicit, it must determine within a reasonable period whether it could have collected that information under APP 3.",
            "requirements": [
                ("APP-4.1", "The entity has a process for handling unsolicited personal information.", 1,
                 "Document procedures to assess whether unsolicited information could have been collected; destroy or de-identify if not."),
            ],
        },
        {
            "code": "APP-5",
            "title": "Notification of Collection",
            "description": "At or before the time of collection, organisations must take reasonable steps to notify individuals of the collection and its purposes.",
            "requirements": [
                ("APP-5.1", "The entity notifies individuals at or before the time of collecting personal information.", 1,
                 "Display collection notices on all data collection forms, websites, and application interfaces."),
                ("APP-5.2", "Collection notices include the entity's identity, purposes of collection, and consequences of not providing information.", 1,
                 "Ensure collection notices are written in plain language; include a reference to the full privacy policy."),
            ],
        },
        {
            "code": "APP-6",
            "title": "Use or Disclosure of Personal Information",
            "description": "Organisations must only use or disclose personal information for the primary purpose for which it was collected, unless an exception applies.",
            "requirements": [
                ("APP-6.1", "Personal information is only used or disclosed for the primary purpose of collection, or a permitted secondary purpose.", 1,
                 "Implement data-use policies and controls to prevent use of personal information outside authorised purposes."),
                ("APP-6.2", "Disclosures of personal information are documented with the recipient, purpose, and legal basis.", 2,
                 "Maintain a data sharing register; require data sharing agreements for all third-party disclosures."),
            ],
        },
        {
            "code": "APP-7",
            "title": "Direct Marketing",
            "description": "Organisations may only use or disclose personal information for direct marketing purposes if certain conditions are met.",
            "requirements": [
                ("APP-7.1", "Personal information is only used for direct marketing with appropriate consent or under permitted exceptions.", 1,
                 "Obtain opt-in consent for direct marketing; implement suppression lists and opt-out mechanisms."),
                ("APP-7.2", "The entity provides a simple means for individuals to opt out of direct marketing at any time.", 1,
                 "Process opt-out requests within 5 business days; honour suppression requests across all marketing channels."),
            ],
        },
        {
            "code": "APP-8",
            "title": "Cross-border Disclosure of Personal Information",
            "description": "Before disclosing personal information to an overseas recipient, organisations must take reasonable steps to ensure the recipient protects the information in accordance with the APPs.",
            "requirements": [
                ("APP-8.1", "Before disclosing personal information overseas, the entity ensures the recipient upholds APP-equivalent standards.", 1,
                 "Assess data protection laws in the recipient country; include APP-equivalent obligations in contracts with overseas processors."),
                ("APP-8.2", "Cross-border data transfers are documented and approved through a data governance process.", 2,
                 "Maintain a register of overseas disclosures; conduct privacy impact assessments for new cross-border data flows."),
            ],
        },
        {
            "code": "APP-11",
            "title": "Security of Personal Information",
            "description": "Organisations must take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access, modification, or disclosure.",
            "requirements": [
                ("APP-11.1", "The entity implements reasonable technical and organisational measures to secure personal information.", 1,
                 "Apply access controls, encryption, and monitoring proportionate to the sensitivity of the personal information held."),
                ("APP-11.2", "Personal information that is no longer needed is destroyed or de-identified.", 1,
                 "Implement data retention schedules; automate deletion or de-identification of data beyond the retention period."),
                ("APP-11.3", "Data breaches involving personal information are detected, assessed, and managed under the Notifiable Data Breaches (NDB) scheme.", 2,
                 "Implement an incident response process that includes NDB assessment; notify the OAIC and affected individuals within 30 days where required."),
            ],
        },
        {
            "code": "APP-12",
            "title": "Access to Personal Information",
            "description": "Individuals have a right to access personal information held about them, subject to limited exceptions.",
            "requirements": [
                ("APP-12.1", "The entity has a documented process for handling individual access requests.", 1,
                 "Respond to access requests within 30 days; provide information in the format requested where practicable."),
                ("APP-12.2", "The entity does not charge an excessive fee for providing access to personal information.", 1,
                 "Access fees must not be so high as to be a deterrent; free access must be provided where the fee would be excessive."),
            ],
        },
        {
            "code": "APP-13",
            "title": "Correction of Personal Information",
            "description": "Organisations must take reasonable steps to correct personal information when requested, and must notify third parties to whom the information was disclosed.",
            "requirements": [
                ("APP-13.1", "The entity has a documented process for handling correction requests.", 1,
                 "Respond to correction requests within 30 days; if correction is refused, provide a written explanation and the right to complain."),
                ("APP-13.2", "When information is corrected, the entity notifies relevant third parties to whom the information was previously disclosed.", 2,
                 "Maintain records of disclosures to enable notification of corrections; document notification outcomes."),
            ],
        },
    ]

    for ctrl in controls_data:
        control = Control(
            framework_id=framework.id,
            code=ctrl["code"],
            title=ctrl["title"],
            description=ctrl["description"],
        )
        db.add(control)
        db.flush()
        for req_code, text, level, guidance in ctrl["requirements"]:
            db.add(Requirement(
                control_id=control.id,
                req_code=req_code,
                text=text,
                maturity_level=level,
                guidance=guidance,
            ))

    db.commit()
    print("Privacy Act 1988 (APPs) seeded successfully.")
    return framework.id


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

FINANCIAL_FRAMEWORKS = [
    ("PCI DSS",          "4.0",      seed_pci_dss),
    ("APRA CPS 234",     "2019",     seed_apra_cps234),
    ("APRA CPS 230",     "2024",     seed_apra_cps230),
    ("AUSTRAC AML/CTF",  "2006",     seed_austrac_amlctf),
    ("Privacy Act (APPs)", "1988",   seed_privacy_act_apps),
]


def seed_all_financial_frameworks(db: Session):
    """Seed all financial frameworks, skipping any that already exist."""
    from models import Framework as FrameworkModel
    seeded = []
    for name, version, seed_fn in FINANCIAL_FRAMEWORKS:
        existing = db.query(FrameworkModel).filter(
            FrameworkModel.name == name,
            FrameworkModel.version == version,
        ).first()
        if existing:
            print(f"{name} {version} already exists, skipping.")
        else:
            seed_fn(db)
            seeded.append(name)
    return seeded


if __name__ == "__main__":
    import os, sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).parent))
    os.environ.setdefault("DATABASE_URL", "postgresql://geekygoose:dev_password_123@localhost:5432/geekygoose")
    os.environ.setdefault("REDIS_URL", "redis://localhost:6379")
    os.environ.setdefault("MINIO_ENDPOINT", "localhost:9000")
    os.environ.setdefault("MINIO_ACCESS_KEY", "minioadmin")
    os.environ.setdefault("MINIO_SECRET_KEY", "minioadmin123")
    os.environ.setdefault("MINIO_BUCKET", "geekygoose-docs")

    from database import SessionLocal
    db = SessionLocal()
    try:
        seeded = seed_all_financial_frameworks(db)
        print(f"Done. Seeded: {seeded or 'nothing new'}")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()
