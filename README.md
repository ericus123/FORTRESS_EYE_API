# FortressEye

## Overview

**FortressEye** is a **local-first, event-driven monitoring, automation, and control platform** for physical environments such as homes, buildings, and secured spaces.

It is designed as a **distributed system** with stateless edge nodes and a centralized local controller. All decision-making logic, safety enforcement, and state management are handled centrally to ensure **predictable behavior, auditability, and safe failure modes**.

FortressEye intentionally avoids cloud dependency, opaque automation, and uncontrolled exposure to the public internet.

---

## System Characteristics

* Local execution only (no mandatory cloud services)
* Centralized control plane
* Stateless edge devices
* Event-driven automation
* Explicit system state and degradation handling
* Human actions always override automation
* Frontend portability (desktop-first, reusable for web/mobile)

---

## Architectural Goals

* Deterministic behavior under normal and degraded conditions
* Clear separation between sensing, decision-making, and actuation
* Strong consistency for system state
* Time-series optimized telemetry handling
* Minimal attack surface
* Long-lived operation without manual intervention

---

## High-Level Architecture

```
┌────────────────────────────────────────────┐
│            Desktop Application             │
│        Electron (Next.js frontend)         │
└──────────────────────┬─────────────────────┘
                       │ HTTP / WebSocket
┌──────────────────────▼─────────────────────┐
│                Backend Core                │
│               (NestJS)                     │
│                                            │
│  - Authentication & RBAC                   │
│  - Device Registry                         │
│  - Rule & Automation Engine                │
│  - Override Manager                        │
│  - Alert Engine                            │
│  - System Health Monitor                   │
│  - Event Orchestrator                      │
└───────────────┬────────────────┬───────────┘
                │                │
        PostgreSQL +          MQTT Broker
        TimescaleDB           (local)
                │                │
        ┌───────▼───────┐   ┌────▼──────────┐
        │  Time-Series  │   │  ESP32 Nodes  │
        │   Telemetry   │   │  Sensors &    │
        │               │   │  Actuators    │
        └───────────────┘   └───────────────┘
```

---

## Execution Model

### Centralized Logic

All automation logic executes centrally.
Edge devices:

* publish telemetry
* accept commands
* do not contain business logic

This guarantees:

* consistent behavior across devices
* simplified updates
* predictable safety handling

---

### Event-Driven Processing

The system reacts to **events**, not continuous polling.

Event sources include:

* sensor telemetry
* device state transitions
* user actions
* scheduled triggers
* system health changes

Events are evaluated by the rule engine and may result in:

* device commands
* alerts
* state transitions
* audit log entries

---

## Device Model

### Device Types

* Sensors (environmental, motion)
* Actuators (lights, fans, alarms)
* Hybrid devices

Each device maintains:

* unique identity
* declared capabilities
* assigned area
* connectivity state
* last-seen timestamp

---

### Provisioning

* Devices join using a provisioned identity
* Admin approval is required
* System assigns final identity and permissions
* Unapproved devices cannot trigger automation

---

## Area Model

Areas act as **logical control boundaries**.

An area:

* groups devices
* defines default automation behavior
* determines alert sensitivity
* aggregates energy estimates

Each device belongs to exactly one area.

---

## Automation & Rule Engine

### Rule Properties

* Declarative
* Data-driven
* Persisted in storage
* Evaluated centrally
* Independent of UI

### Supported Logic

* Boolean operators (AND / OR)
* Nested conditions
* Time-based constraints
* Context-aware evaluation
* Area-scoped targeting

Rules generate actions only when **all conditions are satisfied**.

---

### Manual Override Semantics

* Any manual action creates an override
* Overrides suspend automation for the affected device
* Overrides are time-bound
* Automation resumes automatically after expiration

This is a **hard invariant**:
automation never competes with a human action.

---

## Scheduling

* Mixed scheduling styles per device
* Time-based triggers feed into the same event pipeline
* No separate execution path for scheduled actions

Schedules are treated as event sources, not special logic.

---

## Energy Awareness (Estimation)

* Energy usage is estimated, not measured
* Devices declare nominal wattage
* Runtime × wattage produces energy estimates
* Aggregated per area

Data is intended for:

* trend analysis
* optimization
* insight

Not billing or compliance.

---

## Alert Engine

### Severity Levels

* INFO
* NOTICE
* WARNING
* CRITICAL
* EMERGENCY

### Alert Characteristics

* Context-aware
* Rate-limited
* Preference-aware
* Fully logged

Alerts can originate from:

* threshold violations
* device failures
* system degradation
* security-related events

---

## System Health & Degradation

System health is explicitly modeled.

Tracked dimensions:

* backend availability
* database availability
* MQTT connectivity
* device connectivity
* telemetry freshness

The system differentiates between:

* operational
* degraded
* partially offline
* offline states

Unsafe actions are gated when the system is degraded.

---

## Data Storage

### Relational Storage (PostgreSQL)

Used for:

* users
* roles
* devices
* areas
* rules
* overrides
* schedules
* alert policies
* audit logs

Strong relational integrity is required.

---

### Time-Series Storage (TimescaleDB)

Used for:

* sensor telemetry (fixed interval sampling)
* power estimation logs
* system events
* alert history

Retention and compression policies are enforced at the database layer.

---

## Authentication & Authorization

* Token-based authentication
* Role-based access control (RBAC)
* Explicit permission boundaries
* Audit logging for security-sensitive actions
* Optional location-aware access checks

---

## Frontend Architecture

### Technology

* Next.js (React)
* Single frontend codebase
* No Electron-specific UI logic

---

### Desktop Application (Electron)

The desktop application is the **primary administrative interface**.

Responsibilities include:

* system configuration
* device provisioning
* rule management
* dashboards and analytics
* diagnostics and logs

Desktop UI exposes the **full system capability surface**.

---

### Other Frontends

The same frontend can be reused for:

* browser-based access
* mobile-focused interfaces

These frontends intentionally expose a **restricted subset** of capabilities.

---

## Networking Model

* LAN-only by default
* No public internet exposure
* No inbound open ports
* Optional private VPN access
* Zero-trust assumption outside local network

---

## Failure Philosophy

* No silent failures
* No speculative automation
* No unsafe defaults
* Explicit user feedback on degraded states
* Recovery without undefined behavior

---

## Extensibility

The system is designed to support future extensions such as:

* RTSP-based video ingestion
* computer vision pipelines
* AI advisory layers
* 3D spatial visualization
* native client applications

Extensions integrate via events and shared system state.

---

## Summary

FortressEye is an **infrastructure-level system**, not an application-focused product.

It emphasizes:

* correctness over convenience
* transparency over autonomy
* safety over cleverness

All higher-level intelligence is built on a foundation of **explicit state, controlled execution, and human authority**.
