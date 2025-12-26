-- Seed Essential Eight framework and MFA control data
-- Migration: 002_seed_essential_eight.sql

-- Insert Essential Eight framework
INSERT INTO frameworks (id, name, version, description) VALUES (
    'e8f1a2b3-c4d5-6e7f-8901-234567890123',
    'Essential Eight',
    '2023',
    'The Essential Eight are eight baseline mitigation strategies to help organisations protect themselves against cybersecurity incidents.'
);

-- Insert Essential Eight MFA control
INSERT INTO controls (id, framework_id, code, title, description) VALUES (
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'e8f1a2b3-c4d5-6e7f-8901-234567890123',
    'E8-MFA',
    'Multi-Factor Authentication',
    'Multi-factor authentication (MFA) is a method of computer access control in which a user is granted access only after successfully presenting two or more pieces of evidence to an authentication mechanism.'
);

-- Insert MFA requirements for Maturity Level 1
INSERT INTO requirements (id, control_id, req_code, text, maturity_level, guidance) VALUES 
(
    'e8r1a2b3-c4d5-6e7f-8901-234567890123',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML1-01',
    'Multi-factor authentication is used by an organisation''s users if they authenticate to their organisation''s internet-facing services.',
    1,
    'This includes webmail, remote desktop gateways, VPNs and other services accessed via the internet. At minimum, this should use something you know (password) and something you have (SMS, authenticator app, hardware token).'
),
(
    'e8r1a2b4-c4d5-6e7f-8901-234567890124',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML1-02',
    'Multi-factor authentication uses either: something you know and something you have, or something you know and something you are.',
    1,
    'Acceptable combinations include: password + SMS code, password + authenticator app, password + hardware token, password + biometrics. SMS is acceptable at this level but not recommended for high-risk environments.'
),
(
    'e8r1a2b5-c4d5-6e7f-8901-234567890125',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML1-03',
    'Multi-factor authentication is configured to use the most secure method available for the service.',
    1,
    'Where multiple MFA options are available, choose the most secure option. For example, if both SMS and authenticator apps are supported, use authenticator apps.'
);

-- Insert MFA requirements for Maturity Level 2
INSERT INTO requirements (id, control_id, req_code, text, maturity_level, guidance) VALUES 
(
    'e8r2a2b3-c4d5-6e7f-8901-234567890126',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML2-01',
    'Multi-factor authentication is used by an organisation''s users if they authenticate to the organisation''s internet-facing services.',
    2,
    'Extends Level 1 requirements to all internet-facing services without exception.'
),
(
    'e8r2a2b4-c4d5-6e7f-8901-234567890127',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML2-02',
    'Multi-factor authentication is used by an organisation''s users if they authenticate to third-party internet-facing services that process, store or communicate their organisation''s sensitive data.',
    2,
    'This includes SaaS applications, cloud services, and third-party platforms that handle organisational data. Examples include Microsoft 365, Google Workspace, Salesforce, and other business applications.'
),
(
    'e8r2a2b5-c4d5-6e7f-8901-234567890128',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML2-03',
    'Multi-factor authentication uses either: something you know and something you have, or something you know and something you are.',
    2,
    'Same as Level 1 but with stronger enforcement. SMS should be avoided where possible in favor of authenticator apps, hardware tokens, or biometrics.'
),
(
    'e8r2a2b6-c4d5-6e7f-8901-234567890129',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML2-04',
    'Multi-factor authentication is verifiable.',
    2,
    'The organisation can demonstrate that MFA is correctly configured and being used. This includes having audit logs, configuration documentation, and evidence of user training.'
);

-- Insert MFA requirements for Maturity Level 3
INSERT INTO requirements (id, control_id, req_code, text, maturity_level, guidance) VALUES 
(
    'e8r3a2b3-c4d5-6e7f-8901-234567890130',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML3-01',
    'Multi-factor authentication is used by an organisation''s users if they authenticate to the organisation''s internet-facing services.',
    3,
    'Comprehensive implementation across all internet-facing services with no exceptions.'
),
(
    'e8r3a2b4-c4d5-6e7f-8901-234567890131',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML3-02',
    'Multi-factor authentication is used by an organisation''s users if they authenticate to third-party internet-facing services that process, store or communicate their organisation''s sensitive data.',
    3,
    'Extends to all third-party services without exception, including lower-risk applications.'
),
(
    'e8r3a2b5-c4d5-6e7f-8901-234567890132',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML3-03',
    'Multi-factor authentication is used by an organisation''s privileged users if they authenticate to their organisation''s systems.',
    3,
    'All privileged accounts (administrators, service accounts with elevated permissions) must use MFA for all system access, including internal systems and infrastructure.'
),
(
    'e8r3a2b6-c4d5-6e7f-8901-234567890133',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML3-04',
    'Multi-factor authentication uses: something you know and something you have that is generated by hardware, or something you know and something you are.',
    3,
    'Requires hardware-based second factors (hardware security keys, smart cards) or biometrics. Software-based tokens and SMS are not acceptable at this level.'
),
(
    'e8r3a2b7-c4d5-6e7f-8901-234567890134',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML3-05',
    'Multi-factor authentication is verifiable.',
    3,
    'Comprehensive verification including regular auditing, automated compliance monitoring, and detailed logging of all authentication events.'
),
(
    'e8r3a2b8-c4d5-6e7f-8901-234567890135',
    'e8c1a2b3-c4d5-6e7f-8901-234567890123',
    'MFA-ML3-06',
    'Unsuccessful multi-factor authentication events are logged, monitored and responded to.',
    3,
    'Failed MFA attempts are monitored for patterns indicating potential attacks. Automated alerting and incident response procedures are in place for suspicious authentication activity.'
);

-- Insert additional Essential Eight controls (partial implementation for context)
INSERT INTO controls (id, framework_id, code, title, description) VALUES 
(
    'e8c2a2b3-c4d5-6e7f-8901-234567890124',
    'e8f1a2b3-c4d5-6e7f-8901-234567890123',
    'E8-APP-CTRL',
    'Application Control',
    'Application control is preventing execution of unapproved/malicious programs including .exe, DLL, scripts (e.g. Windows Script Host, PowerShell, HTA, JavaScript, VBScript) and installers on workstations.'
),
(
    'e8c3a2b3-c4d5-6e7f-8901-234567890125',
    'e8f1a2b3-c4d5-6e7f-8901-234567890123',
    'E8-PATCH-APP',
    'Patch Applications',
    'Patching applications involves updating software applications with patches provided by vendors to address security vulnerabilities.'
),
(
    'e8c4a2b3-c4d5-6e7f-8901-234567890126',
    'e8f1a2b3-c4d5-6e7f-8901-234567890123',
    'E8-PATCH-OS',
    'Patch Operating Systems',
    'Patching operating systems involves updating operating systems with patches provided by vendors to address security vulnerabilities.'
),
(
    'e8c5a2b3-c4d5-6e7f-8901-234567890127',
    'e8f1a2b3-c4d5-6e7f-8901-234567890123',
    'E8-RESTRICT-ADMIN',
    'Restrict Administrative Privileges',
    'Restricting administrative privileges involves implementing the principle of least privilege to minimise the number of users with administrative access.'
);